
import { useState } from "react";
import { Upload, FileText, CheckCircle, AlertCircle, Brain, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const ComplianceAssistant = () => {
  const [scanResult, setScanResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [uploadedDoc, setUploadedDoc] = useState("");

  const handleDocumentScan = () => {
    setIsScanning(true);
    // Simulate AI scanning
    setTimeout(() => {
      setScanResult({
        overallScore: 76,
        issues: [
          {
            type: "critical",
            title: "Missing Encryption Protocol",
            description: "Patient data transmission lacks end-to-end encryption",
            suggestion: "Implement TLS 1.3 encryption for all patient data transfers"
          },
          {
            type: "warning",
            title: "Incomplete Access Logs",
            description: "Access control logs missing for 2 user accounts",
            suggestion: "Enable comprehensive audit logging for all user access"
          },
          {
            type: "info",
            title: "Policy Update Recommended",
            description: "Privacy policy last updated 8 months ago",
            suggestion: "Review and update privacy policy to reflect current practices"
          }
        ]
      });
      setIsScanning(false);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-[#003366]">Compliance Assistant</h2>
        <Badge variant="outline" className="border-[#228B22] text-[#228B22]">
          AI-Powered Analysis
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Document Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Upload className="h-5 w-5 text-[#003366]" />
              <span>Document Scanner</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-[#ADD8E6] rounded-lg p-6 text-center">
              <FileText className="h-12 w-12 text-[#ADD8E6] mx-auto mb-4" />
              <p className="text-sm text-gray-600 mb-4">
                Upload policies, procedures, or workflows for AI analysis
              </p>
              <Button className="bg-[#003366] hover:bg-[#004080]">
                Choose File
              </Button>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Or paste text content:</label>
              <Textarea
                placeholder="Paste your policy or procedure text here..."
                value={uploadedDoc}
                onChange={(e) => setUploadedDoc(e.target.value)}
                rows={4}
              />
            </div>

            <Button 
              onClick={handleDocumentScan}
              disabled={isScanning || (!uploadedDoc.trim())}
              className="w-full bg-[#228B22] hover:bg-[#1e7b1e]"
            >
              {isScanning ? (
                <>
                  <Brain className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 mr-2" />
                  Scan for Compliance Issues
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Quick Compliance Check */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Compliance Check</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-[#228B22]" />
                  <span className="font-medium">HIPAA Privacy Rule</span>
                </div>
                <Badge variant="outline" className="border-[#228B22] text-[#228B22]">Compliant</Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                  <span className="font-medium">Security Rule</span>
                </div>
                <Badge variant="outline" className="border-yellow-600 text-yellow-600">Needs Review</Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-[#228B22]" />
                  <span className="font-medium">Breach Notification</span>
                </div>
                <Badge variant="outline" className="border-[#228B22] text-[#228B22]">Compliant</Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-[#228B22]" />
                  <span className="font-medium">GDPR Data Protection</span>
                </div>
                <Badge variant="outline" className="border-[#228B22] text-[#228B22]">Compliant</Badge>
              </div>
            </div>

            <Button variant="outline" className="w-full">
              <FileText className="h-4 w-4 mr-2" />
              Generate Compliance Report
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Scan Results */}
      {scanResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Analysis Results</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm">Compliance Score:</span>
                <Badge className={`${scanResult.overallScore >= 80 ? 'bg-[#228B22]' : scanResult.overallScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'} text-white`}>
                  {scanResult.overallScore}%
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {scanResult.issues.map((issue, index) => (
              <Alert key={index} className={`${
                issue.type === 'critical' ? 'border-red-500' :
                issue.type === 'warning' ? 'border-yellow-500' : 'border-blue-500'
              }`}>
                <AlertCircle className={`h-4 w-4 ${
                  issue.type === 'critical' ? 'text-red-500' :
                  issue.type === 'warning' ? 'text-yellow-500' : 'text-blue-500'
                }`} />
                <AlertDescription>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{issue.title}</h4>
                      <Badge variant={issue.type === 'critical' ? 'destructive' : issue.type === 'warning' ? 'default' : 'secondary'}>
                        {issue.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{issue.description}</p>
                    <div className="mt-2 p-2 bg-gray-50 rounded">
                      <p className="text-sm font-medium text-[#003366]">Recommendation:</p>
                      <p className="text-sm">{issue.suggestion}</p>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            ))}

            <div className="flex space-x-2 pt-4">
              <Button className="bg-[#003366] hover:bg-[#004080]">
                <Download className="h-4 w-4 mr-2" />
                Download Report
              </Button>
              <Button variant="outline">
                Mark as Resolved
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
