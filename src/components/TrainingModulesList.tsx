
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { PlayCircle, Clock, CheckCircle, BookOpen } from 'lucide-react';
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

export const TrainingModulesList = () => {
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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading training modules...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#003366]">Training Modules</h2>
        <Badge variant="outline" className="text-sm">
          {modules?.filter(m => m.progress?.completed).length || 0} of {modules?.length || 0} completed
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {modules?.map((module) => (
          <Card key={module.id} className="relative">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{module.title}</CardTitle>
                  <p className="text-sm text-gray-600 mt-2">{module.description}</p>
                </div>
                {module.progress?.completed && (
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>{module.duration_minutes} minutes</span>
                </div>
                <Badge className={getDifficultyColor(module.difficulty)}>
                  {module.difficulty}
                </Badge>
              </div>

              {module.progress?.completed ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Completed</span>
                    {module.progress.score && (
                      <Badge variant="default">{module.progress.score}% Score</Badge>
                    )}
                  </div>
                  <Progress value={100} className="w-full" />
                  <p className="text-xs text-gray-500">
                    Completed on {new Date(module.progress.completed_at!).toLocaleDateString()}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {module.progress ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">In Progress</span>
                        <Badge variant="secondary">Started</Badge>
                      </div>
                      <Progress value={50} className="w-full" />
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => completeModuleMutation.mutate({ 
                            moduleId: module.id, 
                            score: Math.floor(Math.random() * 20) + 80 // Simulate score
                          })}
                          disabled={completeModuleMutation.isPending}
                          className="flex-1"
                        >
                          <Award className="h-4 w-4 mr-2" />
                          Complete Module
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      onClick={() => {
                        setStartingModule(module.id);
                        startModuleMutation.mutate(module.id);
                      }}
                      disabled={startingModule === module.id}
                      className="w-full"
                    >
                      <PlayCircle className="h-4 w-4 mr-2" />
                      {startingModule === module.id ? 'Starting...' : 'Start Module'}
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
