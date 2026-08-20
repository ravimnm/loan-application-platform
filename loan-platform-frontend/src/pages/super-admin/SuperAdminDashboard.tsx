import { useEffect, useState } from 'react';
import { isAxiosError } from 'axios';
import { superAdminApi } from '../../api/superAdminApi';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { Loading } from '../../components/common/Loading';
import type { Admin, BulkCreateAdminRequest, CreateAdminRequest } from '../../types/admin';
import '../../styles/super-admin.css';
import { useAuth } from '../../hooks/useAuth';

const initialAdmin: CreateAdminRequest = { email: '', phone: '', password: '' };

const getErrorMessage = (error: unknown, operation: string): string => {
  if (!isAxiosError(error)) return `Could not ${operation}. Please try again.`;
  switch (error.response?.status) {
    case 400: return 'Please check the information and try again.';
    case 401: return 'Your session has expired. Please sign in again.';
    case 403: return 'You do not have permission to manage admins.';
    case 404: return 'The requested admin could not be found.';
    case 409: return 'An admin with this information already exists, or the account has changed.';
    case 500: return 'The admin service is temporarily unavailable. Please try again later.';
    default: return `Could not ${operation}. Please try again.`;
  }
};

const validateAdmin = (admin: CreateAdminRequest): string | null => {
  if (!/^\S+@\S+\.\S+$/.test(admin.email.trim())) return 'Enter a valid admin email address.';
  if (!admin.phone.trim() || !/^\+?[0-9\s()-]{10,}$/.test(admin.phone.trim())) return 'Enter a valid admin phone number.';
  if (admin.password.length < 6) return 'Admin password must be at least 6 characters.';
  return null;
};

const parseBulkInput = (input: string): { request?: BulkCreateAdminRequest; error?: string } => {
  const lines = input.split('\n').map((line) => line.trim()).filter(Boolean);
  if (lines.length === 0) return { error: 'Add at least one admin to the bulk list.' };

  const admins = lines.map((line) => {
    const [email = '', phone = '', password = ''] = line.split(',').map((value) => value.trim());
    return { email, phone, password };
  });

  if (admins.some((admin) => admin.email === '' || admin.phone === '' || admin.password === '')) {
    return { error: 'Use one admin per line in this format: email, phone, password.' };
  }

  for (const admin of admins) {
    const validationError = validateAdmin(admin);
    if (validationError) return { error: validationError };
  }

  return { request: { admins } };
};

