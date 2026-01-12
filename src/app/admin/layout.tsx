import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Admin - Lovosis",
    description: "Lovosis Admin Dashboard",
};

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50">
            {children}
        </div>
    );
}
