import { ForgotPasswordForm } from '@/components/auth/forgot-password-form';

export const metadata = {
  title: 'Forgot Password',
  description: 'Recover your Rentora account password.',
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
