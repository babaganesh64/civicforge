import { useState } from 'react';
import { useSubmitCollaboration } from '@/hooks/useCollaboration';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export function SubmitEoiDialog({ challengeId }: { challengeId: string }) {
  const [open, setOpen] = useState(false);
  const [proposalText, setProposalText] = useState('');
  const submitMutation = useSubmitCollaboration();

  const handleSubmit = async () => {
    if (!proposalText.trim()) return;
    try {
      await submitMutation.mutateAsync({ challengeId, proposalText });
      setOpen(false);
      setProposalText('');
    } catch (error) {
      console.error('Failed to submit EOI', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Express Interest</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Express Interest in Challenge</DialogTitle>
          <DialogDescription>
            Submit your proposal text. Explain how your organization can help solve this challenge.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Textarea
            value={proposalText}
            onChange={(e) => setProposalText(e.target.value)}
            placeholder="Describe your approach, relevant experience, and expected timeline..."
            className="min-h-[150px]"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={submitMutation.isPending}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={submitMutation.isPending || !proposalText.trim()}>
            {submitMutation.isPending ? 'Submitting...' : 'Submit Expression of Interest'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
