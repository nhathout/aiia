import { useEffect, useState } from "react";
import { getPrefs, savePrefs } from "../services/api";

export default function Settings() {
  const [form,setForm]=useState({budget:1000,risk:"medium",horizon:5,prefs:"stocks,ETFs",broker:""});
  const [msg,setMsg]=useState("");

  useEffect(()=>{(async()=>{const {data}=await getPrefs();setForm(v=>({...v,...data}));})();},[]);

  const upd=(k:keyof typeof form)=>(e:any)=>setForm({...form,[k]:e.target.value});

  const submit=async(e:any)=>{e.preventDefault();await savePrefs(form);setMsg("Saved ✅");};

  return (
    <div className="max-w-xl mx-auto p-8 card space-y-6">
      <h1 className="text-xl font-bold">Profile Settings</h1>
      <form onSubmit={submit} className="space-y-4">
        {/* budget */}
        <label className="block">
          <span className="text-sm">Budget ($)</span>
          <input type="number" className="input" value={form.budget} onChange={upd("budget")}/>
        </label>
        {/* risk */}
        <label className="block">
          <span className="text-sm">Risk tolerance</span>
          <select className="input" value={form.risk} onChange={upd("risk")}> <option>low</option><option>medium</option><option>high</option></select>
        </label>
        {/* horizon */}
        <label className="block">
          <span className="text-sm">Investment horizon (yrs)</span>
          <input type="number" className="input" value={form.horizon} onChange={upd("horizon")}/>
        </label>
        {/* prefs */}
        <label className="block">
          <span className="text-sm">Fund preferences (comma‑sep)</span>
          <input className="input" value={form.prefs} onChange={upd("prefs")}/>
        </label>
        {/* broker */}
        <label className="block">
          <span className="text-sm">Preferred broker/app</span>
          <input className="input" value={form.broker} onChange={upd("broker")}/>
        </label>
        <button className="btn btn-primary">Save</button>
      </form>
      {msg && <p className="text-green-600 text-sm">{msg}</p>}
    </div>
  );
}