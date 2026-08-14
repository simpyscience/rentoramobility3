import { ResetPasswordForm } from '@/components/auth/reset-password-form';

export const metadata = {
  title: 'Reset Password',
  description: 'Set a new password for your Rentora account.',
};

export default function ResetPasswordPage() {
  return <ResetPasswordForm />;
}
