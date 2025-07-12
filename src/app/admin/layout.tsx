import AdminNav from '../_components/AdminNav';
// TODO: add middleware

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-white shadow border-r">
        <AdminNav />
      </aside>
      <main className="flex-1 p-8 bg-gray-50">{children}</main>
    </div>
  );
}
