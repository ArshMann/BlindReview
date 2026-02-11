export type SubmissionStatus = 'pending' | 'in-review' | 'completed';
export type AssignmentStatus = 'pending' | 'in-progress' | 'submitted';
export type ReviewCycleStatus = 'draft' | 'open' | 'closed' | 'completed';

export interface SubmissionForm {
  title: string;
  subject: string;
  deadline: string;
  description: string;
  file: File | null;
}

export interface Submission {
  id: string;
  title: string;
  subject: string;
  submittedDate: string;
  deadline: string;
  reviewCount: number;
  status: SubmissionStatus;
  averageScore?: number;
}

export interface ReviewAssignment {
  id: string;
  submissionId: string;
  title: string;
  subject: string;
  assignedDate: string;
  deadline: string;
  status: AssignmentStatus;
}



export const statusStyles = {
  submission: {
    pending: { bg: '#fff3cd', text: '#856404' },
    'in-review': { bg: '#cce5ff', text: '#004085' },
    completed: { bg: '#d4edda', text: '#155724' },
  },
  assignment: {
    pending: { bg: '#fff3cd', text: '#856404' },
    'in-progress': { bg: '#cce5ff', text: '#004085' },
    submitted: { bg: '#d4edda', text: '#155724' },
  },
  reviewCycle: {
    draft: { bg: '#e2e3e5', text: '#383d41' },
    open: { bg: '#d1ecf1', text: '#0c5460' },
    closed: { bg: '#f8d7da', text: '#721c24' },
    completed: { bg: '#d4edda', text: '#155724' },
  },
};
