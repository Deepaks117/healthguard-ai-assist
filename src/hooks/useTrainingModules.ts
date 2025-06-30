
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
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [startingModule, setStartingModule] = useState<string | null>(null);

  const { data: modules, isLoading } = useQuery({
    queryKey: ['training-modules', user?.id],
    queryFn: async () => {
      if (!user) {
        return [];
      }

      try {
        // Get all training modules
        const { data: modulesData, error: modulesError } = await supabase
          .from('training_modules')
          .select('*')
          .order('created_at', { ascending: true });

        if (modulesError) {
          console.error('Error fetching training modules:', modulesError);
          throw new Error('Failed to fetch training modules');
        }

        // Get user's progress for each module
        const { data: progressData, error: progressError } = await supabase
          .from('training_progress')
          .select('*')
          .eq('user_id', user.id);

        if (progressError) {
          console.error('Error fetching training progress:', progressError);
          throw new Error('Failed to fetch training progress');
        }

        // Combine modules with progress
        const modulesWithProgress = modulesData?.map(module => ({
          ...module,
          progress: progressData?.find(p => p.module_id === module.id)
        })) || [];

        return modulesWithProgress;
      } catch (error) {
        console.error('Training modules query error:', error);
        toast({
          title: 'Error Loading Modules',
          description: 'Failed to load training modules. Please try again.',
          variant: 'destructive',
        });
        return [];
      }
    },
    enabled: !authLoading && !!user,
    retry: (failureCount, error) => {
      if (error instanceof Error && error.message.includes('not authenticated')) {
        return false;
      }
      return failureCount < 3;
    },
  });

  const startModuleMutation = useMutation({
    mutationFn: async (moduleId: string) => {
      if (!user) throw new Error('User not authenticated');

      try {
        // Log the action
        const { error: logError } = await supabase.rpc('log_user_action', {
          action_type: 'training_module_started',
          resource_type: 'training_module',
          resource_id: moduleId,
          details: { timestamp: new Date().toISOString() }
        });

        if (logError) {
          console.warn('Failed to log training start action:', logError);
        }

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
      } catch (error) {
        console.error('Error starting training module:', error);
        throw new Error('Failed to start training module');
      }
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
      console.error('Start module mutation error:', error);
      toast({
        title: 'Error Starting Module',
        description: error instanceof Error ? error.message : 'Failed to start training module.',
        variant: 'destructive',
      });
      setStartingModule(null);
    },
  });

  const completeModuleMutation = useMutation({
    mutationFn: async ({ moduleId, score }: { moduleId: string; score: number }) => {
      if (!user) throw new Error('User not authenticated');

      try {
        // Log the action
        const { error: logError } = await supabase.rpc('log_user_action', {
          action_type: 'training_module_completed',
          resource_type: 'training_module',
          resource_id: moduleId,
          details: { score, timestamp: new Date().toISOString() }
        });

        if (logError) {
          console.warn('Failed to log training completion action:', logError);
        }

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
      } catch (error) {
        console.error('Error completing training module:', error);
        throw new Error('Failed to complete training module');
      }
    },
    onSuccess: () => {
      toast({
        title: 'Module Completed!',
        description: 'Congratulations! You have completed the training module.',
      });
      queryClient.invalidateQueries({ queryKey: ['training-modules'] });
      queryClient.invalidateQueries({ queryKey: ['training-progress'] });
    },
    onError: (error) => {
      console.error('Complete module mutation error:', error);
      toast({
        title: 'Error Completing Module',
        description: error instanceof Error ? error.message : 'Failed to complete training module.',
        variant: 'destructive',
      });
    },
  });

  const handleStartModule = (moduleId: string) => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to start training modules.',
        variant: 'destructive',
      });
      return;
    }
    setStartingModule(moduleId);
    startModuleMutation.mutate(moduleId);
  };

  const handleCompleteModule = (moduleId: string, score: number) => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to complete training modules.',
        variant: 'destructive',
      });
      return;
    }
    completeModuleMutation.mutate({ moduleId, score });
  };

  return {
    modules,
    isLoading: isLoading || authLoading,
    startingModule,
    handleStartModule,
    handleCompleteModule,
    isCompleting: completeModuleMutation.isPending,
  };
};
