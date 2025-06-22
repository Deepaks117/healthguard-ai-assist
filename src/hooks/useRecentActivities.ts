
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface RecentActivity {
  id: string;
  type: string;
  message: string;
  time: string;
  status: 'success' | 'warning' | 'info';
}

export const useRecentActivities = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['recent-activities', user?.id],
    queryFn: async (): Promise<RecentActivity[]> => {
      if (!user) throw new Error('User not authenticated');

      const { data: notifications, error } = await supabase
        .from('notifications')
        .select('id, type, title, message, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;

      if (!notifications || notifications.length === 0) {
        return [];
      }

      return notifications.map(notification => ({
        id: notification.id,
        type: notification.type || 'info',
        message: notification.message || notification.title || 'Activity recorded',
        time: getRelativeTime(notification.created_at),
        status: getStatusFromType(notification.type),
      }));
    },
    enabled: !!user,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

function getRelativeTime(timestamp: string): string {
  const now = new Date();
  const past = new Date(timestamp);
  const diffInMs = now.getTime() - past.getTime();
  
  const minutes = Math.floor(diffInMs / (1000 * 60));
  const hours = Math.floor(diffInMs / (1000 * 60 * 60));
  const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (minutes < 60) {
    return `${minutes} minutes ago`;
  } else if (hours < 24) {
    return `${hours} hours ago`;
  } else {
    return `${days} days ago`;
  }
}

function getStatusFromType(type: string | null): 'success' | 'warning' | 'info' {
  switch (type) {
    case 'compliance_scan':
    case 'training_complete':
      return 'success';
    case 'risk_detected':
    case 'compliance_issue':
      return 'warning';
    default:
      return 'info';
  }
}