export const SuperAdminDashboard: React.FC = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [adminForm, setAdminForm] = useState<CreateAdminRequest>(initialAdmin);
  const [bulkInput, setBulkInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { logout } = useAuth();

  const loadAdmins = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setAdmins(await superAdminApi.listAdmins());
    } catch (loadError) {
      setError(getErrorMessage(loadError, 'load admins'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const loadedAdmins = await superAdminApi.listAdmins();
        if (active) setAdmins(loadedAdmins);
      } catch (loadError) {
        if (active) setError(getErrorMessage(loadError, 'load admins'));
      } finally {
        if (active) setIsLoading(false);
      }
    };
    void load();
    return () => {
      active = false;
    };
  }, []);

  const handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationError = validateAdmin(adminForm);
    if (validationError) {
      setError(validationError);
      setSuccess(null);
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      const created = await superAdminApi.createAdmin({
        email: adminForm.email.trim(),
        phone: adminForm.phone.trim(),
        password: adminForm.password,
      });
      setAdmins((current) => [...current, created]);
      setAdminForm(initialAdmin);
      setSuccess(`Admin ${created.email} was created successfully.`);
    } catch (createError) {
      setError(getErrorMessage(createError, 'create the admin'));
      setSuccess(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBulkCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsed = parseBulkInput(bulkInput);
    if (!parsed.request) {
      setError(parsed.error || 'Please check the bulk admin input.');
      setSuccess(null);
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      const created = await superAdminApi.bulkCreateAdmins(parsed.request);
      setAdmins((current) => [...current, ...created]);
      setBulkInput('');
      setSuccess(`${created.length} admin${created.length === 1 ? '' : 's'} created successfully.`);
    } catch (createError) {
      setError(getErrorMessage(createError, 'create the admins'));
      setSuccess(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggle = async (admin: Admin) => {
    const action = admin.enabled ? 'disable' : 'enable';
    if (!window.confirm(`${action === 'disable' ? 'Disable' : 'Enable'} ${admin.email}?`)) return;

    try {
      setIsSubmitting(true);
      setError(null);
      const updated = admin.enabled
        ? await superAdminApi.disableAdmin(admin.id)
        : await superAdminApi.enableAdmin(admin.id);
      setAdmins((current) => current.map((item) => item.id === updated.id ? updated : item));
      setSuccess(`${updated.email} was ${action}d successfully.`);
    } catch (toggleError) {
      setError(getErrorMessage(toggleError, `${action} this admin`));
      setSuccess(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <Loading message="Loading admin accounts..." />;

  return (
    <main className="super-admin-page">
      <header className="super-admin-header">

        <div>
          <span className="super-admin-eyebrow">
            System access
          </span>

          <h1>Super Admin</h1>

          <p>
            Create and manage administrator accounts.
          </p>
        </div>

        <div className="super-admin-header-actions">

          <button
            className="super-admin-button secondary"
            type="button"
            onClick={loadAdmins}
            disabled={isSubmitting}
          >
            Refresh
          </button>

          <button
            className="super-admin-button secondary"
            type="button"
            onClick={logout}
          >
            Logout
          </button>

        </div>

      </header>

      {error && <ErrorMessage message={error} />}
      {success && <div className="super-admin-success" role="status">{success}</div>}

      <div className="super-admin-grid">
        <section className="super-admin-panel">
          <h2>Create an admin</h2>
          <p>Passwords are sent for account creation only and are not saved or shown after submission.</p>
          <form className="super-admin-form" onSubmit={handleCreate}>
            <label>Email <input required type="email" value={adminForm.email} onChange={(event) => setAdminForm({ ...adminForm, email: event.target.value })} disabled={isSubmitting} /></label>
            <label>Phone <input required type="tel" value={adminForm.phone} onChange={(event) => setAdminForm({ ...adminForm, phone: event.target.value })} disabled={isSubmitting} /></label>
            <label>Temporary password <input required type="password" value={adminForm.password} onChange={(event) => setAdminForm({ ...adminForm, password: event.target.value })} disabled={isSubmitting} /></label>
            <button className="super-admin-button" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Creating...' : 'Create admin'}</button>
          </form>
        </section>

        <section className="super-admin-panel">
          <h2>Bulk admin creation</h2>
          <p>One admin per line: <strong>email, phone, password</strong>. Passwords are not retained after submission.</p>
          <form className="super-admin-form" onSubmit={handleBulkCreate}>
            <label>Admin list <textarea required rows={7} value={bulkInput} onChange={(event) => setBulkInput(event.target.value)} disabled={isSubmitting} placeholder="admin@example.com, +91 9876543210, password" /></label>
            <button className="super-admin-button" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Creating...' : 'Create admins'}</button>
          </form>
        </section>
      </div>

      <section className="super-admin-panel">
        <div className="super-admin-panel-heading"><div><h2>Admin accounts</h2><p>{admins.length} account{admins.length === 1 ? '' : 's'} found.</p></div></div>
        {admins.length === 0 ? <div className="super-admin-empty">No admin accounts are available.</div> : (
          <div className="super-admin-table-wrap"><table className="super-admin-table"><thead><tr><th>Email</th><th>Phone</th><th>Status</th><th>Created</th><th>Action</th></tr></thead><tbody>
            {admins.map((admin) => <tr key={admin.id}><td>{admin.email}</td><td>{admin.phone}</td><td><span className={`super-admin-status ${admin.enabled ? 'enabled' : 'disabled'}`}>{admin.enabled ? 'Enabled' : 'Disabled'}</span></td><td>{admin.createdAt ? new Date(admin.createdAt).toLocaleDateString() : 'Not provided'}</td><td><button className="super-admin-button secondary" type="button" onClick={() => handleToggle(admin)} disabled={isSubmitting}>{admin.enabled ? 'Disable' : 'Enable'}</button></td></tr>)}
          </tbody></table></div>
        )}
      </section>
    </main>
  );
};
