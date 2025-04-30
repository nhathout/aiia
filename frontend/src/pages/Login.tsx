import { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/api';
import { AuthCtx } from '../AuthContext';

export default function Login() {
  const { setToken } = useContext(AuthCtx);
  const nav = useNavigate();

  const [email, setEmail] = useState('');
  const [pw,    setPw]    = useState('');
  const [err,   setErr]   = useState('');

  const submit = async (e: React.FormEvent) => {
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

        <input className="input" placeholder="Email"
               value={email} onChange={e => setEmail(e.target.value)} />

        <input className="input" type="password" placeholder="Password"
               value={pw} onChange={e => setPw(e.target.value)} />

        <button className="btn btn-primary w-full">Login</button>

        {err && <p className="text-red-600 text-sm">{err}</p>}

        <p className="text-sm text-center">
          New here?{' '}
          <Link to="/signup" className="text-primary underline">Create an account</Link>
        </p>
      </form>
    </div>
  );
}