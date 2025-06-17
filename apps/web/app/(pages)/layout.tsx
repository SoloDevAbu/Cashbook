import { Sidebar } from '@/components/dashboard/Sidebar';
import { Providers } from '../providers';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <main className="pl-64">
        <div className="p-8">
          <Providers>{children}</Providers>
        </div>
      </main>
    </div>
  );
}
