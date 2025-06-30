import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '../integrations/supabase/client';
import complianceAnalyzer, { ComplianceReport, ComplianceIssue } from '../integrations/gemini/compliance-analyzer';
import { useToast } from './use-toast';

export interface UseGeminiComplianceReturn {
  isAnalyzing: boolean;
  currentReport: ComplianceReport | null;
  analyzeDocument: (file: File, standards?: string[]) => Promise<void>;
  analyzeText: (text: string, fileName: string, standards?: string[]) => Promise<void>;
  clearReport: () => void;
  error: string | null;
}

export const useGeminiCompliance = (): UseGeminiComplianceReturn => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentReport, setCurrentReport] = useState<ComplianceReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const analyzeDocument = useCallback(async (file: File, standards: string[] = ['HIPAA', 'GDPR']) => {
    if (!user) {
      setError('User not authenticated');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      // Read file content
      const text = await readFileAsText(file);
      
      // Generate document ID
      const documentId = `${user.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Analyze with Gemini
      const report = await complianceAnalyzer.analyzeDocument(
        text,
        file.name,
        documentId,
        standards
      );

      // Save to Supabase
      await saveReportToDatabase(report, user.id);

      setCurrentReport(report);
      
      toast({
        title: 'Analysis Complete',
        description: `Found ${report.issues.length} compliance issues. Score: ${report.overallScore}%`,
        variant: report.overallScore >= 80 ? 'default' : 'destructive',
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Analysis failed';
      setError(errorMessage);
      
      toast({
        title: 'Analysis Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsAnalyzing(false);
    }
  }, [user, toast]);

  const analyzeText = useCallback(async (text: string, fileName: string, standards: string[] = ['HIPAA', 'GDPR']) => {
    if (!user) {
      setError('User not authenticated');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      // Generate document ID
      const documentId = `${user.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Analyze with Gemini
      const report = await complianceAnalyzer.analyzeDocument(
        text,
        fileName,
        documentId,
        standards
      );

      // Save to Supabase
      await saveReportToDatabase(report, user.id);

      setCurrentReport(report);
      
      toast({
        title: 'Analysis Complete',
        description: `Found ${report.issues.length} compliance issues. Score: ${report.overallScore}%`,
        variant: report.overallScore >= 80 ? 'default' : 'destructive',
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Analysis failed';
      setError(errorMessage);
      
      toast({
        title: 'Analysis Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsAnalyzing(false);
    }
  }, [user, toast]);

  const clearReport = useCallback(() => {
    setCurrentReport(null);
    setError(null);
  }, []);

  return {
    isAnalyzing,
    currentReport,
    analyzeDocument,
    analyzeText,
    clearReport,
    error,
  };
};

// Helper function to read file as text
const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      resolve(text);
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

// Helper function to save report to database
const saveReportToDatabase = async (report: ComplianceReport, userId: string) => {
  try {
    // Save compliance report with issues as JSONB
    const { error: reportError } = await supabase
      .from('compliance_reports')
      .insert({
        user_id: userId,
        document_name: report.fileName,
        score: report.overallScore,
        issues: JSON.parse(JSON.stringify(report.issues)), // Properly serialize for JSONB
        scanned_text: report.sanitizationResult.sanitizedText,
      });

    if (reportError) throw reportError;

    // Log audit trail
    await supabase
      .from('audit_logs')
      .insert({
        user_id: userId,
        action: 'COMPLIANCE_ANALYSIS',
        details: `Analyzed document: ${report.fileName} (Score: ${report.overallScore}%)`,
        ip_address: '127.0.0.1', // Will be replaced with actual IP in production
        user_agent: navigator.userAgent,
      });

  } catch (error) {
    console.error('Failed to save report to database:', error);
    // Don't throw here - we still want to show the analysis results
  }
}; 