import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signup, login } from '../api';
import { AuthCtx } from '../AuthContext';

export default function Signup() {
  const { setToken } = useContext(AuthCtx);
  const nav = useNavigate();

  const [name,  setName]  = useState('');
  const [email, setEmail] = useState('');
  const [pw,    setPw]    = useState('');
  const [err,   setErr]   = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signup(name, email, pw);         // create account
      const res = await login(email, pw);    // auto-login
      setToken(res.data.access_token);
      nav('/');
    } catch (e: any) {
      setErr(e.response?.data?.detail ?? 'Signup failed');
    }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <form onSubmit={submit} className="card w-80 space-y-4">
        <h2 className="text-xl font-bold text-center">Create Account</h2>

        <input className="input" placeholder="Name"
               value={name} onChange={e => setName(e.target.value)} />

        <input className="input" placeholder="Email"
               value={email} onChange={e => setEmail(e.target.value)} />

        <input className="input" type="password" placeholder="Password"
               value={pw} onChange={e => setPw(e.target.value)} />

        <button className="btn btn-primary w-full">Sign Up</button>

        {err && <p className="text-red-600 text-sm">{err}</p>}

        <p className="text-sm text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-primary underline">Sign in</Link>
        </p>
      </form>
    </div>
  );
}