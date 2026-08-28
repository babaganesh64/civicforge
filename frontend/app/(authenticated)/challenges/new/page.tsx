'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useSubmitChallenge } from '@/hooks/useChallenges';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { SubmitChallengeRequest } from '@/types/challenge';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 
  'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Chandigarh', 'Puducherry'
];

const CATEGORIES = ['Infrastructure', 'Health', 'Education', 'Environment', 'Safety', 'Agriculture', 'Transportation', 'Other'];

const schema = z.object({
  title: z.string().min(5, 'Title is too short').max(500, 'Title is too long'),
  description: z.string().min(50, 'Please provide more detail (minimum 50 characters)'),
  category: z.string().min(1, 'Category is required'),
  subCategory: z.string().optional(),
  urgency: z.string().optional(),
  locationDescription: z.string().optional(),
  stateProvince: z.string().min(1, 'State is required'),
  city: z.string().min(1, 'City is required'),
  pincode: z.string().regex(/^\d{6}$/, 'Must be a valid 6-digit pincode'),
  affectedPopulationEstimate: z.number().optional().or(z.nan()),
  affectedPopulationNotes: z.string().optional(),
  expectedOutcome: z.string().optional(),
  consent1: z.boolean().refine(val => val, 'You must confirm this is genuine'),
  consent2: z.boolean().refine(val => val, 'You must understand the review process')
});

type FormValues = z.infer<typeof schema>;

export default function NewChallengePage() {
  const router = useRouter();
  const submitMutation = useSubmitChallenge();
  
  const { register, handleSubmit, formState: { errors, isValid }, setValue, watch } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      consent1: false,
      consent2: false
    }
  });

  const onSubmit = async (data: FormValues) => {
    try {
      const payload: SubmitChallengeRequest = {
        title: data.title,
        description: data.description,
        category: data.category,
        subCategory: data.subCategory,
        urgency: data.urgency,
        locationDescription: data.locationDescription,
        stateProvince: data.stateProvince,
        city: data.city,
        pincode: data.pincode,
        affectedPopulationEstimate: isNaN(data.affectedPopulationEstimate as number) ? undefined : data.affectedPopulationEstimate,
        affectedPopulationNotes: data.affectedPopulationNotes,
        expectedOutcome: data.expectedOutcome,
        consentGiven: data.consent1 && data.consent2,
      };

      const response = await submitMutation.mutateAsync(payload);
      toast.success('Challenge submitted successfully!');
      router.push(`/challenges/${response.id}`);
    } catch (error) {
      toast.error('Failed to submit challenge. Please check your inputs.');
    }
  };

  const titleLength = watch('title')?.length || 0;

  return (
    <div className="container max-w-5xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Submit a New Challenge</h1>
        <p className="text-muted-foreground">Report a civic issue for government review and resolution.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Problem Details */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold border-b pb-2">Problem Details</h2>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="title">Title *</Label>
                  <span className="text-xs text-muted-foreground">{titleLength}/500</span>
                </div>
                <Input id="title" {...register('title')} placeholder="Brief summary of the issue" />
                {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea 
                  id="description" 
                  {...register('description')} 
                  placeholder="Provide detailed information about the challenge..."
                  className="min-h-[150px]"
                />
                {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
                <p className="text-xs text-muted-foreground">Minimum 50 characters.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category *</Label>
                  <Select onValueChange={(val) => setValue('category', val, { shouldValidate: true })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {errors.category && <p className="text-sm text-destructive">{errors.category.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subCategory">Sub-category (Optional)</Label>
                  <Input id="subCategory" {...register('subCategory')} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Urgency</Label>
                <Select onValueChange={(val) => setValue('urgency', val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select urgency level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Low - Can be addressed over time</SelectItem>
                    <SelectItem value="MEDIUM">Medium - Needs attention soon</SelectItem>
                    <SelectItem value="HIGH">High - Causes significant disruption</SelectItem>
                    <SelectItem value="EMERGENCY">Emergency - Immediate danger or severe impact</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </section>

            {/* Location */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold border-b pb-2">Location</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>State/Province *</Label>
                  <Select onValueChange={(val) => setValue('stateProvince', val, { shouldValidate: true })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {INDIAN_STATES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {errors.stateProvince && <p className="text-sm text-destructive">{errors.stateProvince.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City/District *</Label>
                  <Input id="city" {...register('city')} />
                  {errors.city && <p className="text-sm text-destructive">{errors.city.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pincode">Pincode *</Label>
                <Input id="pincode" {...register('pincode')} maxLength={6} />
                {errors.pincode && <p className="text-sm text-destructive">{errors.pincode.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="locationDescription">Specific Location Details</Label>
                <Textarea 
                  id="locationDescription" 
                  {...register('locationDescription')} 
                  placeholder="Landmarks, street names, etc."
                />
              </div>
            </section>

            {/* Impact */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold border-b pb-2">Impact</h2>
              
              <div className="space-y-2">
                <Label htmlFor="affectedPopulationEstimate">Estimated Affected Population</Label>
                <Input 
                  id="affectedPopulationEstimate" 
                  type="number" 
                  {...register('affectedPopulationEstimate', { valueAsNumber: true })} 
                  placeholder="E.g., 500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="affectedPopulationNotes">Additional Context on Impact</Label>
                <Textarea id="affectedPopulationNotes" {...register('affectedPopulationNotes')} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expectedOutcome">Expected Outcome</Label>
                <Textarea 
                  id="expectedOutcome" 
                  {...register('expectedOutcome')} 
                  placeholder="What would a successful solution look like?"
                />
              </div>
            </section>

            {/* Consent */}
            <section className="space-y-4 pt-4 border-t">
              <div className="flex items-start space-x-2">
                <Checkbox 
                  id="consent1" 
                  checked={watch('consent1')} 
                  onCheckedChange={(c) => setValue('consent1', !!c, { shouldValidate: true })} 
                />
                <div className="grid gap-1.5 leading-none">
                  <label htmlFor="consent1" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    I confirm this is a genuine community challenge and the information provided is accurate to the best of my knowledge.
                  </label>
                  {errors.consent1 && <p className="text-xs text-destructive">{errors.consent1.message}</p>}
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <Checkbox 
                  id="consent2" 
                  checked={watch('consent2')} 
                  onCheckedChange={(c) => setValue('consent2', !!c, { shouldValidate: true })} 
                />
                <div className="grid gap-1.5 leading-none">
                  <label htmlFor="consent2" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    I understand that submitted challenges are reviewed by government authorities.
                  </label>
                  {errors.consent2 && <p className="text-xs text-destructive">{errors.consent2.message}</p>}
                </div>
              </div>
            </section>

            <div className="flex justify-end space-x-4 pt-6">
              <Button type="button" variant="outline" onClick={() => router.back()} disabled={submitMutation.isPending}>
                Cancel
              </Button>
              <Button type="submit" disabled={!isValid || submitMutation.isPending}>
                {submitMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit Challenge
              </Button>
            </div>
          </form>
        </div>

        <div className="md:col-span-1">
          <Card className="sticky top-6">
            <CardContent className="pt-6 space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">Tips for a good submission</h3>
                <ul className="text-sm space-y-2 text-muted-foreground list-disc pl-4">
                  <li>Be specific about the location.</li>
                  <li>Describe the real-world impact clearly.</li>
                  <li>Stick to facts rather than opinions.</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Evidence</h3>
                <p className="text-sm text-muted-foreground">
                  You can attach photos, PDFs, or documents as evidence on the next screen after submitting the text details.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
