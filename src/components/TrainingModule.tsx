
import { useState } from "react";
import { Users, Play, CheckCircle, Clock, Award, BookOpen, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const TrainingModule = () => {
  const [selectedCourse, setSelectedCourse] = useState(null);

  const trainingStats = {
    completionRate: 78,
    staffTrained: 12,
    totalStaff: 15,
    certificationsEarned: 8
  };

  const courses = [
    {
      id: 1,
      title: "HIPAA Privacy Fundamentals",
      description: "Essential privacy rules and patient rights under HIPAA",
      duration: "45 min",
      difficulty: "Beginner",
      completion: 100,
      status: "completed",
      enrollees: 15,
      lastUpdated: "2 weeks ago"
    },
    {
      id: 2,
      title: "Cybersecurity Awareness",
      description: "Identify and prevent common cybersecurity threats",
      duration: "30 min",
      difficulty: "Beginner",
      completion: 85,
      status: "in-progress",
      enrollees: 12,
      lastUpdated: "1 week ago"
    },
    {
      id: 3,
      title: "Data Breach Response",
      description: "Step-by-step guide to handling data breaches",
      duration: "60 min",
      difficulty: "Intermediate",
      completion: 0,
      status: "not-started",
      enrollees: 8,
      lastUpdated: "3 days ago"
    },
    {
      id: 4,
      title: "GDPR Compliance",
      description: "European data protection regulations for healthcare",
      duration: "40 min",
      difficulty: "Intermediate",
      completion: 67,
      status: "in-progress",
      enrollees: 10,
      lastUpdated: "5 days ago"
    }
  ];

  const staffProgress = [
    { name: "Dr. Sarah Johnson", role: "Physician", completed: 4, total: 4, score: 95 },
    { name: "Nurse Mike Chen", role: "Nurse", completed: 3, total: 4, score: 87 },
    { name: "Lisa Park", role: "Administrator", completed: 4, total: 4, score: 92 },
    { name: "Dr. Emily Rodriguez", role: "Physician", completed: 2, total: 4, score: 89 },
    { name: "Tom Wilson", role: "IT Support", completed: 3, total: 4, score: 91 }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "completed": return "bg-[#228B22]";
      case "in-progress": return "bg-[#ADD8E6]";
      case "not-started": return "bg-gray-400";
      default: return "bg-gray-400";
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Beginner": return "border-green-500 text-green-500";
      case "Intermediate": return "border-yellow-500 text-yellow-500";
      case "Advanced": return "border-red-500 text-red-500";
      default: return "border-gray-500 text-gray-500";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-[#003366]">Training & Education</h2>
        <Badge variant="outline" className="border-[#228B22] text-[#228B22]">
          Compliance Training Hub
        </Badge>
      </div>

      {/* Training Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-[#228B22]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <Target className="h-4 w-4 text-[#228B22]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#228B22]">{trainingStats.completionRate}%</div>
            <Progress value={trainingStats.completionRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#003366]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Staff Trained</CardTitle>
            <Users className="h-4 w-4 text-[#003366]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#003366]">{trainingStats.staffTrained}/{trainingStats.totalStaff}</div>
            <p className="text-xs text-muted-foreground">Active participants</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#ADD8E6]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-[#ADD8E6]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#ADD8E6]">{courses.length}</div>
            <p className="text-xs text-muted-foreground">Available modules</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#228B22]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Certifications</CardTitle>
            <Award className="h-4 w-4 text-[#228B22]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#228B22]">{trainingStats.certificationsEarned}</div>
            <p className="text-xs text-muted-foreground">Earned this month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="courses" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="courses">Training Library</TabsTrigger>
          <TabsTrigger value="progress">Staff Progress</TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Available Training Courses</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {courses.map((course) => (
                <div key={course.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-lg">{course.title}</h3>
                        <Badge variant="outline" className={getDifficultyColor(course.difficulty)}>
                          {course.difficulty}
                        </Badge>
                      </div>
                      <p className="text-gray-600">{course.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{course.duration}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>{course.enrollees} enrolled</span>
                        </div>
                        <span>Updated {course.lastUpdated}</span>
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      <div className={`h-3 w-3 rounded-full ${getStatusColor(course.status)}`} />
                      <Button size="sm" className="bg-[#003366] hover:bg-[#004080]">
                        <Play className="h-3 w-3 mr-1" />
                        {course.status === "completed" ? "Review" : course.status === "in-progress" ? "Continue" : "Start"}
                      </Button>
                    </div>
                  </div>
                  
                  {course.status !== "not-started" && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{course.completion}%</span>
                      </div>
                      <Progress value={course.completion} className="h-2" />
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Individual Staff Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {staffProgress.map((staff, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-[#ADD8E6] rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">{staff.name}</p>
                      <p className="text-sm text-gray-500">{staff.role}</p>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{staff.completed}/{staff.total} completed</span>
                      {staff.completed === staff.total && (
                        <CheckCircle className="h-4 w-4 text-[#228B22]" />
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">Score: {staff.score}%</span>
                      <Progress value={(staff.completed / staff.total) * 100} className="w-20 h-2" />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
