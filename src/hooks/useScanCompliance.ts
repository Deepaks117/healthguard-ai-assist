
import { useState } from 'react';
import { scanDocumentForCompliance } from '@/integrations/compliance/checker';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';

export interface ScanResult {
  score: number;
  issues: Array<{
    type: 'critical' | 'warning' | 'info';
    title: string;
    description: string;
    suggestion: string;
  }>;
}

export const useScanCompliance = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const scanDocument = async (text: string, documentPath?: string, documentName?: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to scan documents",
        variant: "destructive",
      });
      return;
    }

    setIsScanning(true);
    
    try {
      console.log('Scanning document text, length:', text.length);
      const result = scanDocumentForCompliance(text);
      
      // Save scan result to database - cast issues to Json type
      const { error: insertError } = await supabase
        .from('compliance_reports')
        .insert({
          user_id: user.id,
          document_id: documentPath || null,
          document_name: documentName || 'Text Input',
          score: result.score,
          issues: result.issues as any, // Cast to Json type for Supabase
          scanned_text: text.substring(0, 1000) // Store first 1000 chars
        });

      if (insertError) {
        console.error('Error saving scan result:', insertError);
        toast({
          title: "Scan completed with warning",
          description: "Results could not be saved to database",
          variant: "destructive",
        });
      }

      // Log the scan action
      await supabase
        .from('audit_logs')
        .insert({
          user_id: user.id,
          action: 'compliance_scan',
          resource_type: 'document',
          resource_id: documentPath || 'text_input',
          details: { 
            document_name: documentName || 'Text Input',
            score: result.score,
            issues_count: result.issues.length
          } as any // Cast to Json type for Supabase
        });

      setScanResult(result);
      
      toast({
        title: "Scan completed",
        description: `Compliance score: ${result.score}% (${result.issues.length} issues found)`,
        variant: result.score >= 80 ? "default" : "destructive"
      });

    } catch (error) {
      console.error('Scan error:', error);
      toast({
        title: "Scan failed",
        description: "An error occurred while scanning the document",
        variant: "destructive",
      });
    } finally {
      setIsScanning(false);
    }
  };

  return {
    scanDocument,
    isScanning,
    scanResult,
    setScanResult
  };
};
