import { geminiModel, safetySettings } from './client';
import { sanitizeDocument, SanitizationResult } from './sanitizer';

export interface ComplianceIssue {
  id: string;
  type: 'CRITICAL' | 'WARNING' | 'INFO';
  category: 'HIPAA' | 'GDPR' | 'GENERAL';
  title: string;
  description: string;
  suggestion: string;
  lineNumber?: number;
  confidence: number;
}

export interface ComplianceReport {
  documentId: string;
  fileName: string;
  timestamp: string;
  overallScore: number;
  issues: ComplianceIssue[];
  sanitizationResult: SanitizationResult;
  summary: string;
  recommendations: string[];
}

// HIPAA and GDPR compliance prompts
const COMPLIANCE_PROMPTS = {
  hipaa: `
    Analyze the following healthcare document for HIPAA compliance issues. Look for:
    1. Unauthorized disclosure of PHI (Protected Health Information)
    2. Missing patient consent documentation
    3. Inadequate security measures mentioned
    4. Improper data handling procedures
    5. Missing privacy notices
    6. Unauthorized access to medical records
    7. Improper disposal of PHI
    8. Missing audit trails
    
    Return a JSON response with:
    {
      "score": number (0-100),
      "issues": [
        {
          "type": "CRITICAL|WARNING|INFO",
          "category": "HIPAA",
          "title": "string",
          "description": "string", 
          "suggestion": "string",
          "confidence": number (0-1)
        }
      ],
      "summary": "string",
      "recommendations": ["string"]
    }
  `,
  
  gdpr: `
    Analyze the following document for GDPR compliance issues. Look for:
    1. Missing data subject consent
    2. Inadequate data processing legal basis
    3. Missing privacy notices
    4. Inadequate data subject rights
    5. Improper data retention policies
    6. Missing data protection impact assessments
    7. Inadequate security measures
    8. Cross-border data transfer issues
    
    Return a JSON response with:
    {
      "score": number (0-100),
      "issues": [
        {
          "type": "CRITICAL|WARNING|INFO", 
          "category": "GDPR",
          "title": "string",
          "description": "string",
          "suggestion": "string", 
          "confidence": number (0-1)
        }
      ],
      "summary": "string",
      "recommendations": ["string"]
    }
  `,
  
  general: `
    Analyze the following document for general data privacy and security compliance issues. Look for:
    1. Sensitive data exposure
    2. Inadequate access controls
    3. Missing encryption requirements
    4. Poor data handling practices
    5. Security vulnerabilities
    6. Compliance gaps
    
    Return a JSON response with:
    {
      "score": number (0-100),
      "issues": [
        {
          "type": "CRITICAL|WARNING|INFO",
          "category": "GENERAL", 
          "title": "string",
          "description": "string",
          "suggestion": "string",
          "confidence": number (0-1)
        }
      ],
      "summary": "string",
      "recommendations": ["string"]
    }
  `
};

export class ComplianceAnalyzer {
  private static instance: ComplianceAnalyzer;
  
  private constructor() {}
  
  static getInstance(): ComplianceAnalyzer {
    if (!ComplianceAnalyzer.instance) {
      ComplianceAnalyzer.instance = new ComplianceAnalyzer();
    }
    return ComplianceAnalyzer.instance;
  }
  
