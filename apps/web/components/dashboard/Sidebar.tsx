'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigationItems = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Accounts', href: '/accounts' },
  { name: 'Headers', href: '/headers' },
  { name: 'Tags', href: '/tags' },
  { name: 'Source/Destination', href: '/source-destination' },
  { name: 'Budget', href: '/budget' },
  { name: 'Transaction', href: '/transactions' },
  { name: 'Report', href: '/reports' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col fixed left-0 top-12 bottom-0 bg-gray-700">
      <div className="flex h-16 items-center px-6">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-xl font-semibold text-white"
        >
          <span>Cashbook</span>
        </Link>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                isActive
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
