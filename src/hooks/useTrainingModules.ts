
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface TrainingModule {
  id: string;
  title: string;
  description: string;
  duration_minutes: number;
  difficulty: string;
  video_url: string | null;
  progress?: {
    completed: boolean;
    score: number | null;
    completed_at: string | null;
  };
}

export const useTrainingModules = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [startingModule, setStartingModule] = useState<string | null>(null);

  const { data: modules, isLoading } = useQuery({
    queryKey: ['training-modules', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      // Get all training modules
      const { data: modulesData, error: modulesError } = await supabase
        .from('training_modules')
        .select('*')
        .order('created_at', { ascending: true });

      if (modulesError) throw modulesError;

      // Get user's progress for each module
      const { data: progressData, error: progressError } = await supabase
        .from('training_progress')
        .select('*')
        .eq('user_id', user.id);

      if (progressError) throw progressError;

      // Combine modules with progress
      const modulesWithProgress = modulesData?.map(module => ({
        ...module,
        progress: progressData?.find(p => p.module_id === module.id)
      })) || [];

      return modulesWithProgress;
    },
    enabled: !!user,
  });

  const startModuleMutation = useMutation({
    mutationFn: async (moduleId: string) => {
      if (!user) throw new Error('User not authenticated');

      // Log the action
      await supabase.rpc('log_user_action', {
        action_type: 'training_module_started',
        resource_type: 'training_module',
        resource_id: moduleId,
        details: { timestamp: new Date().toISOString() }
      });

      // Create or update progress
      const { error } = await supabase
        .from('training_progress')
        .upsert({
          user_id: user.id,
          module_id: moduleId,
          completed: false,
          created_at: new Date().toISOString()
        });

      if (error) throw error;
      return moduleId;
    },
    onSuccess: (moduleId) => {
      toast({
        title: 'Training Started',
        description: 'You have successfully started the training module.',
      });
      queryClient.invalidateQueries({ queryKey: ['training-modules'] });
      queryClient.invalidateQueries({ queryKey: ['training-progress'] });
      setStartingModule(null);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to start training module.',
        variant: 'destructive',
      });
      setStartingModule(null);
    },
  });

  const completeModuleMutation = useMutation({
    mutationFn: async ({ moduleId, score }: { moduleId: string; score: number }) => {
      if (!user) throw new Error('User not authenticated');

      // Log the action
      await supabase.rpc('log_user_action', {
        action_type: 'training_module_completed',
        resource_type: 'training_module',
        resource_id: moduleId,
        details: { score, timestamp: new Date().toISOString() }
      });

      // Update progress as completed
      const { error } = await supabase
        .from('training_progress')
        .upsert({
          user_id: user.id,
          module_id: moduleId,
          completed: true,
          score,
          completed_at: new Date().toISOString()
        });

      if (error) throw error;
      return moduleId;
    },
    onSuccess: () => {
      toast({
        title: 'Module Completed!',
        description: 'Congratulations! You have completed the training module.',
      });
      queryClient.invalidateQueries({ queryKey: ['training-modules'] });
      queryClient.invalidateQueries({ queryKey: ['training-progress'] });
    },
  });

  const handleStartModule = (moduleId: string) => {
    setStartingModule(moduleId);
    startModuleMutation.mutate(moduleId);
  };

  const handleCompleteModule = (moduleId: string, score: number) => {
    completeModuleMutation.mutate({ moduleId, score });
  };

  return {
    modules,
    isLoading,
    startingModule,
    handleStartModule,
    handleCompleteModule,
    isCompleting: completeModuleMutation.isPending,
  };
};
