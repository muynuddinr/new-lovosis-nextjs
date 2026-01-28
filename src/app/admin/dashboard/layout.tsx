import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { NotificationProvider } from '@/app/Components/Notification';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <NotificationProvider>
            <div className="flex h-screen overflow-hidden">
                <Sidebar />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <Header />
                    <main className="flex-1 p-6 overflow-y-auto">
                        {children}
                    </main>
                </div>
            </div>
        </NotificationProvider>
    );
}
