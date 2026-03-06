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
  const Tag = Component || (['h1', 'h2', 'h3', 'h4', 'p'].includes(variant) ? variant : 'p');

  const variants = {
    h1: 'text-4xl font-extrabold tracking-tight lg:text-5xl',
    h2: 'text-3xl font-semibold tracking-tight first:mt-0',
    h3: 'text-2xl font-semibold tracking-tight',
    h4: 'text-xl font-semibold tracking-tight',
    p: 'leading-7 [&:not(:first-child)]:mt-6',
    lead: 'text-xl text-gray-500',
    small: 'text-sm font-medium leading-none',
  };

  return (
    <Tag className={`${variants[variant]} ${className}`} {...props}>
      {children}
    </Tag>
  );
};
