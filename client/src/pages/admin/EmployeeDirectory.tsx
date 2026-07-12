import { FormEvent, useEffect, useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { useAuth } from '../../hooks/useAuth';
import { ROLE_LABELS, ROLE_BADGE_COLORS } from '../../utils/roles';
import { Employee } from '../../types/employee.types';
import { Role } from '../../types/auth.types';
import { Department } from '../../types/department.types';
import {
  listEmployeesRequest,
  updateEmployeeStatusRequest,
  updateEmployeeDepartmentRequest,
  updateEmployeeRoleRequest,
} from '../../services/adminUserService';
import { listDepartmentsRequest } from '../../services/departmentService';

const ROLES: Role[] = ['EMPLOYEE', 'DEPARTMENT_HEAD', 'ASSET_MANAGER', 'ADMIN'];

export default function EmployeeDirectory() {
  const { user: currentUser } = useAuth();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');

  const [promoteTarget, setPromoteTarget] = useState<Employee | null>(null);
  const [promoteRole, setPromoteRole] = useState<Role>('EMPLOYEE');
  const [promoteError, setPromoteError] = useState<string | null>(null);
  const [promoting, setPromoting] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [emps, depts] = await Promise.all([
        listEmployeesRequest({
          search: search || undefined,
          role: (roleFilter as Role) || undefined,
          status: (statusFilter as 'ACTIVE' | 'INACTIVE') || undefined,
          departmentId: departmentFilter || undefined,
        }),
        listDepartmentsRequest(),
      ]);
      setEmployees(emps);
      setDepartments(depts);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterSubmit = (e: FormEvent) => {
    e.preventDefault();
    load();
  };

  const toggleStatus = async (emp: Employee) => {
    try {
      await updateEmployeeStatusRequest(emp.id, emp.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE');
      await load();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to update status');
    }
  };

  const changeDepartment = async (emp: Employee, departmentId: string) => {
    try {
      await updateEmployeeDepartmentRequest(emp.id, departmentId || null);
      await load();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to update department');
    }
  };

  const openPromote = (emp: Employee) => {
    setPromoteTarget(emp);
    setPromoteRole(emp.role);
    setPromoteError(null);
  };

  const handlePromote = async (e: FormEvent) => {
    e.preventDefault();
    if (!promoteTarget) return;
    setPromoteError(null);
    setPromoting(true);
    try {
      await updateEmployeeRoleRequest(promoteTarget.id, promoteRole);
      setPromoteTarget(null);
      await load();
    } catch (err: any) {
      setPromoteError(err?.response?.data?.message || 'Failed to update role');
    } finally {
      setPromoting(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold">Employee Directory</h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Search employees, manage department assignments, and promote roles.
      </p>

      <form onSubmit={handleFilterSubmit} className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-4">
        <Input
          placeholder="Search name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
          <option value="">All roles</option>
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {ROLE_LABELS[r]}
            </option>
          ))}
        </Select>
        <Select value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value)}>
          <option value="">All departments</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </Select>
        <div className="flex gap-2">
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </Select>
          <Button type="submit" variant="secondary" className="shrink-0">
            Filter
          </Button>
        </div>
      </form>

      {error && <p className="mt-4 text-sm text-red-600 dark:text-red-400">{error}</p>}

      <Card className="mt-6 overflow-x-auto p-0">
        {loading ? (
          <p className="p-6 text-sm text-slate-500 dark:text-slate-400">Loading…</p>
        ) : employees.length === 0 ? (
          <p className="p-6 text-sm text-slate-500 dark:text-slate-400">
            No employees match those filters.
          </p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-xs uppercase text-slate-500 dark:border-slate-800 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Department</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => {
                const isSelf = emp.id === currentUser?.id;
                return (
                  <tr
                    key={emp.id}
                    className="border-b border-slate-100 last:border-0 dark:border-slate-800/60"
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium">
                        {emp.name} {isSelf && <span className="text-xs text-slate-400">(you)</span>}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{emp.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          'inline-block rounded-full px-2 py-0.5 text-xs font-medium ' +
                          ROLE_BADGE_COLORS[emp.role]
                        }
                      >
                        {ROLE_LABELS[emp.role]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Select
                        value={emp.departmentId ?? ''}
                        onChange={(e) => changeDepartment(emp, e.target.value)}
                        className="min-w-[10rem] py-1"
                      >
                        <option value="">Unassigned</option>
                        {departments.map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.name}
                          </option>
                        ))}
                      </Select>
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone={emp.status === 'ACTIVE' ? 'success' : 'neutral'}>
                        {emp.status === 'ACTIVE' ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => openPromote(emp)}
                          disabled={isSelf}
                          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-primary hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <ShieldCheck size={14} /> Change role
                        </button>
                        <button
                          onClick={() => toggleStatus(emp)}
                          disabled={isSelf}
                          className="rounded-md px-2 py-1 text-xs font-medium text-slate-500 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:text-slate-400 dark:hover:bg-slate-800"
                        >
                          {emp.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </Card>

      <Modal
        open={!!promoteTarget}
        onClose={() => setPromoteTarget(null)}
        title={promoteTarget ? `Change role — ${promoteTarget.name}` : 'Change role'}
      >
        <form onSubmit={handlePromote} className="flex flex-col gap-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Current role:{' '}
            <span className="font-medium">
              {promoteTarget ? ROLE_LABELS[promoteTarget.role] : ''}
            </span>
          </p>

          <Select
            label="New role"
            value={promoteRole}
            onChange={(e) => setPromoteRole(e.target.value as Role)}
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {ROLE_LABELS[r]}
              </option>
            ))}
          </Select>

          {promoteError && <p className="text-sm text-red-600 dark:text-red-400">{promoteError}</p>}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setPromoteTarget(null)}>
              Cancel
            </Button>
            <Button type="submit" disabled={promoting || promoteRole === promoteTarget?.role}>
              {promoting ? 'Saving…' : 'Confirm role change'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
