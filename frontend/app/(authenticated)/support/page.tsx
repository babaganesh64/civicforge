'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { LifeBuoy, Mail, MessageSquare } from 'lucide-react';

export default function SupportPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate network request
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('Support ticket created! We will get back to you shortly.');
      (e.target as HTMLFormElement).reset();
    }, 1000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col space-y-2 pb-4 border-b border-slate-100 dark:border-slate-800">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-3">
          <LifeBuoy className="h-8 w-8 text-blue-600" /> Support Center
        </h1>
        <p className="text-slate-500 text-lg">
          Need help? Reach out to our team or browse our resources.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
              <CardDescription>Fill out the form below to open a support ticket.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" required placeholder="What do you need help with?" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <select id="category" className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:border-blue-500 focus-visible:ring-4 focus-visible:ring-blue-500/10 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-100">
                    <option>Technical Issue</option>
                    <option>Challenge Review Help</option>
                    <option>Account Management</option>
                    <option>Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" required placeholder="Describe your issue in detail..." className="min-h-[150px]" />
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                  {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-slate-50 dark:bg-slate-900 border-none shadow-none">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Mail className="h-5 w-5 text-blue-600" /> Direct Email
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Prefer email? Reach us directly at:</p>
              <a href="mailto:support@civicforge.gov" className="text-blue-600 font-medium hover:underline">
                support@civicforge.gov
              </a>
            </CardContent>
          </Card>

          <Card className="bg-slate-50 dark:bg-slate-900 border-none shadow-none">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-blue-600" /> Live Chat
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Chat with our agents during business hours.</p>
              <Button variant="outline" className="w-full">Start Chat</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
