
import { Badge } from '@/components/ui/badge';
import { useTrainingModules } from '@/hooks/useTrainingModules';
import { TrainingModuleCard } from './TrainingModuleCard';

export const TrainingModulesList = () => {
  const {
    modules,
    isLoading,
    startingModule,
    handleStartModule,
    handleCompleteModule,
    isCompleting,
  } = useTrainingModules();

  if (isLoading) {
    return <div className="text-center py-8">Loading training modules...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#003366]">Training Modules</h2>
        <Badge variant="outline" className="text-sm">
          {modules?.filter(m => m.progress?.completed).length || 0} of {modules?.length || 0} completed
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {modules?.map((module) => (
          <TrainingModuleCard
            key={module.id}
            module={module}
            onStart={handleStartModule}
            onComplete={handleCompleteModule}
            isStarting={startingModule === module.id}
            isCompleting={isCompleting}
          />
        ))}
      </div>
    </div>
  );
};
