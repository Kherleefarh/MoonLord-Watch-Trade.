import { useRouter } from 'next/router';
import useSWR from 'swr';
const fetcher = (url)=> fetch(url).then(r=>r.json());
export default function Listing(){
  const router = useRouter();
  const { id } = router.query;
  const { data: l } = useSWR(id? '/api/listings/'+id : null, fetcher);
  if(!l) return <div>Loading...</div>;
  return (
    <div className="container">
      <div className="card">
        <h1>{l.title}</h1>
        <div style={{display:'flex', gap:16}}>
          <div style={{flex:1}}>{l.images?.[0]? <img src={l.images[0]} style={{maxWidth:'100%'}} alt=''/> : <div style={{height:240, background:'#f3f4f6'}}>No image</div>}</div>
          <div style={{width:340}}>
            <div style={{fontSize:20, fontWeight:700}}>${l.price}</div>
            <div style={{color:'#64748b'}}>{l.brand} — {l.model}</div>
            <p style={{marginTop:12}}>{l.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
