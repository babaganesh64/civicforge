'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-hooks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ApiError } from '@/lib/api-client';

const registerSchema = z.object({
  displayName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  userType: z.string().min(1, 'Please select an account type'),
  agreeTerms: z.literal(true, {
    errorMap: () => ({ message: 'You must agree to the terms of service' }),
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      userType: 'CITIZEN',
    }
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      await registerUser({
        email: data.email,
        password: data.password,
        displayName: data.displayName,
        userType: data.userType,
      });
      setIsSuccess(true);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred during registration.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md shadow-lg border-0 bg-white text-center">
          <CardHeader>
            <CardTitle className="text-2xl text-green-600 mb-2">Registration Successful</CardTitle>
            <CardDescription>Your account has been created successfully.</CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center mt-4">
            <Button asChild className="w-full">
              <Link href="/login">Go to login</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md shadow-lg border-0 bg-white">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">CivicForge</h1>
          </div>
          <CardTitle className="text-2xl">Create your account</CardTitle>
          <CardDescription>Enter your details to register a new account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="displayName">Full Name</Label>
              <Input
                id="displayName"
                placeholder="John Doe"
                {...register('displayName')}
                className={errors.displayName ? 'border-red-500' : ''}
              />
              {errors.displayName && <p className="text-sm text-red-500">{errors.displayName.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m.example@domain.com"
                {...register('email')}
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="userType">Account Type</Label>
              <Select onValueChange={(val) => setValue('userType', val)} defaultValue="CITIZEN">
                <SelectTrigger className={errors.userType ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CITIZEN">Citizen</SelectItem>
                  <SelectItem value="UNIVERSITY_MEMBER">University Member</SelectItem>
                  <SelectItem value="UNIVERSITY_ADMIN">University Admin</SelectItem>
                  <SelectItem value="INDUSTRY_MEMBER">Industry Member</SelectItem>
                  <SelectItem value="INDUSTRY_ADMIN">Industry Admin</SelectItem>
                </SelectContent>
              </Select>
              {errors.userType && <p className="text-sm text-red-500">{errors.userType.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...register('password')}
                className={errors.password ? 'border-red-500' : ''}
              />
              {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                {...register('confirmPassword')}
                className={errors.confirmPassword ? 'border-red-500' : ''}
              />
              {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>}
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Checkbox 
                id="agreeTerms" 
                checked={watch('agreeTerms')}
                onCheckedChange={(val) => setValue('agreeTerms', val === true ? true : (false as any))}
              />
              <Label htmlFor="agreeTerms" className="text-sm font-normal">
                I agree to the terms of service and privacy policy
              </Label>
            </div>
            {errors.agreeTerms && <p className="text-sm text-red-500">{errors.agreeTerms.message}</p>}

            <Button type="submit" className="w-full mt-2" disabled={isLoading}>
              {isLoading ? 'Creating account...' : 'Register'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
