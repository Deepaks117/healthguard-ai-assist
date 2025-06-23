#!/usr/bin/env python3
"""
HealthGuard360 Data Flow Monitoring Runner
Run this script to monitor and visualize your system's data flow
"""

import os
import sys
from datetime import datetime

# Add current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from healthguard_flows import monitor_complete_user_journey, performance_testing_flow

def main():
    """Main function to run HealthGuard360 data flow monitoring"""
    
    print("🏥 HealthGuard360 Data Flow Monitoring")
    print("=" * 50)
    print(f"⏰ Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    try:
        # Run complete user journey monitoring
        print("\n1️⃣ Running Complete User Journey Monitoring...")
        journey_result = monitor_complete_user_journey(
            user_id="demo_user_123",
            document_name="patient_data_policy.pdf",
            scan_type="HIPAA"
        )
        
        print(f"   ✅ Completed {journey_result['total_steps']} steps")
        print(f"   📊 Total operations: {journey_result['summary']['total_operations']}")
        print(f"   🔧 Components used: {', '.join(journey_result['summary']['components_used'])}")
        print(f"   ⏱️  Average response time: {journey_result['summary']['average_duration_ms']}ms")
        print(f"   🏥 System health: {journey_result['summary']['system_health'].upper()}")
        
        # Run performance testing
        print("\n2️⃣ Running Performance Testing...")
        perf_result = performance_testing_flow(
            num_users=3,
            operations_per_user=2
        )
        
        print(f"   ✅ Completed {perf_result['performance_metrics']['total_operations']} operations")
        print(f"   👥 Users tested: {perf_result['performance_metrics']['total_users']}")
        print(f"   📈 Average response time: {perf_result['performance_metrics']['average_response_time']}ms")
        
        print("\n🎉 HealthGuard360 Data Flow Monitoring Complete!")
        print("\n📝 What you can see in Prefect Cloud:")
        print("   • Detailed flow visualizations")
        print("   • Component interaction maps")
        print("   • Performance metrics and charts")
        print("   • System architecture diagrams")
        print("   • Data flow patterns and insights")
        
        print(f"\n⏰ Completed at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        
        return {
            "journey": journey_result,
            "performance": perf_result,
            "status": "success"
        }
        
    except Exception as e:
        print(f"❌ Error during monitoring: {e}")
        return {"status": "error", "message": str(e)}

if __name__ == "__main__":
    result = main()
    print(f"\n📊 Final Status: {result['status']}") 