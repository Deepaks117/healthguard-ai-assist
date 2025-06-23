
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Shield, Eye, FileText } from 'lucide-react';

interface RiskItem {
  id: string;
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  category: string;
  lastDetected: string;
  status: 'active' | 'resolved' | 'investigating';
}

interface RiskAssessmentProps {
  risks?: RiskItem[];
}

export const RiskAssessment = ({ risks }: RiskAssessmentProps) => {
  // Sample risk data if none provided
  const defaultRisks: RiskItem[] = [
    {
      id: '1',
      title: 'Unencrypted Data Transmission',
      description: 'Patient data is being transmitted without proper encryption protocols',
      severity: 'high',
      category: 'Data Security',
      lastDetected: '2 hours ago',
      status: 'active'
    },
    {
      id: '2',
      title: 'Missing Access Logs',
      description: 'User access to patient records is not being properly logged',
      severity: 'medium',
      category: 'Audit Trail',
      lastDetected: '1 day ago',
      status: 'investigating'
    },
    {
      id: '3',
      title: 'Outdated Privacy Policy',
      description: 'Privacy policy has not been updated to reflect current practices',
      severity: 'low',
      category: 'Documentation',
      lastDetected: '3 days ago',
      status: 'active'
    }
  ];

  const riskData = risks || defaultRisks;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-red-600';
      case 'investigating': return 'text-yellow-600';
      case 'resolved': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'medium': return <Eye className="h-4 w-4 text-yellow-500" />;
      case 'low': return <Shield className="h-4 w-4 text-blue-500" />;
      default: return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Risk Assessment
          <Badge variant="outline">{riskData.length} risks identified</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {riskData.map((risk) => (
          <div key={risk.id} className="border rounded-lg p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2">
                {getSeverityIcon(risk.severity)}
                <h3 className="font-medium">{risk.title}</h3>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={getSeverityColor(risk.severity)}>
                  {risk.severity.toUpperCase()}
                </Badge>
                <span className={`text-sm ${getStatusColor(risk.status)}`}>
                  {risk.status.charAt(0).toUpperCase() + risk.status.slice(1)}
                </span>
              </div>
            </div>
            
            <p className="text-sm text-gray-600">{risk.description}</p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>Category: {risk.category}</span>
                <span>Last detected: {risk.lastDetected}</span>
              </div>
              <Button size="sm" variant="outline">
                View Details
              </Button>
            </div>
          </div>
        ))}
        
        {riskData.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Shield className="h-12 w-12 mx-auto mb-4 text-green-500" />
            <p>No active risks detected</p>
            <p className="text-sm">Your compliance is in good standing</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
