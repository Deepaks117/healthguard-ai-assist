
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface LogActionParams {
  action: string;
  resourceType?: string;
  resourceId?: string;
  details?: any;
}

export const useAuditLogger = () => {
  const { user } = useAuth();

  const logAction = useMutation({
    mutationFn: async ({ action, resourceType, resourceId, details }: LogActionParams) => {
      if (!user) {
        console.warn('User not authenticated, skipping audit log');
        return;
      }

      const { data, error } = await supabase.rpc('log_user_action', {
        action_type: action,
        resource_type: resourceType || null,
        resource_id: resourceId || null,
        details: details ? JSON.stringify(details) : null
      });

      if (error) {
        console.error('Failed to log action:', error);
        throw error;
      }

      return data;
    },
    onError: (error) => {
      console.error('Audit log error:', error);
      // Don't throw error to prevent blocking user actions
    },
  });

  return {
    logAction: (params: LogActionParams) => logAction.mutate(params),
    isLogging: logAction.isPending,
  };
};
