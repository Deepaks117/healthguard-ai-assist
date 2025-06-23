
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react';

interface ComplianceMetricsProps {
  overall: number;
  hipaa: number;
  gdpr: number;
  documentation: number;
  criticalIssues: number;
  warningIssues: number;
  infoIssues: number;
}

export const ComplianceMetrics = ({
  overall,
  hipaa,
  gdpr,
  documentation,
  criticalIssues,
  warningIssues,
  infoIssues
}: ComplianceMetricsProps) => {
  const getScoreStatus = (score: number) => {
    if (score >= 80) return { color: 'text-green-600', bg: 'bg-green-100', icon: CheckCircle };
    if (score >= 60) return { color: 'text-yellow-600', bg: 'bg-yellow-100', icon: AlertTriangle };
    return { color: 'text-red-600', bg: 'bg-red-100', icon: AlertTriangle };
  };

  const metrics = [
    { name: 'HIPAA Compliance', score: hipaa, trend: '+2.3%' },
    { name: 'GDPR Compliance', score: gdpr, trend: '+1.8%' },
    { name: 'Documentation', score: documentation, trend: '+4.1%' },
  ];

  return (
    <div className="space-y-6">
      {/* Overall Compliance Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Overall Compliance Score
            <Badge variant={overall >= 80 ? 'default' : overall >= 60 ? 'secondary' : 'destructive'}>
              {overall}%
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={overall} className="w-full h-3" />
          <p className="text-sm text-gray-600 mt-2">
            {overall >= 80 ? 'Excellent compliance status' : 
             overall >= 60 ? 'Good compliance, room for improvement' : 
             'Critical compliance issues need attention'}
          </p>
        </CardContent>
      </Card>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metrics.map((metric) => {
          const status = getScoreStatus(metric.score);
          const IconComponent = status.icon;
          
          return (
            <Card key={metric.name}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-full ${status.bg}`}>
                    <IconComponent className={`h-4 w-4 ${status.color}`} />
                  </div>
                  <div className="flex items-center text-sm text-green-600">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {metric.trend}
                  </div>
                </div>
                <h3 className="font-medium text-sm text-gray-600">{metric.name}</h3>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-2xl font-bold">{metric.score}%</span>
                  <Progress value={metric.score} className="w-16 h-2" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Issues Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Issues Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{criticalIssues}</div>
              <div className="text-sm text-gray-600">Critical</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{warningIssues}</div>
              <div className="text-sm text-gray-600">Warning</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{infoIssues}</div>
              <div className="text-sm text-gray-600">Info</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
