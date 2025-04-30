import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api';
import { AuthCtx } from '../AuthContext';

export default function Login() {
  const { setToken } = useContext(AuthCtx);
  const nav = useNavigate();
  const [email,setEmail] = useState('');
  const [pw,setPw]       = useState('');
  const [err,setErr]     = useState('');

  const submit = async(e:any) => {
    e.preventDefault();
    try {
      const res = await login(email, pw);
      setToken(res.data.access_token);
      nav('/');
    } catch {
      setErr('Invalid credentials');
    }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <form onSubmit={submit} className="card w-80 space-y-4">
        <h2 className="text-xl font-bold text-center">AIIA Login</h2>
        <input className="input" placeholder="email"
               value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="input" type="password" placeholder="password"
               value={pw} onChange={e=>setPw(e.target.value)} />
        <button className="btn btn-primary w-full">Login</button>
        {err && <p className="text-red-600 text-sm">{err}</p>}
      </form>
    </div>
  );
}