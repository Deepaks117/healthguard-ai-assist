"""
HealthGuard360 Data Flow Monitoring with Prefect
This module monitors and visualizes data flow through your healthcare compliance platform.
"""

from prefect import flow, task, get_run_logger
import json
from datetime import datetime
from typing import Dict, Any, List, Optional

# ============================================================================
# HEALTHGUARD360 SYSTEM COMPONENTS
# ============================================================================

@task
def monitor_user_authentication(user_id: str, action: str, timestamp: Optional[str] = None) -> Dict[str, Any]:
    """Monitor user authentication flow in HealthGuard360"""
    logger = get_run_logger()
    if not timestamp:
        timestamp = datetime.now().isoformat()
    logger.info(f"🔐 Authentication: User {user_id} performed {action}")
    flow_data = {
        "timestamp": timestamp,
        "user_id": user_id,
        "action": action,
        "component": "authentication",
        "subsystem": "supabase_auth",
        "status": "success",
        "flow_step": "user_authentication",
        "duration_ms": 150,
        "data_flow": ["user_input", "supabase_auth", "session_creation", "dashboard_access"]
    }
    logger.info(f"📊 Auth Flow Data: {json.dumps(flow_data, indent=2)}")
    return flow_data

@task
def monitor_document_upload(user_id: str, document_name: str, file_size: int, file_type: str) -> Dict[str, Any]:
    logger = get_run_logger()
    timestamp = datetime.now().isoformat()
    logger.info(f"📄 Document Upload: {document_name} ({file_size} bytes) by user {user_id}")
    flow_data = {
        "timestamp": timestamp,
        "user_id": user_id,
        "action": "document_upload",
        "document_name": document_name,
        "file_size": file_size,
        "file_type": file_type,
        "component": "storage",
        "subsystem": "supabase_storage",
        "status": "success",
        "flow_step": "file_upload",
        "duration_ms": 2500,
        "data_flow": ["file_selection", "validation", "supabase_storage", "metadata_save", "scan_trigger"]
    }
    logger.info(f"📊 Upload Flow Data: {json.dumps(flow_data, indent=2)}")
    return flow_data

@task
def monitor_compliance_scan(user_id: str, document_id: str, scan_type: str, document_content: str) -> Dict[str, Any]:
    logger = get_run_logger()
    timestamp = datetime.now().isoformat()
    logger.info(f"🔍 Compliance Scan: {scan_type} for document {document_id}")
    analysis_duration = 3000
    issues_found = len([word for word in document_content.lower().split() if word in ['patient', 'medical', 'health']])
    flow_data = {
        "timestamp": timestamp,
        "user_id": user_id,
        "action": "compliance_scan",
        "document_id": document_id,
        "scan_type": scan_type,
        "component": "ai_analysis",
        "subsystem": "compliance_checker",
        "status": "success",
        "flow_step": "compliance_analysis",
        "duration_ms": analysis_duration,
        "issues_found": issues_found,
        "data_flow": ["document_retrieval", "ai_analysis", "compliance_check", "issue_identification", "result_storage"]
    }
    logger.info(f"📊 Scan Flow Data: {json.dumps(flow_data, indent=2)}")
    return flow_data

@task
def monitor_database_operations(user_id: str, operation: str, table: str, record_count: int = 1) -> Dict[str, Any]:
    logger = get_run_logger()
    timestamp = datetime.now().isoformat()
    logger.info(f"🗄️ Database Operation: {operation} on {table} by user {user_id}")
    flow_data = {
        "timestamp": timestamp,
        "user_id": user_id,
        "action": "database_operation",
        "operation": operation,
        "table": table,
        "record_count": record_count,
        "component": "database",
        "subsystem": "supabase_postgres",
        "status": "success",
        "flow_step": "data_persistence",
        "duration_ms": 50,
        "data_flow": ["query_preparation", "execution", "data_persistence", "audit_logging"]
    }
    logger.info(f"📊 Database Flow Data: {json.dumps(flow_data, indent=2)}")
    return flow_data

@task
def monitor_training_progress(user_id: str, module_name: str, progress_percentage: int) -> Dict[str, Any]:
    logger = get_run_logger()
    timestamp = datetime.now().isoformat()
    logger.info(f"📚 Training Progress: {module_name} - {progress_percentage}% by user {user_id}")
    flow_data = {
        "timestamp": timestamp,
        "user_id": user_id,
        "action": "training_progress",
        "module_name": module_name,
        "progress_percentage": progress_percentage,
        "component": "training",
        "subsystem": "learning_management",
        "status": "success",
        "flow_step": "progress_tracking",
        "duration_ms": 100,
        "data_flow": ["module_access", "progress_tracking", "completion_check", "certificate_generation"]
    }
    logger.info(f"📊 Training Flow Data: {json.dumps(flow_data, indent=2)}")
    return flow_data

@task
def monitor_notification_system(user_id: str, notification_type: str, message: str, channel: str = "email") -> Dict[str, Any]:
    logger = get_run_logger()
    timestamp = datetime.now().isoformat()
    logger.info(f"🔔 Notification: {notification_type} sent to user {user_id} via {channel}")
    flow_data = {
        "timestamp": timestamp,
        "user_id": user_id,
        "action": "notification_sent",
        "notification_type": notification_type,
        "message": message,
        "channel": channel,
        "component": "notifications",
        "subsystem": "communication_service",
        "status": "success",
        "flow_step": "user_notification",
        "duration_ms": 200,
        "data_flow": ["event_trigger", "notification_preparation", "delivery", "delivery_status"]
    }
    logger.info(f"📊 Notification Flow Data: {json.dumps(flow_data, indent=2)}")
    return flow_data

