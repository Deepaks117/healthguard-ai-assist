
import { AlertTriangle, Shield, Activity, TrendingUp, Eye, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

export const RiskDashboard = () => {
  const riskMetrics = {
    overall: "Low",
    score: 85,
    activeThreats: 3,
    resolved: 12
  };

  const recentThreats = [
    {
      id: 1,
      type: "Phishing",
      severity: "Medium",
      description: "Suspicious email detected in staff inbox",
      status: "Investigating",
      timestamp: "2 hours ago"
    },
    {
      id: 2,
      type: "Unauthorized Access",
      severity: "Low",
      description: "Failed login attempts from unknown IP",
      status: "Monitored",
      timestamp: "6 hours ago"
    },
    {
      id: 3,
      type: "Data Exposure",
      severity: "High",
      description: "Unencrypted patient file detected",
      status: "Action Required",
      timestamp: "1 day ago"
    }
  ];

  const securityCategories = [
    { name: "Network Security", score: 92, status: "excellent" },
    { name: "Data Encryption", score: 88, status: "good" },
    { name: "Access Controls", score: 85, status: "good" },
    { name: "Staff Training", score: 78, status: "needs-improvement" },
    { name: "Incident Response", score: 94, status: "excellent" }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "excellent": return "text-[#228B22]";
      case "good": return "text-[#ADD8E6]";
      case "needs-improvement": return "text-yellow-600";
      default: return "text-gray-600";
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
      case "high": return "bg-red-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-[#003366]">Risk Dashboard</h2>
        <Badge variant="outline" className="border-[#228B22] text-[#228B22]">
          Real-time Monitoring
        </Badge>
      </div>

      {/* Risk Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-[#228B22]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Risk Level</CardTitle>
            <Shield className="h-4 w-4 text-[#228B22]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#228B22]">{riskMetrics.overall}</div>
            <p className="text-xs text-muted-foreground">Security Score: {riskMetrics.score}/100</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Threats</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{riskMetrics.activeThreats}</div>
            <p className="text-xs text-muted-foreground">Requiring attention</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#ADD8E6]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monitoring</CardTitle>
            <Activity className="h-4 w-4 text-[#ADD8E6]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#ADD8E6]">24/7</div>
            <p className="text-xs text-muted-foreground">Real-time protection</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#228B22]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <TrendingUp className="h-4 w-4 text-[#228B22]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#228B22]">{riskMetrics.resolved}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Security Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Lock className="h-5 w-5 text-[#003366]" />
              <span>Security Assessment</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {securityCategories.map((category, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{category.name}</span>
                  <span className={`text-sm font-semibold ${getStatusColor(category.status)}`}>
                    {category.score}%
                  </span>
                </div>
                <Progress value={category.score} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Threats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Eye className="h-5 w-5 text-[#003366]" />
              <span>Recent Threats</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentThreats.map((threat) => (
              <div key={threat.id} className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`h-3 w-3 rounded-full ${getSeverityColor(threat.severity)}`} />
                    <span className="font-medium">{threat.type}</span>
                  </div>
                  <Badge variant="outline" className={`${
                    threat.status === "Action Required" ? "border-red-500 text-red-500" :
                    threat.status === "Investigating" ? "border-yellow-500 text-yellow-500" :
                    "border-[#ADD8E6] text-[#ADD8E6]"
                  }`}>
                    {threat.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">{threat.description}</p>
                <p className="text-xs text-gray-400">{threat.timestamp}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Action Center */}
      <Card>
        <CardHeader>
          <CardTitle>Recommended Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-red-50 rounded-lg">
              <h4 className="font-semibold text-red-700 mb-2">Critical</h4>
              <p className="text-sm text-red-600 mb-3">Address high-severity data exposure vulnerability</p>
              <Button size="sm" className="bg-red-600 hover:bg-red-700">
                Take Action
              </Button>
            </div>
            
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h4 className="font-semibold text-yellow-700 mb-2">Recommended</h4>
              <p className="text-sm text-yellow-600 mb-3">Update staff cybersecurity training modules</p>
              <Button size="sm" variant="outline" className="border-yellow-600 text-yellow-600">
                Schedule Update
              </Button>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-700 mb-2">Optimization</h4>
              <p className="text-sm text-blue-600 mb-3">Enable advanced threat detection features</p>
              <Button size="sm" variant="outline" className="border-blue-600 text-blue-600">
                Learn More
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
