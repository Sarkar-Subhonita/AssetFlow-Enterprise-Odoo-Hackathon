import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPasswordRequest } from '../../services/authService';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  // Dev-only: Phase 1 has no email service, so the token is shown here
  // directly for testing. Remove once real emails are wired up.
  const [devLink, setDevLink] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);
    setDevLink(null);
    try {
      const res = await forgotPasswordRequest(email);
      setMessage(res.message);
      if (res.devResetToken) {
        setDevLink(`/reset-password/${res.devResetToken}`);
      }
    } catch {
      setMessage('Something went wrong. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
      <Card className="w-full max-w-sm">
        <h1 className="mb-1 text-2xl font-semibold">Forgot password</h1>
        <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
          Enter your email and we'll send you a reset link.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            id="email"
            type="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? 'Sending…' : 'Send reset link'}
          </Button>
        </form>

        {message && (
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">{message}</p>
        )}
        {devLink && (
          <p className="mt-2 text-sm">
            Dev mode — no email service yet:{' '}
            <Link to={devLink} className="text-primary hover:underline">
              open reset link
            </Link>
          </p>
        )}

        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          <Link to="/login" className="text-primary hover:underline">
            Back to login
          </Link>
        </p>
      </Card>
    </div>
  );
}
