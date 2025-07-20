export const metadata = {
  title: 'Dashboard',
  description: 'Your personal dashboard for managing smart forms and analyzing results.',
  robots: 'noindex',
};

export default function AdminHomePage() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Admin-panel</h2>
      <p className="text-gray-600">Manage your forms and analyze results</p>
    </div>
  );
}
