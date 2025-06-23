
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Header } from '@/components/Header';
import { TrainingDashboard } from '@/components/TrainingDashboard';
import { TrainingModulesList } from '@/components/TrainingModulesList';
import { BookOpen, BarChart3 } from 'lucide-react';

const Training = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#003366] mb-2">
            Compliance Training Center
          </h1>
          <p className="text-gray-600">
            Complete training modules to improve your compliance knowledge and skills
          </p>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="modules" className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4" />
              <span>Modules</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <TrainingDashboard />
          </TabsContent>

          <TabsContent value="modules">
            <TrainingModulesList />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Training;
