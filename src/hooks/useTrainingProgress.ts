
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface TrainingProgress {
  totalModules: number;
  completedModules: number;
  progressPercentage: number;
  recentlyCompleted: Array<{
    id: string;
    title: string;
    completedAt: string;
  }>;
}

export const useTrainingProgress = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['training-progress', user?.id],
    queryFn: async (): Promise<TrainingProgress> => {
      if (!user) throw new Error('User not authenticated');

      // Get all training modules
      const { data: modules, error: modulesError } = await supabase
        .from('training_modules')
        .select('id, title');

      if (modulesError) throw modulesError;

      // Get user's training progress
      const { data: progress, error: progressError } = await supabase
        .from('training_progress')
        .select('module_id, completed, completed_at, training_modules(title)')
        .eq('user_id', user.id)
        .eq('completed', true);

      if (progressError) throw progressError;

      const totalModules = modules?.length || 0;
      const completedModules = progress?.length || 0;
      const progressPercentage = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;

      const recentlyCompleted = (progress || [])
        .slice(0, 3)
        .map(p => ({
          id: p.module_id,
          title: (p.training_modules as any)?.title || 'Unknown Module',
          completedAt: p.completed_at || '',
        }));

      return {
        totalModules,
        completedModules,
        progressPercentage,
        recentlyCompleted,
      };
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
