'use client';

import type { FC } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Submission } from '@/types/submissions';

interface SubmissionDetailsModalProps {
  submission: Submission;
  onClose: () => void;
}

export const SubmissionDetailsModal: FC<SubmissionDetailsModalProps> = ({
  submission,
  onClose,
}) => {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Submission Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <div>
            <b>Email:</b> {submission.email}
          </div>
          <div>
            <b>Date:</b> {new Date(submission.submittedAt).toLocaleString()}
          </div>
          <pre className="bg-muted rounded p-2 whitespace-pre-wrap text-xs max-h-[50dvh] overflow-auto">
            {JSON.stringify(submission.data, null, 2)}
          </pre>
        </div>
        <Button className="mt-4" variant="outline" onClick={onClose}>
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
};
