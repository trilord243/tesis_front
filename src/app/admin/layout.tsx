import { Navbar } from "@/components/layout/navbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isAuthenticated={true} isAdmin={true} showAuthButtons={false} />
      <main className="flex-1">{children}</main>
    </div>
  );
}
