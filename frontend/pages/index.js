import useSWR from 'swr';
import Link from 'next/link';
const fetcher = (url)=> fetch(url).then(r=>r.json());

export default function Home(){
  const { data: listings } = useSWR('/api/listings', fetcher);
  return (
    <div>
      <nav className="nav"><div style={{fontWeight:700}}>MoonLord Watch Trade</div><div style={{marginLeft:'auto'}}><Link href='/admin'>Admin</Link></div></nav>
      <div className="container">
        <h1>Listings</h1>
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:12}}>
          {listings?.map(l=>(
            <div key={l.id} className="card">
              <div style={{height:140, background:'#f1f5f9', display:'flex', alignItems:'center', justifyContent:'center'}}>{l.images?.[0]? <img src={l.images[0]} style={{maxHeight:140}} alt=''/> : 'No image'}</div>
              <h3>{l.title}</h3>
              <div style={{color:'#64748b'}}>{l.brand} — {l.model}</div>
              <div style={{display:'flex', justifyContent:'space-between', marginTop:8}}>
                <div style={{fontWeight:700}}>${l.price}</div>
                <Link href={'/listings/'+l.id}>View</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
