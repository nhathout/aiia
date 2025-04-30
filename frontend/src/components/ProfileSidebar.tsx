import { useContext, useState } from 'react';
import { AuthCtx } from '../AuthContext';
import { updateProfile } from '../services/api';

export default function ProfileSidebar() {
  const { user, setUser, setToken } = useContext(AuthCtx);
  const [editing, setEditing] = useState(false);
  const [email,   setEmail]   = useState(user?.email ?? '');
  const [theme,   setTheme]   = useState(
    document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  );
  const [saving,  setSaving]  = useState(false);

  const toggleTheme = () => {
    const root = document.documentElement;
    if (theme === 'light') { root.classList.add('dark');  setTheme('dark'); }
    else                   { root.classList.remove('dark'); setTheme('light'); }
  };

  const startEdit = () => setEditing(true);

  const save = async () => {
    if (!window.confirm('Change e-mail to ' + email + '?')) return;
    setSaving(true);
    const res = await updateProfile({ email });
    setUser({ ...user!, email: res.data.email });
    setSaving(false);
    setEditing(false);
  };

  return (
    <aside className="w-72 shrink-0 bg-white dark:bg-slate-800
                       border-l dark:border-slate-700 h-full flex flex-col">
      <div className="p-6 border-b dark:border-slate-700">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-slate-100">
          My Profile
        </h2>
      </div>

      <div className="p-6 flex-1 space-y-4 text-sm text-gray-700 dark:text-slate-300">
        <div>
          <label className="block text-xs mb-1">Email</label>
          <input
            className="input disabled:bg-gray-100 dark:disabled:bg-slate-700"
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={!editing}
          />
          {editing ? (
            <button onClick={save} className="btn btn-primary mt-2" disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </button>
          ) : (
            <button onClick={startEdit} className="btn mt-2">Edit</button>
          )}
        </div>

        <button onClick={toggleTheme} className="btn mt-6">
          Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
        </button>
      </div>

      <button
        onClick={() => setToken(null)}
        className="m-4 btn btn-primary"
      >
        Logout
      </button>
    </aside>
  );
}