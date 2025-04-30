import { useContext, useState } from 'react';
import { recommend, getHistory } from '../api';
import { AuthCtx } from '../AuthContext';
import { Pie, Line } from 'react-chartjs-2';
import { ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
import { Chart } from 'chart.js';

Chart.register(ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function Dashboard() {
  const { token, setToken } = useContext(AuthCtx);
  const [budget,setBudget] = useState(1000);
  const [portfolio,setPortfolio] = useState<any[]>([]);
  const [history,setHistory]     = useState<any[]>([]);
  const [loading,setLoading]     = useState(false);

  const submit = async(e:any) => {
    e.preventDefault();
    setLoading(true);
    const data = { budget, horizon:5, risk:'medium',
                   preferences:['ETFs','stocks'], broker:'Recommend'};
    const res  = await recommend(token!, data);
    setPortfolio(res.data.holdings);
    const hRes = await getHistory(token!);
    setHistory(hRes.data);
    setLoading(false);
  };

  const pieData = {
    labels: portfolio.map(p=>p.ticker),
    datasets:[{ data: portfolio.map(p=>p.allocation_percent),
      backgroundColor:['#2563eb','#22d3ee','#fbbf24','#ef4444','#14b8a6'] }]
  };

  const lineData = {
    labels: history.map((_:any,i:number)=>`Run ${i+1}`),
    datasets:[{ label:'Portfolio $',
      data: history.map((h:any)=>
        h.holdings.reduce((sum:number,x:any)=>sum+x.price*(x.allocation_percent/100),0)
      )}]
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <form onSubmit={submit} className="card space-y-3">
        <h2 className="text-lg font-bold">Investment Criteria</h2>
        <input type="number" className="input" value={budget}
               onChange={e=>setBudget(+e.target.value)} />
        <button className="btn btn-primary" disabled={loading}>
          {loading ? 'Generating…' : 'Generate Portfolio'}
        </button>
      </form>

      {portfolio.length>0 && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="card"><Pie data={pieData}/></div>
          <div className="card"><Line data={lineData}/></div>
        </div>
      )}

      <button onClick={()=>setToken(null)} className="btn mt-4">Logout</button>
    </div>
  );
}