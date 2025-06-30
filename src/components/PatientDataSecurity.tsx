
import { useState } from "react";
import { Database, Shield, Upload, Search, FileText, Lock, Download, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const PatientDataSecurity = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const storageStats = {
    totalFiles: 1247,
    encrypted: 1245,
    size: "2.4 GB",
    lastBackup: "2 hours ago"
  };

  const recentFiles = [
    { id: 1, name: "Patient_Record_JD_001.pdf", type: "Medical Record", size: "2.4 MB", encrypted: true, lastAccessed: "Today 2:30 PM" },
    { id: 2, name: "Lab_Results_MS_045.pdf", type: "Lab Results", size: "1.8 MB", encrypted: true, lastAccessed: "Today 11:15 AM" },
    { id: 3, name: "Consent_Form_AB_012.pdf", type: "Consent Form", size: "856 KB", encrypted: true, lastAccessed: "Yesterday 4:45 PM" },
    { id: 4, name: "Treatment_Plan_KL_078.docx", type: "Treatment Plan", size: "1.2 MB", encrypted: true, lastAccessed: "Yesterday 2:20 PM" },
    { id: 5, name: "Insurance_Info_PQ_033.pdf", type: "Insurance", size: "674 KB", encrypted: true, lastAccessed: "2 days ago" }
  ];

  const accessLogs = [
    { user: "Dr. Sarah Johnson", action: "Viewed", file: "Patient_Record_JD_001.pdf", time: "2:30 PM", ip: "192.168.1.45" },
    { user: "Nurse Mike Chen", action: "Downloaded", file: "Lab_Results_MS_045.pdf", time: "11:15 AM", ip: "192.168.1.32" },
    { user: "Dr. Emily Rodriguez", action: "Uploaded", file: "Treatment_Plan_KL_078.docx", time: "Yesterday 4:45 PM", ip: "192.168.1.28" },
    { user: "Admin Lisa Park", action: "Accessed", file: "System Backup", time: "Yesterday 2:00 AM", ip: "192.168.1.10" }
  ];

  const integrations = [
    { name: "Epic EHR", status: "Connected", lastSync: "15 minutes ago", records: 892, health: "Excellent" },
    { name: "Cerner PowerChart", status: "Connected", lastSync: "1 hour ago", records: 355, health: "Good" },
    { name: "Lab Corp Portal", status: "Configuration Required", lastSync: "Setup pending", records: 0, health: "Setup Required" },
    { name: "Imaging System", status: "Connected", lastSync: "3 hours ago", records: 156, health: "Good" }
  ];

  const getIntegrationStatusColor = (status: string) => {
    switch (status) {
      case 'Connected': return 'border-[#228B22] text-[#228B22]';
      case 'Configuration Required': return 'border-yellow-500 text-yellow-500';
      case 'Error': return 'border-red-500 text-red-500';
      default: return 'border-gray-500 text-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-[#003366]">Patient Data Security</h2>
        <Badge variant="outline" className="border-[#228B22] text-[#228B22]">
          HIPAA Compliant Storage
        </Badge>
      </div>

      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-[#228B22]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Files</CardTitle>
            <FileText className="h-4 w-4 text-[#228B22]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#228B22]">{storageStats.totalFiles.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Patient records secured</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#003366]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Encryption Status</CardTitle>
            <Lock className="h-4 w-4 text-[#003366]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#003366]">{((storageStats.encrypted / storageStats.totalFiles) * 100).toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">{storageStats.encrypted} files encrypted</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#ADD8E6]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
            <Database className="h-4 w-4 text-[#ADD8E6]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#ADD8E6]">{storageStats.size}</div>
            <p className="text-xs text-muted-foreground">Secure cloud storage</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#228B22]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Backup</CardTitle>
            <Shield className="h-4 w-4 text-[#228B22]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#228B22]">✓</div>
            <p className="text-xs text-muted-foreground">{storageStats.lastBackup}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="files" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="files">File Management</TabsTrigger>
          <TabsTrigger value="integrations">EHR Integrations</TabsTrigger>
          <TabsTrigger value="access">Access Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="files" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Secure File Storage</CardTitle>
                <Button className="bg-[#003366] hover:bg-[#004080]">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload File
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search patient files..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
              </div>

              <div className="space-y-2">
                {recentFiles.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-[#003366]" />
                      <div>
                        <p className="font-medium">{file.name}</p>
                        <p className="text-sm text-gray-500">{file.type} • {file.size}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="border-[#228B22] text-[#228B22]">
                        <Lock className="h-3 w-3 mr-1" />
                        Encrypted
                      </Badge>
                      <span className="text-xs text-gray-400">{file.lastAccessed}</span>
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>EHR System Integrations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {integrations.map((integration, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Database className="h-6 w-6 text-[#003366]" />
                    <div>
                      <p className="font-medium">{integration.name}</p>
                      <p className="text-sm text-gray-500">
                        {integration.records} records • Last sync: {integration.lastSync}
                      </p>
                      <p className="text-xs text-gray-400">Health: {integration.health}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <Badge 
                      variant="outline" 
                      className={getIntegrationStatusColor(integration.status)}
                    >
                      {integration.status}
                    </Badge>
                    {integration.status === 'Configuration Required' && (
                      <Button size="sm" variant="outline" className="text-xs">
                        Configure
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              
              <Button variant="outline" className="w-full">
                <Upload className="h-4 w-4 mr-2" />
                Add New Integration
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="access" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Access Audit Trail</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {accessLogs.map((log, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="h-2 w-2 bg-[#228B22] rounded-full" />
                    <div>
                      <p className="font-medium">{log.user}</p>
                      <p className="text-sm text-gray-500">{log.action} • {log.file}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{log.time}</p>
                    <p className="text-xs text-gray-400">{log.ip}</p>
                  </div>
                </div>
              ))}
              
              <Button variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Export Full Audit Log
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
