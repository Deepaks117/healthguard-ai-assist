
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface ComplianceStats {
  overall: number;
  hipaa: number;
  gdpr: number;
  documentation: number;
  totalReports: number;
  criticalIssues: number;
  warningIssues: number;
  infoIssues: number;
}

export const useComplianceStats = () => {
  const { user, isLoading: authLoading } = useAuth();

  return useQuery({
    queryKey: ['compliance-stats', user?.id],
    queryFn: async (): Promise<ComplianceStats> => {
      if (!user) {
        // Return default values for unauthenticated users
        return {
          overall: 0,
          hipaa: 0,
          gdpr: 0,
          documentation: 0,
          totalReports: 0,
          criticalIssues: 0,
          warningIssues: 0,
          infoIssues: 0,
        };
      }

      try {
        const { data: reports, error } = await supabase
          .from('compliance_reports')
          .select('score, issues')
          .eq('user_id', user.id);

        if (error) {
          console.error('Error fetching compliance reports:', error);
          throw new Error('Failed to fetch compliance data');
        }

        if (!reports || reports.length === 0) {
          // Return default values when no reports exist
          return {
            overall: 0,
            hipaa: 0,
            gdpr: 0,
            documentation: 0,
            totalReports: 0,
            criticalIssues: 0,
            warningIssues: 0,
            infoIssues: 0,
          };
        }

        // Calculate overall score as average with improved algorithm
        const validScores = reports.filter(report => report.score !== null && report.score >= 0);
        const totalScore = validScores.reduce((sum, report) => sum + (report.score || 0), 0);
        const overall = validScores.length > 0 ? Math.round(totalScore / validScores.length) : 0;

        // Count issues by type with better error handling
        let criticalIssues = 0;
        let warningIssues = 0;
        let infoIssues = 0;

        reports.forEach(report => {
          if (report.issues && Array.isArray(report.issues)) {
            report.issues.forEach((issue: any) => {
              if (issue && typeof issue === 'object' && issue.type) {
                switch (issue.type.toLowerCase()) {
                  case 'critical':
                    criticalIssues++;
                    break;
                  case 'warning':
                    warningIssues++;
                    break;
                  case 'info':
                  case 'information':
                    infoIssues++;
                    break;
                }
              }
            });
          }
        });

        // Calculate specific compliance scores based on actual data
        const hipaaScore = Math.max(0, overall - Math.floor(criticalIssues * 5) - Math.floor(warningIssues * 2));
        const gdprScore = Math.max(0, overall - Math.floor(criticalIssues * 4) - Math.floor(warningIssues * 2));
        const documentationScore = Math.max(0, overall - Math.floor(criticalIssues * 3) - Math.floor(warningIssues * 1));

        return {
          overall,
          hipaa: Math.min(100, hipaaScore),
          gdpr: Math.min(100, gdprScore),
          documentation: Math.min(100, documentationScore),
          totalReports: reports.length,
          criticalIssues,
          warningIssues,
          infoIssues,
        };
      } catch (error) {
        console.error('Compliance stats query error:', error);
        // Return default values on error
        return {
          overall: 0,
          hipaa: 0,
          gdpr: 0,
          documentation: 0,
          totalReports: 0,
          criticalIssues: 0,
          warningIssues: 0,
          infoIssues: 0,
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
