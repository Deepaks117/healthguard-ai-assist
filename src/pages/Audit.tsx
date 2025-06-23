
import { Header } from '@/components/Header';
import { AuditTrail } from '@/components/AuditTrail';

const Audit = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#003366] mb-2">
            Audit Trail & Activity Logs
          </h1>
          <p className="text-gray-600">
            Track all compliance-related activities and maintain detailed audit records
          </p>
        </div>

        <AuditTrail />
      </main>
    </div>
  );
};

export default Audit;
