
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, Calendar, Filter } from 'lucide-react';

interface Report {
  id: string;
  title: string;
  type: 'monthly' | 'quarterly' | 'annual' | 'audit';
  generatedDate: string;
  status: 'completed' | 'in-progress' | 'scheduled';
  score?: number;
  size: string;
}

interface ComplianceReportsProps {
  reports?: Report[];
}

export const ComplianceReports = ({ reports }: ComplianceReportsProps) => {
  // Sample reports data if none provided
  const defaultReports: Report[] = [
    {
      id: '1',
      title: 'June 2024 Compliance Report',
      type: 'monthly',
      generatedDate: '2024-06-30',
      status: 'completed',
      score: 85,
      size: '2.3 MB'
    },
    {
      id: '2',
      title: 'Q2 2024 Risk Assessment',
      type: 'quarterly',
      generatedDate: '2024-06-30',
      status: 'completed',
      score: 88,
      size: '4.1 MB'
    },
    {
      id: '3',
      title: 'HIPAA Audit Report 2024',
      type: 'audit',
      generatedDate: '2024-06-15',
      status: 'completed',
      score: 92,
      size: '8.7 MB'
    },
    {
      id: '4',
      title: 'July 2024 Compliance Report',
      type: 'monthly',
      generatedDate: '2024-07-01',
      status: 'in-progress',
      size: '- MB'
    }
  ];

  const reportsData = reports || defaultReports;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'in-progress': return 'secondary';
      case 'scheduled': return 'outline';
      default: return 'outline';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'audit': return 'bg-red-100 text-red-800';
      case 'annual': return 'bg-purple-100 text-purple-800';
      case 'quarterly': return 'bg-blue-100 text-blue-800';
      case 'monthly': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Compliance Reports</CardTitle>
          <div className="flex space-x-2">
            <Button size="sm" variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button size="sm">
              <FileText className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {reportsData.map((report) => (
          <div key={report.id} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-gray-500" />
                <div>
                  <h3 className="font-medium">{report.title}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(report.type)}`}>
                      {report.type.charAt(0).toUpperCase() + report.type.slice(1)}
                    </span>
                    <Badge variant={getStatusColor(report.status)}>
                      {report.status.replace('-', ' ')}
                    </Badge>
                    {report.score && (
                      <span className="text-sm text-gray-600">
                        Score: {report.score}%
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="text-right text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>{report.generatedDate}</span>
                  </div>
                  <div>{report.size}</div>
                </div>
                {report.status === 'completed' && (
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {reportsData.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-4" />
            <p>No reports available</p>
            <Button className="mt-4">
              Generate Your First Report
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
