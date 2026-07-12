import { HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

export const Card = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900',
      className
    )}
    {...props}
  />
);
