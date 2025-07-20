import ChangePasswordForm from './_components/change-password/Form';

export const metadata = {
  title: 'My Profile',
  description: 'View and edit your user profile.',
  robots: 'noindex',
};

export default function ProfilePage() {
  return <ChangePasswordForm />;
}
