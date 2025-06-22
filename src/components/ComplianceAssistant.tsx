
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, CheckCircle, AlertCircle, Brain, Download, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useUploadDocument } from "@/hooks/useUploadDocument";
import { useScanCompliance } from "@/hooks/useScanCompliance";
import { useToast } from "@/hooks/use-toast";

export const ComplianceAssistant = () => {
  const [uploadedDoc, setUploadedDoc] = useState("");
  const { upload, isUploading } = useUploadDocument();
  const { scanDocument, isScanning, scanResult, setScanResult } = useScanCompliance();
  const { toast } = useToast();

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    console.log('File dropped:', file.name, file.type, file.size);

    // Validate file
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast({
        title: "File too large",
        description: "Please select a file smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    const uploadResult = await upload(file);
    if (!uploadResult) return;

    // Read file content for scanning
    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target?.result as string;
      if (text) {
        console.log('File content read, starting scan...');
        await scanDocument(text, uploadResult.path, uploadResult.name);
      }
    };
    
    reader.onerror = () => {
      toast({
        title: "File read error",
        description: "Could not read the file content",
        variant: "destructive",
      });
    };

    reader.readAsText(file);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'application/pdf': ['.pdf'],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: false
  });

  const handleTextScan = async () => {
    if (!uploadedDoc.trim()) {
      toast({
        title: "No text to scan",
        description: "Please enter some text to analyze",
        variant: "destructive",
      });
      return;
    }

    await scanDocument(uploadedDoc.trim());
  };

  const clearResults = () => {
    setScanResult(null);
    setUploadedDoc("");
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
            <div 
              {...getRootProps()} 
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                isDragActive 
                  ? 'border-[#228B22] bg-green-50' 
                  : 'border-[#ADD8E6] hover:border-[#228B22]'
              }`}
            >
              <input {...getInputProps()} />
              {isUploading ? (
                <div className="space-y-4">
                  <Loader2 className="h-12 w-12 text-[#003366] mx-auto animate-spin" />
                  <p className="text-sm text-gray-600">Uploading document...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <FileText className="h-12 w-12 text-[#ADD8E6] mx-auto" />
                  <div>
                    <p className="text-sm text-gray-600 mb-2">
                      {isDragActive 
                        ? 'Drop the file here...' 
                        : 'Drag & drop a document here, or click to browse'
                      }
                    </p>
                    <p className="text-xs text-gray-500">
                      Supports TXT and PDF files (max 5MB)
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Or paste text content:</label>
              <Textarea
                placeholder="Paste your policy or procedure text here..."
                value={uploadedDoc}
                onChange={(e) => setUploadedDoc(e.target.value)}
                rows={4}
                disabled={isUploading || isScanning}
              />
            </div>

            <Button 
              onClick={handleTextScan}
              disabled={isScanning || isUploading || !uploadedDoc.trim()}
              className="w-full bg-[#228B22] hover:bg-[#1e7b1e]"
            >
              {isScanning ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 mr-2" />
                  Scan Text for Compliance
                </>
              )}
            </Button>

            {scanResult && (
              <Button 
                onClick={clearResults}
                variant="outline"
                className="w-full"
              >
                Clear Results
              </Button>
            )}
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
                <Badge className={`${
                  scanResult.score >= 80 ? 'bg-[#228B22]' : 
                  scanResult.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                } text-white`}>
                  {scanResult.score}%
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {scanResult.issues.length === 0 ? (
              <Alert className="border-[#228B22]">
                <CheckCircle className="h-4 w-4 text-[#228B22]" />
                <AlertDescription>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-[#228B22]">Excellent Compliance!</h4>
                    <p className="text-sm text-gray-600">No compliance issues detected in your document.</p>
                  </div>
                </AlertDescription>
              </Alert>
            ) : (
              scanResult.issues.map((issue, index) => (
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
                        <Badge variant={
                          issue.type === 'critical' ? 'destructive' : 
                          issue.type === 'warning' ? 'default' : 'secondary'
                        }>
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
              ))
            )}

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
