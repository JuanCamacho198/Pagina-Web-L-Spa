import React from 'react';

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'lead' | 'small';
  as?: React.ElementType;
}

export const Typography: React.FC<TypographyProps> = ({
  variant = 'p',
  as: Component,
  children,
  className = '',
  ...props
}) => {
  const variants = {
    h1: 'text-4xl font-extrabold tracking-tight lg:text-5xl text-gray-900',
    h2: 'text-3xl font-semibold tracking-tight first:mt-0 text-gray-800',
    h3: 'text-2xl font-semibold tracking-tight text-gray-800',
    h4: 'text-xl font-semibold tracking-tight text-gray-800',
    p: 'leading-7 [&:not(:first-child)]:mt-6 text-gray-700',
    lead: 'text-xl text-gray-600',
    small: 'text-sm font-medium leading-none text-gray-500',
  };

  const Tag = Component || (['h1', 'h2', 'h3', 'h4'].includes(variant) ? variant : 'p') as any;

  return (
    <Tag className={`${variants[variant]} ${className}`} {...props}>
      {children}
    </Tag>
  );
};
