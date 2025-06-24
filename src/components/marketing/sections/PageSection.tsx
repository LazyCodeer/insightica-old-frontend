import { cn } from '@/lib/utils';
import type { HTMLAttributes } from 'react';

interface PageSectionProps extends HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  as?: keyof JSX.IntrinsicElements;
}

const PageSection = ({ children, className, containerClassName, as: Component = 'section', ...props }: PageSectionProps) => {
  return (
    <Component className={cn('py-16 md:py-24', className)} {...props}>
      <div className={cn('container mx-auto px-5 md:px-10', containerClassName)}>
        {children}
      </div>
    </Component>
  );
};

export default PageSection;
