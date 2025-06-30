// Data sanitization utilities for HIPAA compliance
// Removes PHI and sensitive information before sending to external APIs

export interface SanitizationResult {
  sanitizedText: string;
  removedPatterns: string[];
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}

// Common PHI patterns
const PHI_PATTERNS = {
  // Social Security Numbers
  ssn: /\b\d{3}-\d{2}-\d{4}\b|\b\d{9}\b/g,
  
  // Phone numbers
  phone: /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b|\b\(\d{3}\)\s?\d{3}[-.]?\d{4}\b/g,
  
  // Email addresses
  email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
  
  // Dates (various formats)
  date: /\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b|\b\d{4}[/-]\d{1,2}[/-]\d{1,2}\b/g,
  
  // Medical record numbers
  mrn: /\bMRN\s*[:#]?\s*\d+\b/gi,
  
  // Patient IDs
  patientId: /\bPatient\s*ID\s*[:#]?\s*\d+\b/gi,
  
  // Addresses (basic patterns)
  address: /\b\d+\s+[A-Za-z\s]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Lane|Ln|Drive|Dr)\b/gi,
  
  // Credit card numbers
  creditCard: /\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b/g,
  
  // Driver's license
  driversLicense: /\b[A-Z]{1,2}\d{6,8}\b/g,
  
  // Insurance numbers
  insurance: /\b(?:Policy|Group|Member)\s*[:#]?\s*\d+\b/gi,
};

// Healthcare-specific terms that might indicate PHI
const HEALTHCARE_TERMS = [
  'diagnosis',
  'prognosis',
  'treatment plan',
  'medication',
  'dosage',
  'prescription',
  'symptoms',
  'medical history',
  'family history',
  'allergies',
  'vital signs',
  'lab results',
  'imaging results',
];

export const sanitizeDocument = (text: string): SanitizationResult => {
  let sanitizedText = text;
  const removedPatterns: string[] = [];
  let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
  
  // Remove PHI patterns
  Object.entries(PHI_PATTERNS).forEach(([type, pattern]) => {
    const matches = sanitizedText.match(pattern);
    if (matches) {
      removedPatterns.push(`${type}: ${matches.length} instances`);
      sanitizedText = sanitizedText.replace(pattern, `[${type.toUpperCase()}_REDACTED]`);
      
      // Elevate risk level based on sensitive data found
      if (['ssn', 'creditCard', 'driversLicense'].includes(type)) {
        riskLevel = 'HIGH';
      } else if (riskLevel !== 'HIGH' && ['phone', 'email', 'address'].includes(type)) {
        riskLevel = 'MEDIUM';
      }
    }
  });
  
  // Check for healthcare-specific terms
  const healthcareTermCount = HEALTHCARE_TERMS.filter(term => 
    sanitizedText.toLowerCase().includes(term.toLowerCase())
  ).length;
  
  if (healthcareTermCount > 5) {
    riskLevel = riskLevel === 'LOW' ? 'MEDIUM' : riskLevel;
  }
  
  // Additional sanitization for medical terminology
  sanitizedText = sanitizeMedicalTerms(sanitizedText);
  
  return {
    sanitizedText,
    removedPatterns,
    riskLevel,
  };
};

const sanitizeMedicalTerms = (text: string): string => {
  // Replace specific medical identifiers with generic terms
  const medicalReplacements = [
    // Patient names (common patterns)
    { pattern: /\b(?:Patient|Pt|Client)\s*[:#]?\s*[A-Z][a-z]+\s+[A-Z][a-z]+\b/g, replacement: '[PATIENT_NAME]' },
    
    // Doctor names
    { pattern: /\b(?:Dr|Doctor)\s*\.?\s*[A-Z][a-z]+\s+[A-Z][a-z]+\b/g, replacement: '[PHYSICIAN_NAME]' },
    
    // Hospital/clinic names
    { pattern: /\b(?:Hospital|Clinic|Medical Center|Health Center)\s+[A-Z][a-z\s]+\b/g, replacement: '[FACILITY_NAME]' },
    
    // Specific medical conditions (replace with categories)
    { pattern: /\b(?:diabetes|hypertension|asthma|cancer|heart disease)\b/gi, replacement: '[MEDICAL_CONDITION]' },
  ];
  
  let sanitized = text;
  medicalReplacements.forEach(({ pattern, replacement }) => {
    sanitized = sanitized.replace(pattern, replacement);
  });
  
  return sanitized;
};

export const validateSanitization = (original: string, sanitized: string): boolean => {
  // Check if sensitive patterns were properly removed
  const sensitivePatterns = Object.values(PHI_PATTERNS);
  
  for (const pattern of sensitivePatterns) {
    const originalMatches = original.match(pattern);
    const sanitizedMatches = sanitized.match(pattern);
    
    if (originalMatches && sanitizedMatches && originalMatches.length === sanitizedMatches.length) {
      return false; // Sanitization failed
    }
  }
  
  return true;
}; 