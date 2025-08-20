'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AuthForm } from '@/components/auth/AuthForm';
import { createUser } from '@/lib/auth';
import { toast } from 'sonner';

export default function SignUpPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      await createUser(data.email, data.password);
      toast.success('Account created successfully!');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-2xl font-bold">
              Create Your Account on{' '}
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Roomify
              </span>
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Start your interior design journey today
            </p>
          </CardHeader>

          <CardContent>
            <AuthForm
              onSubmit={handleSubmit}
              isLoading={isLoading}
              submitText="Create Account"
            />
            <div className="mt-4 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                href="/auth/signin"
                className="text-purple-600 hover:text-purple-800 hover:underline"
              >
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 grid grid-cols-3 gap-4 text-center text-sm text-gray-500">
          <div>
            <div className="text-purple-600 font-semibold">🎨 Unlimited</div>
            <p>Free designs</p>
          </div>
          <div>
            <div className="text-blue-600 font-semibold">☁️ Cloud</div>
            <p>Auto-save</p>
          </div>
          <div>
            <div className="text-green-600 font-semibold">📱 Mobile</div>
            <p>Access anywhere</p>
          </div>
        </div>
      </div>
    </div>
  );
}
