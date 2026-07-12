import { useState } from 'react';
import { cn } from '../../utils/cn';
import DepartmentsPanel from './DepartmentsPanel';
import CategoriesPanel from './CategoriesPanel';

type Tab = 'departments' | 'categories';

const TABS: { key: Tab; label: string }[] = [
  { key: 'departments', label: 'Departments' },
  { key: 'categories', label: 'Categories' },
];

export default function OrganizationSetup() {
  const [tab, setTab] = useState<Tab>('departments');

  return (
    <div>
      <h1 className="text-2xl font-semibold">Organization Setup</h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Set up the departments and asset categories every other module depends on.
      </p>

      <div className="mt-6 border-b border-slate-200 dark:border-slate-800">
        <nav className="flex gap-6">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                'border-b-2 px-1 pb-3 text-sm font-medium transition-colors',
                tab === t.key
                  ? 'border-primary text-primary'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              )}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-6">
        {tab === 'departments' ? <DepartmentsPanel /> : <CategoriesPanel />}
      </div>
    </div>
  );
}
