import { JSX, ReactNode } from 'react';

export type HeadingProps = {
  children: ReactNode;
  rank?: '1' | '2' | '3' | '4' | '5' | '6';
  size?: 'xxxl' | 'xxl' | 'xl' | 'l' | 'm' | 's' | 'xs';
};

const variants = {
  xs: 'mt-0 text-base font-bold leading-tight',
  s: 'mt-0 text-xl font-bold leading-tight',
  m: 'mt-0 text-2xl font-bold leading-tight',
  l: 'mt-0 text-3xl font-bold leading-tight',
  xl: 'mt-0 text-4xl font-bold leading-tight',
  xxl: 'mt-0 text-5xl font-bold leading-tight',
  xxxl: 'mt-0 text-6xl font-bold leading-tight',
};

export const Heading = ({ children, rank, size = 'm' }: HeadingProps) => {
  const Tag = (rank ? `h${rank}` : 'span') as keyof JSX.IntrinsicElements;

  return <Tag className={variants[size]}>{children}</Tag>;
};
