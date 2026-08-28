'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/lib/auth-hooks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';

const profileSchema = z.object({
  displayName: z.string().min(2, 'Name must be at least 2 characters'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: user?.displayName || '',
    },
  });

  if (!user) return null;

  const onSubmit = async (data: ProfileFormValues) => {
    setIsLoading(true);
    try {
      await apiClient.patch('/api/v1/users/me/profile', data);
      await refreshUser();
      toast.success('Profile updated successfully');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
        <p className="text-gray-500">Manage your account settings and preferences.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your personal details.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  {...register('displayName')}
                  className={errors.displayName ? 'border-red-500' : ''}
                />
                {errors.displayName && <p className="text-sm text-red-500">{errors.displayName.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={user.email} disabled />
                <p className="text-xs text-gray-500">Contact support to change your email address.</p>
              </div>

              <div className="pt-4">
                <Button type="submit" disabled={!isDirty || isLoading}>
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between py-2 border-b">
                <span className="text-sm font-medium text-gray-500">Account Type</span>
                <span className="text-sm">{user.userType.replace(/_/g, ' ')}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-sm font-medium text-gray-500">Status</span>
                <Badge variant={user.status === 'ACTIVE' ? 'default' : 'secondary'}>
                  {user.status}
                </Badge>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-sm font-medium text-gray-500">Email Verified</span>
                <Badge variant={user.emailVerified ? 'default' : 'secondary'} className={user.emailVerified ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''}>
                  {user.emailVerified ? 'Yes' : 'No'}
                </Badge>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-sm font-medium text-gray-500">Identity Verified</span>
                <Badge variant={user.identityVerified ? 'default' : 'secondary'} className={user.identityVerified ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''}>
                  {user.identityVerified ? 'Yes' : 'No'}
                </Badge>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-sm font-medium text-gray-500">Member Since</span>
                <span className="text-sm">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
