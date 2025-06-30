import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, CheckCircle, AlertCircle, Brain, Download, Loader2, Shield, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useGeminiCompliance } from "@/hooks/useGeminiCompliance";
import { useToast } from "@/hooks/use-toast";
import { ComplianceIssue } from "@/integrations/gemini/compliance-analyzer";

export const ComplianceAssistant = () => {
  const [uploadedDoc, setUploadedDoc] = useState("");
  const { 
    analyzeDocument, 
    analyzeText, 
    isAnalyzing, 
    currentReport, 
    clearReport, 
    error 
  } = useGeminiCompliance();
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

    // Analyze document with Gemini
    await analyzeDocument(file);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
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

    await analyzeText(uploadedDoc.trim(), "Pasted Text");
  };

  const getIssueIcon = (type: ComplianceIssue['type']) => {
    switch (type) {
      case 'CRITICAL':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'WARNING':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'INFO':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getIssueBadgeVariant = (type: ComplianceIssue['type']) => {
    switch (type) {
      case 'CRITICAL':
        return 'destructive';
      case 'WARNING':
        return 'secondary';
      case 'INFO':
        return 'outline';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-[#003366]">AI Compliance Assistant</h2>
        <Badge variant="outline" className="border-[#228B22] text-[#228B22]">
          Powered by Google Gemini
        </Badge>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

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
              {isAnalyzing ? (
                <div className="space-y-4">
                  <Loader2 className="h-12 w-12 text-[#003366] mx-auto animate-spin" />
                  <p className="text-sm text-gray-600">Analyzing document with AI...</p>
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
                      Supports TXT, PDF, DOC, DOCX files (max 5MB)
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
                disabled={isAnalyzing}
              />
            </div>

            <Button 
              onClick={handleTextScan}
              disabled={isAnalyzing || !uploadedDoc.trim()}
              className="w-full bg-[#228B22] hover:bg-[#1e7b1e]"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing with AI...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 mr-2" />
                  Analyze Text for Compliance
                </>
              )}
            </Button>

            {currentReport && (
              <Button 
                onClick={clearReport}
                variant="outline"
                className="w-full"
              >
                Clear Results
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Analysis Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-[#003366]" />
              <span>Analysis Results</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentReport ? (
              <div className="space-y-4">
                {/* Overall Score */}
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-[#003366]">
                    {currentReport.overallScore}%
                  </div>
                  <div className="text-sm text-gray-600">Compliance Score</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {currentReport.fileName}
                  </div>
                </div>

                {/* Sanitization Info */}
                {currentReport.sanitizationResult.removedPatterns.length > 0 && (
                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Data Protection:</strong> {currentReport.sanitizationResult.removedPatterns.length} sensitive patterns removed before analysis.
                    </AlertDescription>
                  </Alert>
                )}

                {/* Issues */}
                <div className="space-y-3">
                  <h4 className="font-medium text-[#003366]">Compliance Issues</h4>
                  {currentReport.issues.length === 0 ? (
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <CheckCircle className="h-8 w-8 text-[#228B22] mx-auto mb-2" />
                      <p className="text-sm text-[#228B22]">No compliance issues found!</p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {currentReport.issues.map((issue, index) => (
                        <div key={issue.id || index} className="p-3 border rounded-lg">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-2 flex-1">
                              {getIssueIcon(issue.type)}
                              <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                  <span className="font-medium text-sm">{issue.title}</span>
                                  <Badge variant={getIssueBadgeVariant(issue.type)} className="text-xs">
                                    {issue.type}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {issue.category}
                                  </Badge>
                                </div>
                                <p className="text-xs text-gray-600 mt-1">{issue.description}</p>
                                <p className="text-xs text-[#228B22] mt-1">
                                  <strong>Suggestion:</strong> {issue.suggestion}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Recommendations */}
                {currentReport.recommendations.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-[#003366]">Recommendations</h4>
                    <ul className="space-y-1">
                      {currentReport.recommendations.map((rec, index) => (
                        <li key={index} className="text-sm text-gray-700 flex items-start space-x-2">
                          <span className="text-[#228B22] mt-1">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center p-8 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Upload a document or paste text to start compliance analysis</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
