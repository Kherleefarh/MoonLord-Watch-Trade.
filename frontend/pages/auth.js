import { useRouter } from 'next/router';
export default function Auth(){
  const router = useRouter();
  async function submit(e){
    e.preventDefault();
    const fd = new FormData(e.target);
    const body = { email: fd.get('email'), password: fd.get('password'), name: fd.get('name') };
    const r = await fetch('/api/auth/login', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email: body.email, password: body.password }) });
    if(r.ok) router.push('/');
    else alert('Auth failed');
  }
  return (
    <div className="container">
      <h1>Auth</h1>
      <form onSubmit={submit} className="card" style={{display:'grid', gap:8}}>
        <input name="email" placeholder="Email" />
        <input name="password" placeholder="Password" type="password" />
        <div style={{display:'flex', justifyContent:'flex-end'}}><button type="submit">Sign in</button></div>
      </form>
    </div>
  );
}
