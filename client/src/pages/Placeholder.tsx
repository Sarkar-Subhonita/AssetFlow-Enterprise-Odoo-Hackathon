import { Card } from '../components/ui/Card';

interface PlaceholderProps {
  title: string;
}

// Reused for every not-yet-built feature page (Assets, Allocation,
// Booking, Maintenance, Audit, Reports, Notifications, Organization
// Setup) so navigation is fully wired without building features early.
export default function Placeholder({ title }: PlaceholderProps) {
  return (
    <div>
      <h1 className="text-2xl font-semibold">{title}</h1>
      <Card className="mt-6">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          This page will be built in a later phase.
        </p>
      </Card>
    </div>
  );
}
