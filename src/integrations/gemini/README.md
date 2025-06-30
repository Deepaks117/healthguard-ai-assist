# Google Gemini Integration for HealthGuard360

This integration provides AI-powered compliance analysis using Google's Gemini API with built-in data sanitization for HIPAA compliance.

## Setup

### 1. Get Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add the key to your `.env` file:
   ```
   VITE_GEMINI_API_KEY=your_api_key_here
   ```

### 2. Install Dependencies

```bash
npm install @google/generative-ai
```

## Features

### 🔒 Data Sanitization
- **PHI Detection**: Automatically detects and removes Personal Health Information
- **Pattern Recognition**: Identifies SSNs, phone numbers, emails, addresses, etc.
- **Medical Terms**: Sanitizes patient names, doctor names, facility names
- **Risk Assessment**: Evaluates data sensitivity levels

### 🤖 AI Analysis
- **HIPAA Compliance**: Analyzes documents for HIPAA violations
- **GDPR Compliance**: Checks for GDPR compliance issues
- **General Security**: Identifies security and privacy gaps
- **Structured Output**: Returns detailed compliance reports with scores

### 🛡️ Safety Features
- **Content Filtering**: Built-in safety settings for healthcare content
- **Error Handling**: Graceful fallback to keyword-based analysis
- **Audit Logging**: Tracks all analysis activities

## Usage

### Basic Document Analysis

```typescript
import { useGeminiCompliance } from '@/hooks/useGeminiCompliance';

const { analyzeDocument, currentReport, isAnalyzing } = useGeminiCompliance();

// Analyze a file
await analyzeDocument(file, ['HIPAA', 'GDPR']);

// Analyze text
await analyzeText(text, 'Document Name', ['HIPAA']);
```

### Compliance Report Structure

```typescript
interface ComplianceReport {
  documentId: string;
  fileName: string;
  timestamp: string;
  overallScore: number; // 0-100
  issues: ComplianceIssue[];
  sanitizationResult: {
    sanitizedText: string;
    removedPatterns: string[];
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  };
  summary: string;
  recommendations: string[];
}
```

## Security Considerations

### Data Protection
- All documents are sanitized before sending to Gemini API
- PHI and sensitive information are automatically redacted
- No raw patient data is transmitted to external services

### API Security
- API keys are stored in environment variables
- Requests include safety settings to prevent harmful content
- All analysis is logged for audit purposes

### Compliance
- Meets HIPAA requirements for data handling
- Supports GDPR compliance analysis
- Maintains audit trails for regulatory compliance

## Error Handling

The integration includes comprehensive error handling:

1. **API Failures**: Falls back to keyword-based analysis
2. **Sanitization Errors**: Prevents analysis if data protection fails
3. **Network Issues**: Graceful degradation with user feedback
4. **Rate Limiting**: Built-in retry logic and user notifications

## Cost Optimization

- **Efficient Prompts**: Optimized prompts to minimize token usage
- **Caching**: Results are cached to avoid duplicate analysis
- **Batch Processing**: Supports multiple documents in sequence
- **Fallback Analysis**: Reduces API calls for simple cases

## Testing

Run the integration tests:

```bash
npm run test:gemini
```

## Troubleshooting

### Common Issues

1. **API Key Not Found**: Ensure `VITE_GEMINI_API_KEY` is set in `.env`
2. **Rate Limiting**: Check API usage limits in Google AI Studio
3. **Large Files**: Files over 5MB are rejected for performance
4. **Unsupported Formats**: Only text-based files are supported

### Debug Mode

Enable debug logging by setting:
```
VITE_DEBUG_GEMINI=true
```

## Support

For issues with the Gemini integration:
1. Check the browser console for error messages
2. Verify API key configuration
3. Review network requests in browser dev tools
4. Check Supabase logs for database errors 