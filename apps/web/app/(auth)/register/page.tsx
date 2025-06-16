'use client';

import { Input } from '@/components/ui/input';
import { registerSchema } from '@cashbook/validation';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { RegistrationInput } from '@cashbook/validation';
import { SelectInput } from '@cashbook/ui';
import { currencies } from '@cashbook/utils';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';

export default function RegisterPage() {
  const { user, isLoading, register: registerUser } = useAuth();
  const router = useRouter();
  
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistrationInput>({
    resolver: zodResolver(registerSchema),
  });

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const onSubmit = async (data: RegistrationInput) => {
    registerUser.mutate({ data });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Create a new account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-medium text-primary hover:text-primary/90"
          >
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-4">
              <Input
                id="firstName"
                label="First name"
                type="text"
                autoComplete="given-name"
                disabled={isLoading}
                {...register('firstName')}
                error={errors.firstName?.message}
              />

              <Input
                id="lastName"
                label="Last name"
                type="text"
                autoComplete="family-name"
                disabled={isLoading}
                {...register('lastName')}
                error={errors.lastName?.message}
              />
            </div>

            <Input
              id="email"
              label="Email address"
              type="email"
              autoComplete="email"
              disabled={isLoading}
              {...register('email')}
              error={errors.email?.message}
            />

            <Input
              id="password"
              label="Password"
              type="password"
              autoComplete="new-password"
              disabled={isLoading}
              {...register('password')}
              error={errors.password?.message}
            />

            <Input
              id="phone"
              label="Phone number"
              type="tel"
              autoComplete="tel"
              disabled={isLoading}
              {...register('phone')}
              error={errors.phone?.message}
            />

            <Input
              id="altPhone"
              label="Alternative phone number"
              type="tel"
              autoComplete="tel"
              disabled={isLoading}
              {...register('altPhone')}
              error={errors.altPhone?.message}
            />

            <Input
              id="companyName"
              label="Company name"
              type="text"
              disabled={isLoading}
              {...register('companyName')}
              error={errors.companyName?.message}
            />

            <Input
              id="address"
              label="Address"
              type="text"
              autoComplete="street-address"
              disabled={isLoading}
              {...register('address')}
              error={errors.address?.message}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                id="state"
                label="State"
                type="text"
                disabled={isLoading}
                {...register('state')}
                error={errors.state?.message}
              />

              <Input
                id="pin"
                label="PIN"
                type="text"
                disabled={isLoading}
                {...register('pin')}
                error={errors.pin?.message}
              />
            </div>

            <Input
              id="country"
              label="Country"
              type="text"
              disabled={isLoading}
              {...register('country')}
              error={errors.country?.message}
            />

            <Controller
              name="defaultCurrency"
              control={control}
              render={({ field }) => (
                <SelectInput
                  label="Default Currency"
                  options={[...currencies]}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.defaultCurrency?.message}
                />
              )}
            />

            <Input
              id="pan"
              label="PAN"
              type="text"
              disabled={isLoading}
              {...register('pan')}
              error={errors.pan?.message}
            />

            <Input
              id="gst"
              label="GST"
              type="text"
              disabled={isLoading}
              {...register('gst')}
              error={errors.gst?.message}
            />

            <Input
              id="nationalId"
              label="National ID"
              type="text"
              disabled={isLoading}
              {...register('nationalId')}
              error={errors.nationalId?.message}
            />

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create account
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
