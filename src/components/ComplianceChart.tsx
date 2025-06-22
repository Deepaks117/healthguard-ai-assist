
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ComplianceChartProps {
  hipaa: number;
  gdpr: number;
  documentation: number;
}

export const ComplianceChart = ({ hipaa, gdpr, documentation }: ComplianceChartProps) => {
  const data = [
    {
      name: 'HIPAA',
      score: hipaa,
      fill: '#228B22',
    },
    {
      name: 'GDPR',
      score: gdpr,
      fill: '#ADD8E6',
    },
    {
      name: 'Documentation',
      score: documentation,
      fill: '#003366',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Compliance Standards</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[0, 100]} />
            <Tooltip formatter={(value) => [`${value}%`, 'Score']} />
            <Bar dataKey="score" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
