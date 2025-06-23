
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Clock, Award, TrendingUp } from 'lucide-react';
import { useTrainingProgress } from '@/hooks/useTrainingProgress';

export const TrainingDashboard = () => {
  const { data: trainingData, isLoading } = useTrainingProgress();

  if (isLoading) {
    return <div className="text-center py-8">Loading training data...</div>;
  }

  const { totalModules, completedModules, progressPercentage, recentlyCompleted } = trainingData || {
    totalModules: 0,
    completedModules: 0,
    progressPercentage: 0,
    recentlyCompleted: []
  };

  return (
    <div className="space-y-6">
      {/* Training Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5" />
            <span>Training Progress Overview</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#003366]">{completedModules}</div>
              <div className="text-sm text-gray-600">Completed Modules</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{progressPercentage}%</div>
              <div className="text-sm text-gray-600">Overall Progress</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{totalModules}</div>
              <div className="text-sm text-gray-600">Total Modules</div>
            </div>
          </div>
          <div className="mt-6">
            <Progress value={progressPercentage} className="w-full h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Recently Completed */}
      {recentlyCompleted.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="h-5 w-5" />
              <span>Recently Completed</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentlyCompleted.map((module) => (
                <div key={module.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{module.title}</h4>
                    <p className="text-sm text-gray-600">
                      Completed {new Date(module.completedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="default">
                    <Award className="h-3 w-3 mr-1" />
                    Completed
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
