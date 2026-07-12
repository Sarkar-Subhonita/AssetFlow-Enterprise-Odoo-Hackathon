import { FormEvent, useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Users, Network } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Modal } from '../../components/ui/Modal';
import { Badge } from '../../components/ui/Badge';
import { Department } from '../../types/department.types';
import { Employee } from '../../types/employee.types';
import {
  listDepartmentsRequest,
  createDepartmentRequest,
  updateDepartmentRequest,
  deleteDepartmentRequest,
} from '../../services/departmentService';
import { listEmployeesRequest } from '../../services/adminUserService';

interface FormState {
  name: string;
  headUserId: string;
  parentDepartmentId: string;
}

const EMPTY_FORM: FormState = { name: '', headUserId: '', parentDepartmentId: '' };

export default function DepartmentsPanel() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Department | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [depts, emps] = await Promise.all([listDepartmentsRequest(), listEmployeesRequest({})]);
      setDepartments(depts);
      setEmployees(emps.filter((e) => e.status === 'ACTIVE'));
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load departments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setFormError(null);
    setModalOpen(true);
  };

  const openEdit = (dept: Department) => {
    setEditing(dept);
    setForm({
      name: dept.name,
      headUserId: dept.headUserId ?? '',
      parentDepartmentId: dept.parentDepartmentId ?? '',
    });
    setFormError(null);
    setModalOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);
    try {
      const payload = {
        name: form.name,
        headUserId: form.headUserId || null,
        parentDepartmentId: form.parentDepartmentId || null,
      };
      if (editing) {
        await updateDepartmentRequest(editing.id, payload);
      } else {
        await createDepartmentRequest(payload);
      }
      setModalOpen(false);
      await load();
    } catch (err: any) {
      setFormError(err?.response?.data?.message || 'Something went wrong. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleStatus = async (dept: Department) => {
    try {
      await updateDepartmentRequest(dept.id, {
        status: dept.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE',
      });
      await load();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to update department');
    }
  };

  const handleDelete = async (dept: Department) => {
    if (!window.confirm(`Delete "${dept.name}"? This can't be undone.`)) return;
    try {
      await deleteDepartmentRequest(dept.id);
      await load();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to delete department');
    }
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Departments feed dropdowns across the app — assets, allocations, and audits are all scoped
          to them.
        </p>
        <Button onClick={openCreate} className="shrink-0">
          <Plus size={16} /> New department
        </Button>
      </div>

      {error && <p className="mb-4 text-sm text-red-600 dark:text-red-400">{error}</p>}

      <Card className="overflow-x-auto p-0">
        {loading ? (
          <p className="p-6 text-sm text-slate-500 dark:text-slate-400">Loading…</p>
        ) : departments.length === 0 ? (
          <p className="p-6 text-sm text-slate-500 dark:text-slate-400">
            No departments yet. Create the first one to get started.
          </p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-xs uppercase text-slate-500 dark:border-slate-800 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Head</th>
                <th className="px-4 py-3 font-medium">Parent</th>
                <th className="px-4 py-3 font-medium">Members</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {departments.map((dept) => (
                <tr
                  key={dept.id}
                  className="border-b border-slate-100 last:border-0 dark:border-slate-800/60"
                >
                  <td className="px-4 py-3 font-medium">
                    <div className="flex items-center gap-2">
                      {dept.name}
                      {dept._count.children > 0 && (
                        <span
                          title={`${dept._count.children} sub-department(s)`}
                          className="inline-flex items-center gap-1 text-xs text-slate-400"
                        >
                          <Network size={12} /> {dept._count.children}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                    {dept.head ? dept.head.name : <span className="text-slate-400">—</span>}
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                    {dept.parent ? dept.parent.name : <span className="text-slate-400">—</span>}
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                    <span className="inline-flex items-center gap-1">
                      <Users size={14} /> {dept._count.members}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone={dept.status === 'ACTIVE' ? 'success' : 'neutral'}>
                      {dept.status === 'ACTIVE' ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => openEdit(dept)}
                        aria-label={`Edit ${dept.name}`}
                        className="rounded-md p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => toggleStatus(dept)}
                        className="rounded-md px-2 py-1 text-xs font-medium text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                      >
                        {dept.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleDelete(dept)}
                        aria-label={`Delete ${dept.name}`}
                        className="rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-red-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-red-400"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit department' : 'New department'}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            id="dept-name"
            label="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

          <Select
            id="dept-head"
            label="Department head"
            value={form.headUserId}
            onChange={(e) => setForm({ ...form, headUserId: e.target.value })}
          >
            <option value="">No head assigned</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name}
              </option>
            ))}
          </Select>

          <Select
            id="dept-parent"
            label="Parent department"
            value={form.parentDepartmentId}
            onChange={(e) => setForm({ ...form, parentDepartmentId: e.target.value })}
          >
            <option value="">No parent (top level)</option>
            {departments
              .filter((d) => d.id !== editing?.id)
              .map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
          </Select>

          {formError && <p className="text-sm text-red-600 dark:text-red-400">{formError}</p>}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Saving…' : editing ? 'Save changes' : 'Create department'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
