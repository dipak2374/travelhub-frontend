import { Outlet } from 'react-router-dom';
import DashboardSidebar from './DashboardSidebar';
import DashboardHeader from './DashboardHeader';

const DashboardLayout = () => {
  const isLocalhost = typeof window !== 'undefined' && ['localhost', '127.0.0.1'].includes(window.location.hostname);
  const remoteApiUrl = import.meta.env.VITE_API_URL && !import.meta.env.VITE_API_URL.includes('localhost');
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const invalidGoogleClientId = !googleClientId || /your_google(_client_id)?|your_google_client_id_here|your_google_client_id/i.test(googleClientId);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <DashboardHeader />
        {isLocalhost && invalidGoogleClientId && (
          <div className="bg-red-100 border border-red-300 text-red-900 px-4 py-3 text-sm text-center">
            Google Sign-In is not configured for local development. Set <code>VITE_GOOGLE_CLIENT_ID</code> to your Google OAuth client ID in <code>client/.env</code> and make sure it is a real client ID, not a placeholder.
          </div>
        )}
        <main className="flex-1 overflow-y-auto p-6 relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
