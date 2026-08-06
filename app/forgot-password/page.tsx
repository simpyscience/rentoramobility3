import { ForgotPasswordForm } from '@/components/auth/forgot-password-form';

export const metadata = {
  title: 'Forgot Password',
  description: 'Recover your Rentora account password.',
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
