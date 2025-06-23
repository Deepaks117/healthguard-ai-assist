
import React, { useState } from 'react';
import { Scan, AlertCircle, CheckCircle, Info, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useScanCompliance } from '@/hooks/useScanCompliance';

const TextScanner = () => {
  const [text, setText] = useState('');
  const { scanDocument, isScanning, scanResult } = useScanCompliance();

  const handleScan = async () => {
    if (!text.trim()) return;
    await scanDocument(text, undefined, 'Text Input');
  };

  const getIssueIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />;
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const getIssueVariant = (type: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (type) {
      case 'critical':
        return 'destructive';
      case 'warning':
        return 'secondary';
      case 'info':
        return 'outline';
      default:
        return 'default';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Scan className="h-5 w-5" />
            <span>Text Compliance Scanner</span>
          </CardTitle>
          <CardDescription>
            Paste or type text to scan for compliance issues
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Paste your text here to scan for HIPAA and GDPR compliance issues..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={8}
            className="resize-none"
          />
          <Button
            onClick={handleScan}
            disabled={!text.trim() || isScanning}
            className="w-full bg-[#003366] hover:bg-[#004080]"
          >
            {isScanning ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                <Scan className="mr-2 h-4 w-4" />
                Scan for Compliance Issues
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {scanResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Scan Results</span>
              <div className="flex items-center space-x-2">
                {scanResult.score >= 80 ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                )}
                <Badge variant={scanResult.score >= 80 ? "default" : "destructive"}>
                  {scanResult.score}% Compliant
                </Badge>
              </div>
            </CardTitle>
            <CardDescription>
              {scanResult.issues.length} compliance issues found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {scanResult.issues.length > 0 ? (
              <div className="space-y-4">
                {scanResult.issues.map((issue, index) => (
                  <Alert key={index}>
                    <div className="flex items-start space-x-3">
                      {getIssueIcon(issue.type)}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium">{issue.title}</h4>
                          <Badge variant={getIssueVariant(issue.type)}>
                            {issue.type}
                          </Badge>
                        </div>
                        <AlertDescription className="mb-2">
                          {issue.description}
                        </AlertDescription>
                        <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                          <strong>Suggestion:</strong> {issue.suggestion}
                        </div>
                      </div>
                    </div>
                  </Alert>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-green-800 mb-2">
                  No Compliance Issues Found
                </h3>
                <p className="text-green-600">
                  Your text appears to be fully compliant with selected standards.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TextScanner;
