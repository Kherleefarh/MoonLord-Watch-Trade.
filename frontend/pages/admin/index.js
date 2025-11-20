import { useRouter } from 'next/router';
export default function AdminEntry(){
  const router = useRouter();
  async function submit(e){
    e.preventDefault();
    const res = await fetch('/api/admin/login', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email: e.target.email.value, password: e.target.password.value }) });
    const j = await res.json();
    if(j.token){ localStorage.setItem('ml_admin_token', j.token); router.push('/admin/dashboard'); } else alert('Login failed');
  }
  return (
    <div className="container">
      <h1>Admin Login</h1>
      <form onSubmit={submit} className="card" style={{display:'grid', gap:8}}>
        <input name="email" placeholder="Admin email" defaultValue="admin@moonlord.com" />
        <input name="password" placeholder="Password" type="password" defaultValue="MoonLord@2025" />
        <div style={{display:'flex', justifyContent:'flex-end'}}><button type="submit">Sign in</button></div>
      </form>
    </div>
  );
}
