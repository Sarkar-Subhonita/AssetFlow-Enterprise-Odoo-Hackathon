import { FormEvent, useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Boxes } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Modal } from '../../components/ui/Modal';
import { Badge } from '../../components/ui/Badge';
import { AssetCategory } from '../../types/category.types';
import {
  listCategoriesRequest,
  createCategoryRequest,
  updateCategoryRequest,
  deleteCategoryRequest,
} from '../../services/categoryService';

// Custom fields are stored as { fieldName: fieldType } — e.g.
// { "Warranty (months)": "number" } — so the Asset module (a later
// phase) can render the right input for each category's extra attributes.
const FIELD_TYPES = ['text', 'number', 'date', 'boolean'] as const;
type FieldRow = { name: string; type: (typeof FIELD_TYPES)[number] };

const toFieldRows = (customFields: Record<string, unknown> | null): FieldRow[] => {
  if (!customFields) return [];
  return Object.entries(customFields).map(([name, type]) => ({
    name,
    type: (FIELD_TYPES as readonly string[]).includes(String(type))
      ? (type as FieldRow['type'])
      : 'text',
  }));
};

const toCustomFields = (rows: FieldRow[]): Record<string, string> | null => {
  const cleaned = rows.filter((r) => r.name.trim().length > 0);
  if (cleaned.length === 0) return null;
  return Object.fromEntries(cleaned.map((r) => [r.name.trim(), r.type]));
};

export default function CategoriesPanel() {
  const [categories, setCategories] = useState<AssetCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<AssetCategory | null>(null);
  const [name, setName] = useState('');
  const [fieldRows, setFieldRows] = useState<FieldRow[]>([]);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      setCategories(await listCategoriesRequest());
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setName('');
    setFieldRows([]);
    setFormError(null);
    setModalOpen(true);
  };

  const openEdit = (cat: AssetCategory) => {
    setEditing(cat);
    setName(cat.name);
    setFieldRows(toFieldRows(cat.customFields));
    setFormError(null);
    setModalOpen(true);
  };

  const addFieldRow = () => setFieldRows([...fieldRows, { name: '', type: 'text' }]);
  const removeFieldRow = (index: number) => setFieldRows(fieldRows.filter((_, i) => i !== index));
  const updateFieldRow = (index: number, patch: Partial<FieldRow>) =>
    setFieldRows(fieldRows.map((row, i) => (i === index ? { ...row, ...patch } : row)));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);
    try {
      const payload = { name, customFields: toCustomFields(fieldRows) };
      if (editing) {
        await updateCategoryRequest(editing.id, payload);
      } else {
        await createCategoryRequest(payload);
      }
      setModalOpen(false);
      await load();
    } catch (err: any) {
      setFormError(err?.response?.data?.message || 'Something went wrong. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (cat: AssetCategory) => {
    if (!window.confirm(`Delete "${cat.name}"? This can't be undone.`)) return;
    try {
      await deleteCategoryRequest(cat.id);
      await load();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to delete category');
    }
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Categories group assets and define the extra attributes each asset in that group tracks.
        </p>
        <Button onClick={openCreate} className="shrink-0">
          <Plus size={16} /> New category
        </Button>
      </div>

      {error && <p className="mb-4 text-sm text-red-600 dark:text-red-400">{error}</p>}

      <Card className="overflow-x-auto p-0">
        {loading ? (
          <p className="p-6 text-sm text-slate-500 dark:text-slate-400">Loading…</p>
        ) : categories.length === 0 ? (
          <p className="p-6 text-sm text-slate-500 dark:text-slate-400">
            No categories yet. Create the first one to get started.
          </p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-xs uppercase text-slate-500 dark:border-slate-800 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Custom fields</th>
                <th className="px-4 py-3 font-medium">Assets</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr
                  key={cat.id}
                  className="border-b border-slate-100 last:border-0 dark:border-slate-800/60"
                >
                  <td className="px-4 py-3 font-medium">{cat.name}</td>
                  <td className="px-4 py-3">
                    {cat.customFields && Object.keys(cat.customFields).length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(cat.customFields).map(([field, type]) => (
                          <Badge key={field} tone="neutral">
                            {field} · {String(type)}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                    <span className="inline-flex items-center gap-1">
                      <Boxes size={14} /> {cat._count.assets}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => openEdit(cat)}
                        aria-label={`Edit ${cat.name}`}
                        className="rounded-md p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(cat)}
                        aria-label={`Delete ${cat.name}`}
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
        title={editing ? 'Edit category' : 'New category'}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input id="cat-name" label="Name" value={name} onChange={(e) => setName(e.target.value)} required />

          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Custom fields
              </span>
              <button
                type="button"
                onClick={addFieldRow}
                className="text-xs font-medium text-primary hover:underline"
              >
                + Add field
              </button>
            </div>

            {fieldRows.length === 0 ? (
              <p className="text-xs text-slate-400">
                Optional — e.g. "Warranty (months)" as a number, tracked per asset in this category.
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {fieldRows.map((row, i) => (
                  <div key={i} className="flex gap-2">
                    <Input
                      className="flex-1"
                      placeholder="Field name"
                      value={row.name}
                      onChange={(e) => updateFieldRow(i, { name: e.target.value })}
                    />
                    <Select
                      className="w-28"
                      value={row.type}
                      onChange={(e) => updateFieldRow(i, { type: e.target.value as FieldRow['type'] })}
                    >
                      {FIELD_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </Select>
                    <button
                      type="button"
                      onClick={() => removeFieldRow(i)}
                      aria-label="Remove field"
                      className="rounded-md p-2 text-slate-400 hover:bg-slate-100 hover:text-red-600 dark:hover:bg-slate-800"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {formError && <p className="text-sm text-red-600 dark:text-red-400">{formError}</p>}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Saving…' : editing ? 'Save changes' : 'Create category'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
