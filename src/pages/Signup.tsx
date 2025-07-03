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
  address: z.string().min(5, 'Address must be at least 5 characters'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  state: z.string().min(2, 'State must be at least 2 characters'),
  zip: z.string().min(4, 'ZIP/Postal code must be at least 4 characters'),
  country: z.string().min(2, 'Country must be at least 2 characters'),
  contact_phone: z.string().min(7, 'Contact phone must be at least 7 digits'),
  primary_contact_name: z.string().min(2, 'Primary contact name must be at least 2 characters'),
  primary_contact_email: z.string().email('Please enter a valid email for primary contact'),
  primary_contact_phone: z.string().min(7, 'Primary contact phone must be at least 7 digits'),
  clinic_type: z.string().min(2, 'Please select a clinic type'),
  license_number: z.string().min(2, 'License number required'),
  license_authority: z.string().min(2, 'License authority required'),
  license_expiration: z.string().min(4, 'License expiration required'),
  compliance_officer_name: z.string().optional(),
  compliance_officer_email: z.string().email('Please enter a valid email for compliance officer').optional(),
  compliance_officer_phone: z.string().optional(),
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

  const clinicTypes = [
    { id: 'hospital', label: 'Hospital' },
    { id: 'private_practice', label: 'Private Practice' },
    { id: 'specialty_clinic', label: 'Specialty Clinic' },
    { id: 'other', label: 'Other' },
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

            <div className="space-y-2">
              <Label htmlFor="clinic_type">Clinic Type</Label>
              <select
                id="clinic_type"
                {...register('clinic_type')}
                disabled={isLoading}
                className="w-full border rounded p-2"
              >
                <option value="">Select type</option>
                {clinicTypes.map((type) => (
                  <option key={type.id} value={type.label}>
                    {type.label}
                  </option>
                ))}
              </select>
              {errors.clinic_type && (
                <p className="text-sm text-red-600">{errors.clinic_type.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                type="text"
                placeholder="123 Main St"
                {...register('address')}
                disabled={isLoading}
              />
              {errors.address && (
                <p className="text-sm text-red-600">{errors.address.message}</p>
              )}
            </div>

            <div className="flex space-x-2">
              <div className="flex-1">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  type="text"
                  placeholder="City"
                  {...register('city')}
                  disabled={isLoading}
                />
                {errors.city && (
                  <p className="text-sm text-red-600">{errors.city.message}</p>
                )}
              </div>
              <div className="flex-1">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  type="text"
                  placeholder="State"
                  {...register('state')}
                  disabled={isLoading}
                />
                {errors.state && (
                  <p className="text-sm text-red-600">{errors.state.message}</p>
                )}
              </div>
            </div>

            <div className="flex space-x-2">
              <div className="flex-1">
                <Label htmlFor="zip">ZIP/Postal Code</Label>
                <Input
                  id="zip"
                  type="text"
                  placeholder="ZIP"
                  {...register('zip')}
                  disabled={isLoading}
                />
                {errors.zip && (
                  <p className="text-sm text-red-600">{errors.zip.message}</p>
                )}
              </div>
              <div className="flex-1">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  type="text"
                  placeholder="Country"
                  {...register('country')}
                  disabled={isLoading}
                />
                {errors.country && (
                  <p className="text-sm text-red-600">{errors.country.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact_phone">Clinic Phone</Label>
              <Input
                id="contact_phone"
                type="text"
                placeholder="Clinic Phone"
                {...register('contact_phone')}
                disabled={isLoading}
              />
              {errors.contact_phone && (
                <p className="text-sm text-red-600">{errors.contact_phone.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="primary_contact_name">Primary Contact Name</Label>
              <Input
                id="primary_contact_name"
                type="text"
                placeholder="Contact Name"
                {...register('primary_contact_name')}
                disabled={isLoading}
              />
              {errors.primary_contact_name && (
                <p className="text-sm text-red-600">{errors.primary_contact_name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="primary_contact_email">Primary Contact Email</Label>
              <Input
                id="primary_contact_email"
                type="email"
                placeholder="Contact Email"
                {...register('primary_contact_email')}
                disabled={isLoading}
              />
              {errors.primary_contact_email && (
                <p className="text-sm text-red-600">{errors.primary_contact_email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="primary_contact_phone">Primary Contact Phone</Label>
              <Input
                id="primary_contact_phone"
                type="text"
                placeholder="Contact Phone"
                {...register('primary_contact_phone')}
                disabled={isLoading}
              />
              {errors.primary_contact_phone && (
                <p className="text-sm text-red-600">{errors.primary_contact_phone.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="license_number">License Number</Label>
              <Input
                id="license_number"
                type="text"
                placeholder="License Number"
                {...register('license_number')}
                disabled={isLoading}
              />
              {errors.license_number && (
                <p className="text-sm text-red-600">{errors.license_number.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="license_authority">License Authority</Label>
              <Input
                id="license_authority"
                type="text"
                placeholder="Issuing Authority"
                {...register('license_authority')}
                disabled={isLoading}
              />
              {errors.license_authority && (
                <p className="text-sm text-red-600">{errors.license_authority.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="license_expiration">License Expiration</Label>
              <Input
                id="license_expiration"
                type="date"
                {...register('license_expiration')}
                disabled={isLoading}
              />
              {errors.license_expiration && (
                <p className="text-sm text-red-600">{errors.license_expiration.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="compliance_officer_name">Compliance Officer Name (optional)</Label>
              <Input
                id="compliance_officer_name"
                type="text"
                placeholder="Compliance Officer Name"
                {...register('compliance_officer_name')}
                disabled={isLoading}
              />
              {errors.compliance_officer_name && (
                <p className="text-sm text-red-600">{errors.compliance_officer_name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="compliance_officer_email">Compliance Officer Email (optional)</Label>
              <Input
                id="compliance_officer_email"
                type="email"
                placeholder="Compliance Officer Email"
                {...register('compliance_officer_email')}
                disabled={isLoading}
              />
              {errors.compliance_officer_email && (
                <p className="text-sm text-red-600">{errors.compliance_officer_email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="compliance_officer_phone">Compliance Officer Phone (optional)</Label>
              <Input
                id="compliance_officer_phone"
                type="text"
                placeholder="Compliance Officer Phone"
                {...register('compliance_officer_phone')}
                disabled={isLoading}
              />
              {errors.compliance_officer_phone && (
                <p className="text-sm text-red-600">{errors.compliance_officer_phone.message}</p>
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
