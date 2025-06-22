
interface ComplianceIssue {
  type: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  suggestion: string;
}

interface ComplianceResult {
  score: number;
  issues: ComplianceIssue[];
}

// HIPAA and GDPR compliance keywords
const complianceKeywords = {
  critical: [
    { keyword: 'unencrypted', title: 'Missing Encryption', description: 'Data transmission or storage lacks encryption', suggestion: 'Implement AES-256 encryption for data at rest and TLS 1.3 for data in transit' },
    { keyword: 'no password', title: 'Missing Authentication', description: 'System lacks proper password protection', suggestion: 'Implement strong password requirements and multi-factor authentication' },
    { keyword: 'public access', title: 'Public Data Exposure', description: 'Patient data may be publicly accessible', suggestion: 'Implement proper access controls and user authentication' },
    { keyword: 'unsecured', title: 'Security Vulnerability', description: 'System components are not properly secured', suggestion: 'Review and implement security best practices' },
    { keyword: 'shared password', title: 'Shared Credentials', description: 'Multiple users sharing login credentials', suggestion: 'Implement individual user accounts with unique credentials' }
  ],
  warning: [
    { keyword: 'outdated policy', title: 'Outdated Privacy Policy', description: 'Privacy policies may not be current', suggestion: 'Review and update privacy policies annually' },
    { keyword: 'missing backup', title: 'Backup Concerns', description: 'Data backup procedures may be inadequate', suggestion: 'Implement automated daily backups with offsite storage' },
    { keyword: 'no audit trail', title: 'Missing Audit Trail', description: 'System lacks comprehensive audit logging', suggestion: 'Enable detailed audit logging for all data access' },
    { keyword: 'weak password', title: 'Weak Password Policy', description: 'Password requirements may be insufficient', suggestion: 'Enforce passwords with minimum 12 characters, mixed case, numbers, and symbols' },
    { keyword: 'manual process', title: 'Manual Security Process', description: 'Critical security processes handled manually', suggestion: 'Automate security processes where possible to reduce human error' }
  ],
  info: [
    { keyword: 'training needed', title: 'Staff Training Required', description: 'Staff may need additional compliance training', suggestion: 'Schedule regular HIPAA/GDPR training sessions for all staff' },
    { keyword: 'documentation update', title: 'Documentation Review', description: 'Compliance documentation needs review', suggestion: 'Schedule quarterly review of all compliance documentation' },
    { keyword: 'policy review', title: 'Policy Review Needed', description: 'Policies should be reviewed for completeness', suggestion: 'Conduct annual policy review with legal team' },
    { keyword: 'software update', title: 'Software Updates Available', description: 'System software may need updates', suggestion: 'Implement regular software update schedule' }
  ]
};

export const scanTextForCompliance = (text: string): ComplianceResult => {
  const issues: ComplianceIssue[] = [];
  const lowerText = text.toLowerCase();

  // Check for critical issues
  complianceKeywords.critical.forEach(item => {
    if (lowerText.includes(item.keyword)) {
      issues.push({
        type: 'critical',
        title: item.title,
        description: item.description,
        suggestion: item.suggestion
      });
    }
  });

  // Check for warning issues
  complianceKeywords.warning.forEach(item => {
    if (lowerText.includes(item.keyword)) {
      issues.push({
        type: 'warning',
        title: item.title,
        description: item.description,
        suggestion: item.suggestion
      });
    }
  });

  // Check for info issues
  complianceKeywords.info.forEach(item => {
    if (lowerText.includes(item.keyword)) {
      issues.push({
        type: 'info',
        title: item.title,
        description: item.description,
        suggestion: item.suggestion
      });
    }
  });

  // Calculate compliance score (100 - deductions for issues)
  let score = 100;
  issues.forEach(issue => {
    switch (issue.type) {
      case 'critical':
        score -= 15;
        break;
      case 'warning':
        score -= 8;
        break;
      case 'info':
        score -= 3;
        break;
    }
  });

  // Ensure score doesn't go below 0
  score = Math.max(0, score);

  return { score, issues };
};

export const scanDocumentForCompliance = async (file: File): Promise<ComplianceResult> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const result = scanTextForCompliance(text);
      resolve(result);
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    if (file.type === 'text/plain' || file.type === 'application/json') {
      reader.readAsText(file);
    } else {
      // For other file types, we'll create a simple result
      resolve({
        score: 75,
        issues: [{
          type: 'info',
          title: 'File Format Limitation',
          description: 'Advanced scanning available for text files only',
          suggestion: 'Upload documents in text format for comprehensive analysis'
        }]
      });
    }
  });
};
