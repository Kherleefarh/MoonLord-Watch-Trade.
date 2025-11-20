import { useRouter } from 'next/router';
import { useState } from 'react';
export default function Create(){
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  async function submit(e){
    e.preventDefault();
    const fd = new FormData(e.target);
    const file = fd.get('image');
    let images = [];
    if(file && file.size){
      setUploading(true);
      const up = new FormData();
      up.append('file', file);
      const r = await fetch('/api/upload', { method:'POST', body: up });
      const j = await r.json();
      images.push(j.url);
      setUploading(false);
    }
    const body = { title: fd.get('title'), brand: fd.get('brand'), model: fd.get('model'), price: Number(fd.get('price')), condition: fd.get('condition'), description: fd.get('description'), images };
    await fetch('/api/listings', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) });
    router.push('/');
  }
  return (
    <div className="container">
      <h1>Create Listing</h1>
      <form onSubmit={submit} className="card" style={{display:'grid', gap:8}}>
        <input name="title" placeholder="Title" required />
        <input name="brand" placeholder="Brand" />
        <input name="model" placeholder="Model" />
        <input name="price" placeholder="Price" type="number" />
        <select name="condition"><option>Mint</option><option>Excellent</option><option>Good</option><option>Fair</option></select>
        <textarea name="description" placeholder="Description"></textarea>
        <input name="image" type="file" />
        <div style={{display:'flex', gap:8, justifyContent:'flex-end'}}>
          <button type="submit">{uploading? 'Uploading...':'Publish'}</button>
        </div>
      </form>
    </div>
  );
}
