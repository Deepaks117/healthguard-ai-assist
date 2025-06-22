
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Shield, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { signUp } from '@/integrations/supabase/auth';

const signupSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  clinic_name: z.string().min(2, 'Clinic name must be at least 2 characters'),
  standards: z.array(z.string()).min(1, 'Please select at least one compliance standard'),
});

type SignupForm = z.infer<typeof signupSchema>;

const Signup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStandards, setSelectedStandards] = useState<string[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  });

  const standards = [
    { id: 'HIPAA', label: 'HIPAA (Health Insurance Portability and Accountability Act)' },
    { id: 'GDPR', label: 'GDPR (General Data Protection Regulation)' },
  ];

  const handleStandardChange = (standardId: string, checked: boolean) => {
    const updated = checked
      ? [...selectedStandards, standardId]
      : selectedStandards.filter((id) => id !== standardId);
    
    setSelectedStandards(updated);
    setValue('standards', updated);
  };

  const onSubmit = async (data: SignupForm) => {
    setIsLoading(true);
    
    try {
      const { user, error } = await signUp({
        email: data.email,
        password: data.password,
        clinic_name: data.clinic_name,
        standards: data.standards,
      });
      
      if (error) {
        toast({
          title: 'Signup Failed',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }

      if (user) {
        toast({
          title: 'Welcome to HealthGuard360!',
          description: 'Your account has been created successfully. Please check your email to verify your account.',
        });
        navigate('/');
      }
    } catch (error) {
      toast({
        title: 'Signup Failed',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Shield className="h-8 w-8 text-[#003366]" />
            <h1 className="text-2xl font-bold text-[#003366]">HealthGuard360</h1>
          </div>
          <CardTitle>Create Account</CardTitle>
          <CardDescription>
            Start your 7-day free trial and simplify healthcare compliance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register('email')}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Choose a secure password"
                {...register('password')}
                disabled={isLoading}
              />
              {errors.password && (
                <p className="text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="clinic_name">Clinic Name</Label>
              <Input
                id="clinic_name"
                type="text"
                placeholder="Your Healthcare Practice"
                {...register('clinic_name')}
                disabled={isLoading}
              />
              {errors.clinic_name && (
                <p className="text-sm text-red-600">{errors.clinic_name.message}</p>
              )}
            </div>

            <div className="space-y-3">
              <Label>Compliance Standards</Label>
              {standards.map((standard) => (
                <div key={standard.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={standard.id}
                    checked={selectedStandards.includes(standard.id)}
                    onCheckedChange={(checked) =>
                      handleStandardChange(standard.id, checked as boolean)
                    }
                    disabled={isLoading}
                  />
                  <Label
                    htmlFor={standard.id}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {standard.label}
                  </Label>
                </div>
              ))}
              {errors.standards && (
                <p className="text-sm text-red-600">{errors.standards.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-[#003366] hover:bg-[#004080]"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Start Free Trial'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">Already have an account? </span>
            <Link
              to="/login"
              className="text-[#003366] hover:text-[#004080] font-medium"
            >
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;
