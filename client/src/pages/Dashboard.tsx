import { useAuth } from '../hooks/useAuth';
import { Card } from '../components/ui/Card';
import { ROLE_LABELS } from '../utils/roles';

// KPI cards, overdue returns, quick actions, and activity feed are
// built in the Dashboard feature phase. This is just the landing page
// so the layout/routing/role architecture has somewhere to land.
export default function Dashboard() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div>
      <h1 className="text-2xl font-semibold">Welcome, {user.name}</h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        You're logged in as <span className="font-medium">{ROLE_LABELS[user.role]}</span>.
      </p>

      <Card className="mt-6">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          KPI cards and quick actions land here in the Dashboard feature phase.
        </p>
      </Card>
    </div>
  );
}
