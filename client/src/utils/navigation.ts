import {
  LayoutDashboard,
  Settings,
  Boxes,
  ArrowLeftRight,
  CalendarClock,
  Wrench,
  ClipboardCheck,
  BarChart3,
  Bell,
} from 'lucide-react';
import { Role } from '../types/auth.types';

export interface NavItem {
  label: string;
  path: string;
  icon: typeof LayoutDashboard;
  roles: Role[]; // which roles see this item
}

const ALL_ROLES: Role[] = ['EMPLOYEE', 'DEPARTMENT_HEAD', 'ASSET_MANAGER', 'ADMIN'];

// Single source of truth for the sidebar. Every route referenced here
// exists as a page (currently a placeholder) so navigation is fully wired,
// even though the feature content behind each page is built in a later phase.
export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ALL_ROLES },
  { label: 'Organization Setup', path: '/organization-setup', icon: Settings, roles: ['ADMIN'] },
  { label: 'Assets', path: '/assets', icon: Boxes, roles: ALL_ROLES },
  {
    label: 'Allocation & Transfer',
    path: '/allocation',
    icon: ArrowLeftRight,
    roles: ALL_ROLES,
  },
  { label: 'Resource Booking', path: '/booking', icon: CalendarClock, roles: ALL_ROLES },
  { label: 'Maintenance', path: '/maintenance', icon: Wrench, roles: ALL_ROLES },
  {
    label: 'Audit',
    path: '/audit',
    icon: ClipboardCheck,
    roles: ['ADMIN', 'ASSET_MANAGER'],
  },
  { label: 'Reports', path: '/reports', icon: BarChart3, roles: ['ADMIN', 'ASSET_MANAGER'] },
  { label: 'Notifications', path: '/notifications', icon: Bell, roles: ALL_ROLES },
];
