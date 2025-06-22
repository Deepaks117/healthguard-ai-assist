
import { useState } from "react";
import { Shield, AlertTriangle, FileText, Users, CheckCircle, TrendingUp, Database, Activity, Settings, LogOut, Brain, Upload } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ComplianceAssistant } from "@/components/ComplianceAssistant";
import { RiskDashboard } from "@/components/RiskDashboard";
import { PatientDataSecurity } from "@/components/PatientDataSecurity";
import { TrainingModule } from "@/components/TrainingModule";
import { AuditPreparation } from "@/components/AuditPreparation";
import { ComplianceChart } from "@/components/ComplianceChart";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useComplianceStats } from "@/hooks/useComplianceStats";
import { useRecentActivities } from "@/hooks/useRecentActivities";
import { useTrainingProgress } from "@/hooks/useTrainingProgress";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  // Fetch real data using our hooks
  const { data: complianceStats, isLoading: isLoadingCompliance } = useComplianceStats();
  const { data: recentActivities, isLoading: isLoadingActivities } = useRecentActivities();
  const { data: trainingProgress, isLoading: isLoadingTraining } = useTrainingProgress();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Sign out failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of HealthGuard360.",
      });
    }
  };

  // Static upcoming tasks for now (to be enhanced in future iterations)
  const upcomingTasks = [
    { id: 1, task: "Complete quarterly HIPAA assessment", due: "3 days", priority: "high" },
    { id: 2, task: "Update patient consent forms", due: "1 week", priority: "medium" },
    { id: 3, task: "Staff cybersecurity training", due: "2 weeks", priority: "low" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#003366] text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-[#ADD8E6]" />
              <h1 className="text-2xl font-bold">HealthGuard360</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="border-[#ADD8E6] text-[#ADD8E6]">
                HIPAA Compliant
              </Badge>
              <span className="text-sm text-[#ADD8E6]">
                Welcome, {user?.email}
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                className="border-[#ADD8E6] text-[#ADD8E6] hover:bg-[#ADD8E6] hover:text-[#003366]"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-6 h-12">
              <TabsTrigger value="dashboard" className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </TabsTrigger>
              <TabsTrigger value="compliance" className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Compliance</span>
              </TabsTrigger>
              <TabsTrigger value="risk" className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4" />
                <span className="hidden sm:inline">Risk</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center space-x-2">
                <Database className="h-4 w-4" />
                <span className="hidden sm:inline">Security</span>
              </TabsTrigger>
              <TabsTrigger value="training" className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Training</span>
              </TabsTrigger>
              <TabsTrigger value="audit" className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4" />
                <span className="hidden sm:inline">Audit</span>
              </TabsTrigger>
            </TabsList>

            <div className="py-6">
              <TabsContent value="dashboard" className="space-y-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="border-l-4 border-l-[#228B22]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Overall Compliance</CardTitle>
                      <Shield className="h-4 w-4 text-[#228B22]" />
                    </CardHeader>
                    <CardContent>
                      {isLoadingCompliance ? (
                        <div className="text-2xl font-bold text-gray-400">Loading...</div>
                      ) : complianceStats?.totalReports === 0 ? (
                        <div className="text-2xl font-bold text-gray-400">No data</div>
                      ) : (
                        <div className="text-2xl font-bold text-[#228B22]">{complianceStats?.overall || 0}%</div>
                      )}
                      <Progress value={complianceStats?.overall || 0} className="mt-2" />
                    </CardContent>
                  </Card>

                  <Card className="border-l-4 border-l-[#003366]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Risk Level</CardTitle>
                      <AlertTriangle className="h-4 w-4 text-[#003366]" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-[#003366]">
                        {complianceStats?.criticalIssues === 0 ? "Low" : complianceStats && complianceStats.criticalIssues > 5 ? "High" : "Medium"}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {complianceStats?.criticalIssues || 0} critical issues
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-l-4 border-l-[#ADD8E6]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Training Progress</CardTitle>
                      <Users className="h-4 w-4 text-[#ADD8E6]" />
                    </CardHeader>
                    <CardContent>
                      {isLoadingTraining ? (
                        <div className="text-2xl font-bold text-gray-400">Loading...</div>
                      ) : (
                        <div className="text-2xl font-bold text-[#ADD8E6]">{trainingProgress?.progressPercentage || 0}%</div>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {trainingProgress?.completedModules || 0}/{trainingProgress?.totalModules || 0} modules completed
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-l-4 border-l-[#228B22]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Audit Readiness</CardTitle>
                      <CheckCircle className="h-4 w-4 text-[#228B22]" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-[#228B22]">
                        {complianceStats?.overall && complianceStats.overall >= 80 ? "Ready" : "Needs Work"}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {complianceStats?.totalReports || 0} reports generated
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Compliance Breakdown and Chart */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {complianceStats && complianceStats.totalReports > 0 ? (
                    <>
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <Brain className="h-5 w-5 text-[#003366]" />
                            <span>Compliance Breakdown</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>HIPAA Compliance</span>
                              <span className="font-semibold text-[#228B22]">{complianceStats.hipaa}%</span>
                            </div>
                            <Progress value={complianceStats.hipaa} />
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>GDPR Compliance</span>
                              <span className="font-semibold text-[#ADD8E6]">{complianceStats.gdpr}%</span>
                            </div>
                            <Progress value={complianceStats.gdpr} />
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>Documentation</span>
                              <span className="font-semibold text-[#228B22]">{complianceStats.documentation}%</span>
                            </div>
                            <Progress value={complianceStats.documentation} />
                          </div>
                        </CardContent>
                      </Card>

                      <ComplianceChart 
                        hipaa={complianceStats.hipaa}
                        gdpr={complianceStats.gdpr}
                        documentation={complianceStats.documentation}
                      />
                    </>
                  ) : (
                    <div className="lg:col-span-2">
                      <Alert>
                        <Upload className="h-4 w-4" />
                        <AlertDescription>
                          No compliance data yet. Upload a document in the Compliance tab to start tracking your compliance scores.
                        </AlertDescription>
                      </Alert>
                    </div>
                  )}
                </div>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Activity className="h-5 w-5 text-[#003366]" />
                      <span>Recent Activity</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoadingActivities ? (
                      <div className="text-gray-500">Loading activities...</div>
                    ) : !recentActivities || recentActivities.length === 0 ? (
                      <div className="text-gray-500">No recent activity</div>
                    ) : (
                      <div className="space-y-3">
                        {recentActivities.map((activity) => (
                          <div key={activity.id} className="flex items-start space-x-3">
                            <div className={`h-2 w-2 rounded-full mt-2 ${
                              activity.status === 'success' ? 'bg-[#228B22]' :
                              activity.status === 'warning' ? 'bg-yellow-500' : 'bg-[#ADD8E6]'
                            }`} />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-gray-900">{activity.message}</p>
                              <p className="text-xs text-gray-500">{activity.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Upcoming Tasks */}
                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Tasks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {upcomingTasks.map((task) => (
                        <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <p className="font-medium">{task.task}</p>
                            <p className="text-sm text-gray-500">Due in {task.due}</p>
                          </div>
                          <Badge variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'default' : 'secondary'}>
                            {task.priority}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="compliance">
                <ComplianceAssistant />
              </TabsContent>

              <TabsContent value="risk">
                <RiskDashboard />
              </TabsContent>

              <TabsContent value="security">
                <PatientDataSecurity />
              </TabsContent>

              <TabsContent value="training">
                <TrainingModule />
              </TabsContent>

              <TabsContent value="audit">
                <AuditPreparation />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </nav>
    </div>
  );
};

export default Index;
