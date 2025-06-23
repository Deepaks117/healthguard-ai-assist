
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ComplianceHistoryChartProps {
  data?: Array<{
    date: string;
    overall: number;
    hipaa: number;
    gdpr: number;
    documentation: number;
  }>;
}

export const ComplianceHistoryChart = ({ data }: ComplianceHistoryChartProps) => {
  // Sample data if none provided
  const defaultData = [
    { date: '2024-01', overall: 75, hipaa: 78, gdpr: 72, documentation: 76 },
    { date: '2024-02', overall: 78, hipaa: 80, gdpr: 75, documentation: 79 },
    { date: '2024-03', overall: 82, hipaa: 85, gdpr: 78, documentation: 83 },
    { date: '2024-04', overall: 85, hipaa: 87, gdpr: 82, documentation: 86 },
    { date: '2024-05', overall: 88, hipaa: 90, gdpr: 85, documentation: 89 },
    { date: '2024-06', overall: 85, hipaa: 88, gdpr: 83, documentation: 84 },
  ];

  const chartData = data || defaultData;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Compliance Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[0, 100]} />
            <Tooltip formatter={(value) => [`${value}%`, 'Score']} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="overall" 
              stroke="#003366" 
              strokeWidth={3}
              name="Overall"
            />
            <Line 
              type="monotone" 
              dataKey="hipaa" 
              stroke="#228B22" 
              strokeWidth={2}
              name="HIPAA"
            />
            <Line 
              type="monotone" 
              dataKey="gdpr" 
              stroke="#ADD8E6" 
              strokeWidth={2}
              name="GDPR"
            />
            <Line 
              type="monotone" 
              dataKey="documentation" 
              stroke="#FF6B6B" 
              strokeWidth={2}
              name="Documentation"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