@task
def generate_system_summary(flow_data: List[Dict[str, Any]]) -> Dict[str, Any]:
    logger = get_run_logger()
    total_operations = len(flow_data)
    components_used = list(set(item["component"] for item in flow_data))
    users_involved = list(set(item["user_id"] for item in flow_data))
    total_duration = sum(item.get("duration_ms", 0) for item in flow_data)
    avg_duration = total_duration / total_operations if total_operations > 0 else 0
    flow_patterns = {}
    for item in flow_data:
        pattern = item.get("flow_step", "unknown")
        if pattern not in flow_patterns:
            flow_patterns[pattern] = 0
        flow_patterns[pattern] += 1
    summary = {
        "timestamp": datetime.now().isoformat(),
        "total_operations": total_operations,
        "components_used": components_used,
        "users_involved": users_involved,
        "total_duration_ms": total_duration,
        "average_duration_ms": round(avg_duration, 2),
        "flow_patterns": flow_patterns,
        "system_health": "excellent" if avg_duration < 1000 else "good" if avg_duration < 3000 else "needs_attention"
    }
    logger.info(f"📊 System Summary: {total_operations} operations across {len(components_used)} components")
    logger.info(f"📊 System Summary Data: {json.dumps(summary, indent=2)}")
    return summary

# ============================================================================
# MAIN DATA FLOW MONITORING FLOWS
# ============================================================================

@flow(name="healthguard360-complete-user-journey")
def monitor_complete_user_journey(
    user_id: str = "demo_user_123",
    document_name: str = "patient_data_policy.pdf",
    scan_type: str = "HIPAA"
):
    logger = get_run_logger()
    logger.info("🚀 Starting HealthGuard360 Complete User Journey Monitoring")
    flow_data = []
    logger.info("Step 1: User Authentication")
    auth_data = monitor_user_authentication(user_id, "login")
    flow_data.append(auth_data)
    logger.info("Step 2: Document Upload")
    upload_data = monitor_document_upload(user_id, document_name, 1024000, "application/pdf")
    flow_data.append(upload_data)
    logger.info("Step 3: Database Operation - Save Metadata")
    db_data = monitor_database_operations(user_id, "INSERT", "compliance_reports", 1)
    flow_data.append(db_data)
    logger.info("Step 4: Compliance Scan")
    sample_content = "This document contains patient medical information and must comply with HIPAA regulations."
    scan_data = monitor_compliance_scan(user_id, "doc_123", scan_type, sample_content)
    flow_data.append(scan_data)
    logger.info("Step 5: Database Operation - Save Results")
    db_data2 = monitor_database_operations(user_id, "UPDATE", "compliance_reports", 1)
    flow_data.append(db_data2)
    logger.info("Step 6: Training Progress")
    training_data = monitor_training_progress(user_id, "HIPAA Compliance", 75)
    flow_data.append(training_data)
    logger.info("Step 7: User Notification")
    notification_data = monitor_notification_system(user_id, "scan_complete", f"Compliance scan completed for {document_name}. Found {scan_data['issues_found']} potential issues.", "email")
    flow_data.append(notification_data)
    logger.info("Step 8: Generate System Summary")
    summary = generate_system_summary(flow_data)
    logger.info("✅ HealthGuard360 Complete User Journey Monitoring Finished")
    return {
        "flow_data": flow_data,
        "summary": summary,
        "status": "completed",
        "total_steps": len(flow_data)
    }

@flow(name="healthguard360-performance-test")
def performance_testing_flow(num_users: int = 5, operations_per_user: int = 3):
    logger = get_run_logger()
    logger.info(f"🧪 Starting Performance Test: {num_users} users, {operations_per_user} operations each")
    all_flow_data = []
    for user_num in range(num_users):
        user_id = f"test_user_{user_num + 1}"
        logger.info(f"Testing user: {user_id}")
        for op_num in range(operations_per_user):
            if op_num == 0:
                data = monitor_user_authentication(user_id, "login")
            elif op_num == 1:
                data = monitor_document_upload(user_id, f"test_doc_{user_num}.pdf", 512000, "application/pdf")
            else:
                data = monitor_compliance_scan(user_id, f"doc_{user_num}_{op_num}", "GDPR", "Sample content for testing")
            all_flow_data.append(data)
    summary = generate_system_summary(all_flow_data)
    logger.info(f"✅ Performance Test Completed: {len(all_flow_data)} total operations")
    return {
        "flow_data": all_flow_data,
        "summary": summary,
        "performance_metrics": {
            "total_operations": len(all_flow_data),
            "total_users": num_users,
            "operations_per_user": operations_per_user,
            "average_response_time": summary["average_duration_ms"]
        }
    }

def run_monitoring_demo():
    print("🏥 HealthGuard360 Data Flow Monitoring Demo")
    print("=" * 50)
    print("\n1️⃣ Running Complete User Journey...")
    journey_result = monitor_complete_user_journey()
    print(f"   ✅ Completed {journey_result['total_steps']} steps")
    print("\n2️⃣ Running Performance Test...")
    perf_result = performance_testing_flow(3, 2)
    print(f"   ✅ Completed {perf_result['performance_metrics']['total_operations']} operations")
    print("\n🎉 Monitoring Demo Complete!")
    print("📊 Check your Prefect Cloud dashboard for detailed visualizations")
    return {
        "journey": journey_result,
        "performance": perf_result
    }

if __name__ == "__main__":
    run_monitoring_demo() 