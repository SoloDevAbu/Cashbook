'use client';

import Link from 'next/link';
import { Button } from './ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { UserDialog } from './UserDialog';

export const Navbar = () => {
  const { user, isLoading } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold text-primary">
            Cashbook
          </Link>
          <div className="flex gap-4">
            {isLoading ? (
              <div className="w-8 h-8 animate-pulse bg-gray-200 rounded-full" />
            ) : user ? (
              <UserDialog />
            ) : (
              <>
                <Link href="/register">
                  <Button>Register</Button>
                </Link>
                <Link href="/login">
                  <Button>Login</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
