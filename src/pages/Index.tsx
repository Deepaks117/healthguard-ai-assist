import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, FileText, Shield, Users, TrendingUp, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useScanCompliance } from '@/hooks/useScanCompliance';
import { useUploadDocument } from '@/hooks/useUploadDocument';
import { useComplianceStats } from '@/hooks/useComplianceStats';
import { useRecentActivities } from '@/hooks/useRecentActivities';
import { useTrainingProgress } from '@/hooks/useTrainingProgress';
import { ComplianceChart } from '@/components/ComplianceChart';
import { ComplianceMetrics } from '@/components/ComplianceMetrics';
import { ComplianceHistoryChart } from '@/components/ComplianceHistoryChart';
import { RiskAssessment } from '@/components/RiskAssessment';
import { ComplianceReports } from '@/components/ComplianceReports';
import { Header } from '@/components/Header';

const Index = () => {
  const [documentText, setDocumentText] = useState('');
  const { toast } = useToast();
  const { scanDocument, isScanning, scanResult } = useScanCompliance();
  const { upload, isUploading } = useUploadDocument();
  const { data: complianceStats, isLoading: statsLoading } = useComplianceStats();
  const { data: recentActivities, isLoading: activitiesLoading } = useRecentActivities();
  const { data: trainingProgress, isLoading: trainingLoading } = useTrainingProgress();

  const handleScanText = () => {
    if (documentText.trim() === '') {
      toast({
        title: 'Please enter text',
        description: 'You must enter text to scan',
        variant: 'destructive',
      });
      return;
    }
    scanDocument(documentText);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      toast({
        title: 'No file selected',
        description: 'Please select a file to upload',
        variant: 'destructive',
      });
      return;
    }

    try {
      const uploadedFile = await upload(file);
      if (uploadedFile) {
        const fileContent = await file.text();
        await scanDocument(fileContent, uploadedFile.path, uploadedFile.name);
      }
    } catch (error) {
      toast({
        title: 'File processing failed',
        description: 'Could not read the file. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const getScoreColor = (score: number | undefined): string => {
    if (!score) return 'text-gray-500';
    if (score >= 80) return 'text-green-500';
    if (score >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getSeverityIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Compliance Dashboard</h2>
          <p className="text-gray-600">Monitor your healthcare compliance status and manage documents</p>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="scan">Document Scanner</TabsTrigger>
            <TabsTrigger value="training">Training</TabsTrigger>
            <TabsTrigger value="audit">Audit Trail</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Overall Compliance</CardTitle>
                  <Shield className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {statsLoading ? '...' : `${complianceStats?.overall || 0}%`}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {statsLoading ? 'Loading...' : 'Current compliance score'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Training Progress</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {trainingLoading ? '...' : `${trainingProgress?.progressPercentage || 0}%`}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {trainingLoading ? 'Loading...' : `${trainingProgress?.completedModules || 0}/${trainingProgress?.totalModules || 0} modules completed`}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Critical Issues</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {statsLoading ? '...' : complianceStats?.criticalIssues || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Requires immediate attention
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {statsLoading ? '...' : complianceStats?.totalReports || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Compliance scans completed
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Compliance Chart and Recent Activities */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                {complianceStats && (
                  <ComplianceChart
                    hipaa={complianceStats.hipaa}
                    gdpr={complianceStats.gdpr}
                    documentation={complianceStats.documentation}
                  />
                )}
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activities</CardTitle>
                  <CardDescription>Latest compliance and training activities</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {activitiesLoading ? (
                    <p className="text-gray-500">Loading activities...</p>
                  ) : recentActivities && recentActivities.length > 0 ? (
                    recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-center space-x-3">
                        {getSeverityIcon(activity.status)}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {activity.message}
                          </p>
                          <p className="text-sm text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No recent activities</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            {/* Enhanced Analytics Dashboard */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                {complianceStats && (
                  <ComplianceMetrics
                    overall={complianceStats.overall}
                    hipaa={complianceStats.hipaa}
                    gdpr={complianceStats.gdpr}
                    documentation={complianceStats.documentation}
                    criticalIssues={complianceStats.criticalIssues}
                    warningIssues={complianceStats.warningIssues}
                    infoIssues={complianceStats.infoIssues}
                  />
                )}
              </div>
              <div>
                <ComplianceHistoryChart />
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RiskAssessment />
              <ComplianceReports />
            </div>
          </TabsContent>

          <TabsContent value="scan" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Document Scanner</CardTitle>
                <CardDescription>
                  Analyze compliance by uploading a document or pasting text
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Paste document text here..."
                  className="w-full h-40 resize-none"
                  value={documentText}
                  onChange={(e) => setDocumentText(e.target.value)}
                />
                <div className="flex space-x-4">
                  <Button
                    onClick={handleScanText}
                    disabled={isScanning}
                    className="bg-[#003366] hover:bg-[#004080]"
                  >
                    {isScanning ? (
                      <>
                        <Clock className="mr-2 h-4 w-4 animate-spin" />
                        Scanning...
                      </>
                    ) : (
                      <>
                        <Shield className="mr-2 h-4 w-4" />
                        Scan Text
                      </>
                    )}
                  </Button>
                  <div className="relative">
                    <Input
                      type="file"
                      id="upload"
                      className="absolute w-full h-full opacity-0 cursor-pointer"
                      onChange={handleFileUpload}
                      disabled={isUploading}
                    />
                    <Button
                      asChild
                      variant="secondary"
                      disabled={isUploading}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700"
                    >
                      <Label htmlFor="upload" className="flex items-center space-x-2 cursor-pointer">
                        {isUploading ? (
                          <>
                            <Clock className="mr-2 h-4 w-4 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="mr-2 h-4 w-4" />
                            Upload Document
                          </>
                        )}
                      </Label>
                    </Button>
                  </div>
                </div>
                {scanResult && (
                  <div className="mt-6">
                    <h3 className="text-xl font-semibold">Scan Result</h3>
                    <p className={`text-lg ${getScoreColor(scanResult.score)}`}>
                      Compliance Score: {scanResult.score}%
                    </p>
                    {scanResult.issues.length > 0 ? (
                      <div className="mt-4 space-y-2">
                        <h4 className="text-lg font-medium">Issues Found:</h4>
                        {scanResult.issues.map((issue, index) => (
                          <div key={index} className="border rounded-md p-3">
                            <p className="font-semibold">{issue.title}</p>
                            <p className="text-sm">{issue.description}</p>
                            {issue.suggestion && (
                              <p className="text-sm italic">Suggestion: {issue.suggestion}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-green-500">No compliance issues found!</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="training">
            <Card>
              <CardHeader>
                <CardTitle>Training Modules</CardTitle>
                <CardDescription>Enhance your team's compliance knowledge</CardDescription>
              </CardHeader>
              <CardContent>
                {trainingLoading ? (
                  <p>Loading training progress...</p>
                ) : trainingProgress ? (
                  <>
                    <p>
                      You have completed {trainingProgress.completedModules} of {trainingProgress.totalModules} training
                      modules.
                    </p>
                    <p>Recently Completed:</p>
                    <ul>
                      {trainingProgress.recentlyCompleted.map((module) => (
                        <li key={module.id}>
                          {module.title} - Completed on {module.completedAt}
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <p>No training data available.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audit">
            <Card>
              <CardHeader>
                <CardTitle>Audit Trail</CardTitle>
                <CardDescription>Track all compliance-related activities</CardDescription>
              </CardHeader>
              <CardContent>
                {activitiesLoading ? (
                  <p>Loading audit trail...</p>
                ) : recentActivities && recentActivities.length > 0 ? (
                  recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-3">
                      {getSeverityIcon(activity.status)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{activity.message}</p>
                        <p className="text-sm text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No audit logs available.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
