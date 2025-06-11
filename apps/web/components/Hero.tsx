'use client';

import { Button } from './ui/Button';
import Link from 'next/link';
import Image from 'next/image';

export const Hero = () => {
  return (
    <div className="relative isolate bg-white">
      <div className="mx-auto max-w-7xl px-6 pt-10 pb-24 sm:pb-32 lg:flex lg:px-8 lg:py-40">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl lg:flex-shrink-0 lg:pt-8">
          <div className="mt-24 sm:mt-32 lg:mt-16">
            <Link href="/" className="inline-flex space-x-6">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold leading-6 text-primary ring-1 ring-inset ring-primary/10">
                What&apos;s new
              </span>
              <span className="inline-flex items-center space-x-2 text-sm font-medium leading-6 text-gray-600">
                <span>Just shipped v1.0</span>
                <span aria-hidden="true">&rarr;</span>
              </span>
            </Link>
          </div>
          <h1 className="mt-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Take Control of Your Finances with Cashbook
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Track expenses, manage budgets, and achieve your financial goals with ease. Our intuitive platform helps you make smarter financial decisions.
          </p>
          <div className="mt-10 flex items-center gap-x-6">
            <Link href="/register">
              <Button >
                Get started
              </Button>
            </Link>
            <Link href="/login" className="text-sm font-semibold leading-6 text-gray-900">
              Already have an account? <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
        <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mt-0 lg:mr-0 lg:max-w-none lg:flex-none xl:ml-32">
          <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
            <Image
              src="/dashboard-preview.png"
              alt="App screenshot"
              width={2432}
              height={1442}
              className="w-[76rem] rounded-md bg-white/5 shadow-2xl ring-1 ring-white/10"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
