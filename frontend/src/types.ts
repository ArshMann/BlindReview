export type SubmissionStatus = 'pending' | 'in-review' | 'completed';
export type AssignmentStatus = 'pending' | 'in-progress' | 'submitted';
export type ReviewCycleStatus = 'draft' | 'open' | 'closed' | 'completed';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Student' | 'Reviewer' | 'Instructor';
  credits: number;
  createdAt: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

export interface SubmissionForm {
  title: string;
  subject: string;
  deadline: string;
  description: string;
  file: File | null;
}

export interface Reviewable {
  id: string;
  name: string;
  blobUrl: string;
  type: string;
  userId: string;
  createdAt: string;
  cost: number;
}

export interface ListReviewablesResponse {
  items: Reviewable[];
  continuationToken: string | null;
  hasMore: boolean;
}

export interface ReviewAssignment {
  id: string;
  submissionId: string;
  title: string;
  subject: string;
  assignedDate: string;
  deadline: string | null;
  status: AssignmentStatus;
}

export interface ListMyAssignmentsResponse {
  items: ReviewAssignment[];
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
