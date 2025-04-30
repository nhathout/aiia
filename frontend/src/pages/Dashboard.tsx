import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthCtx } from '../AuthContext';
import { recommend, getHistory } from '../services/api';
import {
  Chart, ArcElement, CategoryScale, LinearScale,
  PointElement, LineElement, Tooltip, Legend
} from 'chart.js';
import { Pie, Line } from 'react-chartjs-2';
import ProfileSidebar from '../components/ProfileSidebar';

Chart.register(
  ArcElement, CategoryScale, LinearScale,
  PointElement, LineElement, Tooltip, Legend
);

interface Holding { ticker:string; allocation:number; price:number }
interface HistoryEntry { holdings:Holding[] }

export default function Dashboard() {
  const { user, token } = useContext(AuthCtx);
  const nav = useNavigate();

  // ----- form state -----
  const [form, setForm] = useState({
    budget:   10_000,
    horizon:  5,
    risk:     'medium',
    prefs:    'ETFs, stocks',
    broker:   '',
  });

  const update = (k:keyof typeof form) =>
    (e:React.ChangeEvent<HTMLInputElement|HTMLSelectElement>) =>
      setForm({ ...form, [k]: e.target.value });

  // ----- data state -----
  const [portfolio, setPortfolio] = useState<Holding[]>([]);
  const [history,   setHistory]   = useState<HistoryEntry[]>([]);
  const [loading,   setLoading]   = useState(false);

  useEffect(() => { if (!token) nav('/login'); }, [token, nav]);

  // ----- submit -----
  const submit = async (e:React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setLoading(true);

    const payload = {
        budget:      Number(form.budget),
        horizon:     Number(form.horizon),
        risk:        form.risk,
        preferences: form.prefs.split(',').map(s => s.trim()),
        broker:      form.broker || undefined
        };
    
    // axios interceptor will pick up the stored token automatically
    const recRes = await recommend(payload);
    setPortfolio(recRes.data.holdings);

    const histRes = await getHistory();
    setHistory(histRes.data);

    setLoading(false);
  };

  // ----- chart data -----
  const pie = {
    labels: portfolio.map(h => h.ticker),
    datasets: [{
      data: portfolio.map(h => h.allocation),
      backgroundColor: ['#2563eb','#22d3ee','#fbbf24','#ef4444','#14b8a6']
    }]
  };

  const line = {
    labels: history.map((_,i)=>`Run ${i+1}`),
    datasets: [{
      label:'Budget Utilised ($)',
      data: history.map(h => h.holdings.reduce(
        (s,x)=>s + x.price * (x.allocation/100), 0))
    }]
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50 dark:bg-slate-900">
      {/* right-hand sidebar */}
      <main className="flex-1 overflow-y-auto p-8 space-y-8">
        <h1 className="text-2xl mb-4 font-semibold text-gray-800 dark:text-slate-100">
          Hello {user?.name ?? 'Investor'}, ready to make money?
        </h1>

        {/* ----- criteria form ----- */}
        <form
          onSubmit={submit}
          className="card grid lg:grid-cols-3 gap-6"
        >
          <h2 className="lg:col-span-3 text-lg font-bold">
            Build My Portfolio
          </h2>

          {/* budget slider */}
          <div>
            <label className="block text-sm mb-1">Budget (${form.budget})</label>
            <input
              type="range"
              min={500}
              max={100_000}
              step={500}
              value={form.budget}
              onChange={update('budget')}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Horizon (years)</label>
            <input
              type="number"
              className="input"
              value={form.horizon}
              onChange={update('horizon')}
              min={1} max={40}
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Risk</label>
            <select
              className="input"
              value={form.risk}
              onChange={update('risk')}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="lg:col-span-2">
            <label className="block text-sm mb-1">
              Fund types (comma-separated)
            </label>
            <input
              className="input"
              value={form.prefs}
              onChange={update('prefs')}
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Broker (optional)</label>
            <input
              className="input"
              value={form.broker}
              onChange={update('broker')}
            />
          </div>

          <div className="lg:col-span-3">
            <button className="btn btn-primary" disabled={loading}>
              {loading ? 'Generating…' : 'Generate Portfolio'}
            </button>

            {loading && <p className="text-sm text-gray-500 mt-2">Contacting GPT and fetching live prices…</p>}

          </div>
        </form>

        {/* ----- charts & data ----- */}
        {portfolio.length > 0 && (
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="card"><Pie data={pie} /></div>
            <div className="card"><Line data={line} /></div>
          </div>
        )}
      </main>

      <ProfileSidebar />   {/* stays on the right */}
    </div>
  );
}