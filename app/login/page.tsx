import { LoginForm } from '@/components/auth/login-form';

export const metadata = {
  title: 'Login',
  description: 'Sign in to your Rentora account.',
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return <LoginForm />;
}
