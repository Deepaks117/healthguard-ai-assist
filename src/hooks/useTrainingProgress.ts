
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
  const { user, isLoading: authLoading } = useAuth();

  return useQuery({
    queryKey: ['training-progress', user?.id],
    queryFn: async (): Promise<TrainingProgress> => {
      if (!user) {
        // Return default values for unauthenticated users
        return {
          totalModules: 0,
          completedModules: 0,
          progressPercentage: 0,
          recentlyCompleted: [],
        };
      }

      try {
        // Get all training modules
        const { data: modules, error: modulesError } = await supabase
          .from('training_modules')
          .select('id, title');

        if (modulesError) {
          console.error('Error fetching training modules:', modulesError);
          throw new Error('Failed to fetch training modules');
        }

        // Get user's training progress
        const { data: progress, error: progressError } = await supabase
          .from('training_progress')
          .select('module_id, completed, completed_at, training_modules(title)')
          .eq('user_id', user.id)
          .eq('completed', true);

        if (progressError) {
          console.error('Error fetching training progress:', progressError);
          throw new Error('Failed to fetch training progress');
        }

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
      } catch (error) {
        console.error('Training progress query error:', error);
        // Return default values on error
        return {
          totalModules: 0,
          completedModules: 0,
          progressPercentage: 0,
          recentlyCompleted: [],
        };
      }
    },
    enabled: !authLoading, // Only run query when auth state is determined
    retry: (failureCount, error) => {
      // Don't retry on authentication errors
      if (error instanceof Error && error.message.includes('not authenticated')) {
        return false;
      }
      return failureCount < 3;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