  async analyzeDocument(
    documentText: string,
    fileName: string,
    documentId: string,
    standards: string[] = ['HIPAA', 'GDPR']
  ): Promise<ComplianceReport> {
    try {
      // Sanitize the document first
      const sanitizationResult = sanitizeDocument(documentText);
      
      // Validate sanitization
      if (!this.validateSanitization(documentText, sanitizationResult.sanitizedText)) {
        throw new Error('Document sanitization failed - sensitive data may be exposed');
      }
      
      // Analyze for each standard
      const analysisResults = await Promise.all(
        standards.map(standard => this.analyzeForStandard(sanitizationResult.sanitizedText, standard))
      );
      
      // Combine results
      const allIssues: ComplianceIssue[] = [];
      let totalScore = 0;
      const allRecommendations: string[] = [];
      
      analysisResults.forEach((result, index) => {
        if (result) {
          allIssues.push(...result.issues.map(issue => ({
            ...issue,
            id: `${documentId}-${standards[index]}-${Date.now()}-${Math.random()}`
          })));
          totalScore += result.score;
          allRecommendations.push(...result.recommendations);
        }
      });
      
      const averageScore = analysisResults.length > 0 ? totalScore / analysisResults.length : 0;
      
      // Generate overall summary
      const summary = this.generateSummary(allIssues, averageScore, standards);
      
      return {
        documentId,
        fileName,
        timestamp: new Date().toISOString(),
        overallScore: Math.round(averageScore),
        issues: allIssues,
        sanitizationResult,
        summary,
        recommendations: [...new Set(allRecommendations)] // Remove duplicates
      };
      
    } catch (error) {
      console.error('Compliance analysis failed:', error);
      throw new Error(`Compliance analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  private async analyzeForStandard(
    sanitizedText: string,
    standard: string
  ): Promise<{ score: number; issues: ComplianceIssue[]; recommendations: string[] } | null> {
    try {
      const prompt = COMPLIANCE_PROMPTS[standard.toLowerCase() as keyof typeof COMPLIANCE_PROMPTS];
      if (!prompt) {
        console.warn(`No prompt found for standard: ${standard}`);
        return null;
      }
      
      const fullPrompt = `${prompt}\n\nDocument to analyze:\n${sanitizedText}`;
      
      const result = await geminiModel.generateContent({
        contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
        safetySettings,
      });
      
      const response = result.response.text();
      
      // Parse JSON response
      try {
        const parsed = JSON.parse(response);
        return {
          score: parsed.score || 0,
          issues: parsed.issues || [],
          recommendations: parsed.recommendations || []
        };
      } catch (parseError) {
        console.error('Failed to parse Gemini response:', parseError);
        // Fallback: create a basic analysis
        return this.createFallbackAnalysis(sanitizedText, standard);
      }
      
    } catch (error) {
      console.error(`Analysis failed for ${standard}:`, error);
      return this.createFallbackAnalysis(sanitizedText, standard);
    }
  }
  
  private createFallbackAnalysis(
    text: string,
    standard: string
  ): { score: number; issues: ComplianceIssue[]; recommendations: string[] } {
    // Basic keyword-based analysis as fallback
    const issues: ComplianceIssue[] = [];
    let score = 100;
    
    const keywords = {
      'HIPAA': ['patient', 'medical', 'health', 'treatment', 'diagnosis'],
      'GDPR': ['personal', 'data', 'consent', 'privacy', 'processing'],
      'GENERAL': ['password', 'login', 'access', 'security', 'encryption']
    };
    
    const standardKeywords = keywords[standard.toUpperCase() as keyof typeof keywords] || [];
    
    standardKeywords.forEach(keyword => {
      const matches = text.toLowerCase().match(new RegExp(keyword, 'g'));
      if (matches && matches.length > 0) {
        issues.push({
          id: `fallback-${Date.now()}`,
          type: 'INFO',
          category: standard.toUpperCase() as 'HIPAA' | 'GDPR' | 'GENERAL',
          title: `Contains ${keyword} references`,
          description: `Document contains ${matches.length} references to ${keyword}`,
          suggestion: `Review ${keyword} handling for compliance`,
          confidence: 0.5
        });
        score -= 5;
      }
    });
    
    return {
      score: Math.max(0, score),
      issues,
      recommendations: ['Review document manually for compliance issues']
    };
  }
  
  private generateSummary(
    issues: ComplianceIssue[],
    score: number,
    standards: string[]
  ): string {
    const criticalCount = issues.filter(i => i.type === 'CRITICAL').length;
    const warningCount = issues.filter(i => i.type === 'WARNING').length;
    const infoCount = issues.filter(i => i.type === 'INFO').length;
    
    return `Document analyzed for ${standards.join(', ')} compliance. Overall score: ${score}%. Found ${criticalCount} critical, ${warningCount} warning, and ${infoCount} informational issues.`;
  }
  
  private validateSanitization(original: string, sanitized: string): boolean {
    // Basic validation - check if sensitive patterns are still present
    const sensitivePatterns = [
      /\b\d{3}-\d{2}-\d{4}\b/, // SSN
      /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/, // Phone
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/, // Email
    ];
    
    for (const pattern of sensitivePatterns) {
      const originalMatches = original.match(pattern);
      const sanitizedMatches = sanitized.match(pattern);
      
      if (originalMatches && sanitizedMatches && originalMatches.length === sanitizedMatches.length) {
        return false;
      }
    }
    
    return true;
  }
}

export default ComplianceAnalyzer.getInstance(); 