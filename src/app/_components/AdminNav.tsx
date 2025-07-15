'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ROUTES } from '@/contants/routes';
import { Button } from '@/components/ui/button';

const NAV = [
  { href: ROUTES.ADMIN_FORMS, label: 'My forms' },
  { href: ROUTES.ADMIN_RESULTS, label: 'Results' },
  { href: ROUTES.ADMIN_PROFILE, label: 'My Profile' },
];

type Props = {
  onClose: () => void;
}

export default function AdminNav({ onClose }: Props) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-2 mt-4 mb-4 p-2" onClick={onClose}>
      {NAV.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`rounded px-2 py-1 font-medium ${
            pathname === item.href
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
