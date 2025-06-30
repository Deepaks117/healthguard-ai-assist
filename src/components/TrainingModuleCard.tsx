
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { PlayCircle, Clock, CheckCircle, Award } from 'lucide-react';

interface TrainingModule {
  id: string;
  title: string;
  description: string;
  duration_minutes: number;
  difficulty: string;
  video_url: string | null;
  progress?: {
    completed: boolean;
    score: number | null;
    completed_at: string | null;
  };
}

interface TrainingModuleCardProps {
  module: TrainingModule;
  onStart: (moduleId: string) => void;
  onComplete: (moduleId: string, score: number) => void;
  isStarting: boolean;
  isCompleting: boolean;
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'beginner': return 'bg-green-100 text-green-800';
    case 'intermediate': return 'bg-yellow-100 text-yellow-800';
    case 'advanced': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const TrainingModuleCard = ({ 
  module, 
  onStart, 
  onComplete, 
  isStarting, 
  isCompleting 
}: TrainingModuleCardProps) => {
  return (
    <Card key={module.id} className="relative">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{module.title}</CardTitle>
            <p className="text-sm text-gray-600 mt-2">{module.description}</p>
          </div>
          {module.progress?.completed && (
            <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>{module.duration_minutes} minutes</span>
          </div>
          <Badge className={getDifficultyColor(module.difficulty)}>
            {module.difficulty}
          </Badge>
        </div>

        {module.progress?.completed ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Completed</span>
              {module.progress.score && (
                <Badge variant="default">{module.progress.score}% Score</Badge>
              )}
            </div>
            <Progress value={100} className="w-full" />
            <p className="text-xs text-gray-500">
              Completed on {new Date(module.progress.completed_at!).toLocaleDateString()}
            </p>
          </div>
        ) : module.progress && !module.progress.completed ? (
          <div className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">In Progress</span>
                <Badge variant="secondary">Started</Badge>
              </div>
              <Progress value={50} className="w-full" />
              <div className="flex space-x-2">
                <Button
                  onClick={() => onComplete(module.id, Math.floor(Math.random() * 20) + 80)}
                  disabled={isCompleting}
                  className="flex-1"
                >
                  <Award className="h-4 w-4 mr-2" />
                  Complete Module
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <Button
            onClick={() => onStart(module.id)}
            disabled={isStarting}
            className="w-full"
          >
            <PlayCircle className="h-4 w-4 mr-2" />
            {isStarting ? 'Starting...' : 'Start Module'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
