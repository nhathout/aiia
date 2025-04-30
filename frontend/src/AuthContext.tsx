import { createContext, useState, ReactNode, useEffect } from 'react';

interface Ctx { token:string|null; setToken:(t:string|null)=>void; }
export const AuthCtx = createContext<Ctx>({ token:null, setToken:()=>{} });

export default function AuthProvider({children}:{children:ReactNode}) {
  const [tok,setTok] = useState<string|null>(null);

  useEffect(() => {
    setTok(localStorage.getItem('aiia_tok'));
  }, []);

  const setToken = (t:string|null) => {
    t ? localStorage.setItem('aiia_tok', t)
      : localStorage.removeItem('aiia_tok');
    setTok(t);
  };

  return <AuthCtx.Provider value={{token:tok, setToken}}>{children}</AuthCtx.Provider>;
}