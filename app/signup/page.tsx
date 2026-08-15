import { SignupForm } from '@/components/auth/signup-form';

export const metadata = {
  title: 'Sign Up',
  description: 'Create a Rentora account.',
  robots: { index: false, follow: false },
};

export default function SignupPage() {
  return <SignupForm />;
}
