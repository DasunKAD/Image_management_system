import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button, Input, Card } from '../components/ui';
import { Shield, Mail, Lock, AlertCircle } from '../components/icons/Icons';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Please enter both email and password');
      setLoading(false);
      return;
    }

    const result = await login(email, password);
    if (!result.success) {
      setError(result.error || 'Login failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary-50 via-primary-100 to-primary-50">
      {/* Header Pattern */}
      <div className="absolute top-0 left-0 right-0 h-72 bg-gradient-to-br from-primary-600 to-primary-700 rounded-b-[50%] opacity-90" />

      <div className="flex-1 flex items-center justify-center p-5 relative z-10">
        <div className="w-full max-w-md animate-fade-in">
          {/* Logo Area */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg text-primary-600">
              <Shield size={32} />
            </div>
            <h1 className="font-display text-3xl font-bold text-white mb-2">
              MediCare
            </h1>
            <p className="text-primary-100">Patient Portal</p>
          </div>

          {/* Login Card */}
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-neutral-800 mb-2 text-center">
              Welcome Back
            </h2>
            <p className="text-neutral-500 text-sm mb-7 text-center">
              Sign in to access your health records
            </p>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl mb-5 flex items-center gap-2.5 text-red-600 text-sm">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="patient@example.com"
                icon={Mail}
              />

              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                icon={Lock}
              />

              <Button type="submit" fullWidth loading={loading} size="lg">
                Sign In
              </Button>
            </form>

            <p className="mt-6 text-center text-neutral-500 text-sm">
              Contact your healthcare provider if you need access
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;