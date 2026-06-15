'use client';
import { GarageProvider } from '@/context/GarageContext';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';

export default function ClientShell({ children }: { children: React.ReactNode }) {
  return (
    <GarageProvider>
      <Sidebar />
      <TopBar />
      <main className="ml-56 mt-16 p-6 min-h-[calc(100vh-4rem)]">
        {children}
      </main>
    </GarageProvider>
  );
}
