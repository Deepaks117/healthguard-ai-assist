
import { useState } from "react";
import { CheckCircle, FileText, Download, Calendar, AlertTriangle, Shield, Clipboard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const AuditPreparation = () => {
  const [checkedItems, setCheckedItems] = useState(new Set());

  const auditReadiness = {
    overall: 87,
    documentation: 92,
    policies: 85,
    training: 78,
    technical: 90
  };

  const checklist = [
    {
      category: "Documentation",
      items: [
        { id: 1, task: "HIPAA Privacy Policies Updated", status: "completed", priority: "high" },
        { id: 2, task: "Incident Response Procedures", status: "completed", priority: "high" },
        { id: 3, task: "Employee Training Records", status: "in-progress", priority: "medium" },
        { id: 4, task: "Business Associate Agreements", status: "completed", priority: "high" },
        { id: 5, task: "Risk Assessment Documentation", status: "needs-attention", priority: "high" }
      ]
    },
    {
      category: "Technical Safeguards",
      items: [
        { id: 6, task: "Access Control Implementation", status: "completed", priority: "high" },
        { id: 7, task: "Encryption Standards Verification", status: "completed", priority: "high" },
        { id: 8, task: "Audit Log Configuration", status: "in-progress", priority: "medium" },
        { id: 9, task: "Backup and Recovery Testing", status: "completed", priority: "medium" },
        { id: 10, task: "Software Security Updates", status: "needs-attention", priority: "low" }
      ]
    },
    {
      category: "Administrative",
      items: [
        { id: 11, task: "Security Officer Designation", status: "completed", priority: "high" },
        { id: 12, task: "Workforce Training Completion", status: "in-progress", priority: "medium" },
        { id: 13, task: "Vendor Management Review", status: "completed", priority: "medium" },
        { id: 14, task: "Policy Review and Updates", status: "needs-attention", priority: "high" }
      ]
    }
  ];

  const recentAudits = [
    { date: "2024-03-15", type: "Internal HIPAA Review", result: "Passed", score: 94, findings: 2 },
    { date: "2023-09-22", type: "External Compliance Audit", result: "Passed", score: 89, findings: 5 },
    { date: "2023-06-10", type: "Cybersecurity Assessment", result: "Passed", score: 91, findings: 3 }
  ];

  const upcomingDeadlines = [
    { task: "Annual HIPAA Risk Assessment", due: "2024-07-15", daysLeft: 45, priority: "high" },
    { task: "Quarterly Security Review", due: "2024-06-30", daysLeft: 30, priority: "medium" },
    { task: "Staff Training Renewal", due: "2024-08-01", daysLeft: 62, priority: "medium" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "text-[#228B22]";
      case "in-progress": return "text-[#ADD8E6]";
      case "needs-attention": return "text-red-500";
      default: return "text-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="h-4 w-4 text-[#228B22]" />;
      case "in-progress": return <div className="h-4 w-4 border-2 border-[#ADD8E6] rounded-full animate-spin" />;
      case "needs-attention": return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <div className="h-4 w-4 border-2 border-gray-300 rounded-full" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "border-red-500 text-red-500";
      case "medium": return "border-yellow-500 text-yellow-500";
      case "low": return "border-green-500 text-green-500";
      default: return "border-gray-500 text-gray-500";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-[#003366]">Audit Preparation</h2>
        <Badge variant="outline" className="border-[#228B22] text-[#228B22]">
          {auditReadiness.overall}% Ready
        </Badge>
      </div>

      {/* Readiness Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-[#228B22]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Readiness</CardTitle>
            <Shield className="h-4 w-4 text-[#228B22]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#228B22]">{auditReadiness.overall}%</div>
            <Progress value={auditReadiness.overall} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#003366]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documentation</CardTitle>
            <FileText className="h-4 w-4 text-[#003366]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#003366]">{auditReadiness.documentation}%</div>
            <Progress value={auditReadiness.documentation} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#ADD8E6]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Technical</CardTitle>
            <Clipboard className="h-4 w-4 text-[#ADD8E6]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#ADD8E6]">{auditReadiness.technical}%</div>
            <Progress value={auditReadiness.technical} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Training</CardTitle>
            <Calendar className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">{auditReadiness.training}%</div>
            <Progress value={auditReadiness.training} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="checklist" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="checklist">Audit Checklist</TabsTrigger>
          <TabsTrigger value="history">Audit History</TabsTrigger>
          <TabsTrigger value="deadlines">Upcoming Deadlines</TabsTrigger>
        </TabsList>

        <TabsContent value="checklist" className="space-y-4">
          {checklist.map((category, categoryIndex) => (
            <Card key={categoryIndex}>
              <CardHeader>
                <CardTitle>{category.category}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {category.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(item.status)}
                      <div>
                        <p className="font-medium">{item.task}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className={getPriorityColor(item.priority)}>
                            {item.priority}
                          </Badge>
                          <span className={`text-sm ${getStatusColor(item.status)}`}>
                            {item.status.replace('-', ' ')}
                          </span>
                        </div>
                      </div>
                    </div>
                    {item.status === "needs-attention" && (
                      <Button size="sm" className="bg-[#003366] hover:bg-[#004080]">
                        Action Required
                      </Button>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}

          <div className="flex space-x-2">
            <Button className="bg-[#228B22] hover:bg-[#1e7b1e]">
              <Download className="h-4 w-4 mr-2" />
              Export Audit Report
            </Button>
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Audit Review
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Previous Audits</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentAudits.map((audit, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium">{audit.type}</p>
                    <p className="text-sm text-gray-500">{audit.date}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-[#228B22] text-white">{audit.result}</Badge>
                      <span className="font-semibold">{audit.score}%</span>
                    </div>
                    <p className="text-xs text-gray-500">{audit.findings} findings</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deadlines" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Compliance Deadlines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingDeadlines.map((deadline, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium">{deadline.task}</p>
                    <p className="text-sm text-gray-500">Due: {deadline.due}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <Badge variant="outline" className={getPriorityColor(deadline.priority)}>
                      {deadline.priority}
                    </Badge>
                    <p className="text-sm font-medium">{deadline.daysLeft} days left</p>
                  </div>
                </div>
              ))}
              
              <Button variant="outline" className="w-full">
                <Calendar className="h-4 w-4 mr-2" />
                Add Reminder
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
