
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Filter, Download, Eye, Clock, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface AuditLog {
  id: string;
  action: string;
  resource_type: string | null;
  resource_id: string | null;
  details: any;
  created_at: string;
  ip_address: string | null;
}

export const AuditTrail = () => {
  const { user } = useAuth();
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: auditLogs, isLoading } = useQuery({
    queryKey: ['audit-logs', user?.id, filter],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      let query = supabase
        .from('audit_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(100);

      if (filter !== 'all') {
        query = query.eq('action', filter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as AuditLog[];
    },
    enabled: !!user,
  });

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'document_uploaded':
      case 'document_scanned':
        return <FileText className="h-4 w-4" />;
      case 'training_module_started':
      case 'training_module_completed':
        return <Eye className="h-4 w-4" />;
      case 'login':
      case 'logout':
        return <User className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'document_uploaded':
      case 'training_module_completed':
        return 'bg-green-100 text-green-800';
      case 'document_scanned':
      case 'training_module_started':
        return 'bg-blue-100 text-blue-800';
      case 'login':
        return 'bg-purple-100 text-purple-800';
      case 'logout':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const formatAction = (action: string) => {
    return action
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const exportAuditLogs = () => {
    if (!auditLogs) return;

    const csvContent = [
      ['Timestamp', 'Action', 'Resource Type', 'Resource ID', 'Details'].join(','),
      ...auditLogs.map(log => [
        new Date(log.created_at).toISOString(),
        log.action,
        log.resource_type || '',
        log.resource_id || '',
        JSON.stringify(log.details || {})
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredLogs = auditLogs?.filter(log =>
    searchTerm === '' || 
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (log.resource_type && log.resource_type.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (isLoading) {
    return <div className="text-center py-8">Loading audit logs...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Audit Trail</span>
            </CardTitle>
            <Button onClick={exportAuditLogs} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex items-center space-x-2 flex-1">
              <Filter className="h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search audit logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="document_uploaded">Document Uploaded</SelectItem>
                <SelectItem value="document_scanned">Document Scanned</SelectItem>
                <SelectItem value="training_module_started">Training Started</SelectItem>
                <SelectItem value="training_module_completed">Training Completed</SelectItem>
                <SelectItem value="login">Login</SelectItem>
                <SelectItem value="logout">Logout</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            {filteredLogs && filteredLogs.length > 0 ? (
              filteredLogs.map((log) => (
                <div key={log.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${getActionColor(log.action)}`}>
                        {getActionIcon(log.action)}
                      </div>
                      <div>
                        <h4 className="font-medium">{formatAction(log.action)}</h4>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Clock className="h-3 w-3" />
                          <span>{new Date(log.created_at).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline">
                      {log.resource_type || 'System'}
                    </Badge>
                  </div>
                  
                  {log.details && Object.keys(log.details).length > 0 && (
                    <div className="pl-11">
                      <details className="text-sm">
                        <summary className="cursor-pointer text-gray-600 hover:text-gray-800">
                          View Details
                        </summary>
                        <pre className="mt-2 p-2 bg-gray-50 rounded text-xs overflow-auto">
                          {JSON.stringify(log.details, null, 2)}
                        </pre>
                      </details>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No audit logs found</p>
                <p className="text-sm">Activity will appear here as you use the system</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
