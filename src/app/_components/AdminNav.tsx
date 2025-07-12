'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const nav = [
  { href: '/admin', label: 'Мои формы' },
  { href: '/admin/results', label: 'Результаты' },
];

export default function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-2 p-4">
      {nav.map(item => (
        <Link
          key={item.href}
          href={item.href}
          className={`rounded px-2 py-1 font-medium ${
            pathname === item.href ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
