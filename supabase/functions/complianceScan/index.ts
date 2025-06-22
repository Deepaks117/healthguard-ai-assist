
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ScanRequest {
  documentPath: string;
  documentName: string;
  text: string;
}

interface ComplianceIssue {
  type: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  suggestion: string;
}

// Keyword-based compliance checker logic
const scanDocumentForCompliance = (text: string) => {
  const issues: ComplianceIssue[] = [];
  const textLower = text.toLowerCase();

  // Critical issues
  if (textLower.includes('unencrypted') || textLower.includes('not encrypted')) {
    issues.push({
      type: 'critical',
      title: 'Missing Encryption',
      description: 'Document references unencrypted data transmission or storage',
      suggestion: 'Implement AES-256 encryption for data at rest and TLS 1.3 for data in transit'
    });
  }

  if (textLower.includes('password') && textLower.includes('shared')) {
    issues.push({
      type: 'critical',
      title: 'Password Sharing Detected',
      description: 'References to shared passwords found',
      suggestion: 'Implement individual user accounts with strong authentication'
    });
  }

  // Warning issues
  if (textLower.includes('outdated') || textLower.includes('old policy')) {
    issues.push({
      type: 'warning',
      title: 'Outdated Policy Reference',
      description: 'Document may reference outdated policies or procedures',
      suggestion: 'Review and update policies to current regulatory standards'
    });
  }

  if (textLower.includes('no backup') || textLower.includes('not backed up')) {
    issues.push({
      type: 'warning',
      title: 'Missing Backup Strategy',
      description: 'No backup procedures mentioned',
      suggestion: 'Implement automated backup procedures for all patient data'
    });
  }

  // Info issues
  if (textLower.includes('training') && !textLower.includes('completed')) {
    issues.push({
      type: 'info',
      title: 'Training Status Unclear',
      description: 'Staff training completion status needs clarification',
      suggestion: 'Document completion dates and renewal schedules for all training'
    });
  }

  // Calculate score (100 - 10 per critical, 5 per warning, 2 per info)
  const criticalCount = issues.filter(i => i.type === 'critical').length;
  const warningCount = issues.filter(i => i.type === 'warning').length;
  const infoCount = issues.filter(i => i.type === 'info').length;
  
  const score = Math.max(0, 100 - (criticalCount * 10) - (warningCount * 5) - (infoCount * 2));

  return { score, issues };
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get user from auth header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error("Unauthorized");
    }

    const body: ScanRequest = await req.json();
    console.log('Processing compliance scan for user:', user.id);

    // Perform compliance scan
    const scanResult = scanDocumentForCompliance(body.text);
    
    // Save result to database
    const { data: reportData, error: insertError } = await supabase
      .from('compliance_reports')
      .insert({
        user_id: user.id,
        document_id: body.documentPath,
        document_name: body.documentName,
        score: scanResult.score,
        issues: scanResult.issues,
        scanned_text: body.text.substring(0, 1000)
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error saving scan result:', insertError);
      throw new Error('Failed to save scan result');
    }

    // Log the action
    await supabase
      .from('audit_logs')
      .insert({
        user_id: user.id,
        action: 'compliance_scan',
        resource_type: 'document',
        resource_id: body.documentPath,
        details: {
          document_name: body.documentName,
          score: scanResult.score,
          issues_count: scanResult.issues.length
        }
      });

    console.log('Compliance scan completed successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        result: scanResult,
        reportId: reportData.id
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200
      }
    );

  } catch (error) {
    console.error('Compliance scan error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      }
    );
  }
});
