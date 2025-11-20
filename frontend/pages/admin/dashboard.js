import useSWR from 'swr';
const fetcher = (url, token)=> fetch(url, { headers: { Authorization: 'Bearer ' + token } }).then(r=>r.json());
export default function Dashboard(){
  const token = typeof window !== 'undefined' ? localStorage.getItem('ml_admin_token') : '';
  const { data } = useSWR(['/api/admin/stats', token], fetcher);
  if(!data) return <div className="container">Loading...</div>;
  return (
    <div className="container">
      <h1>Admin Dashboard</h1>
      <div className="card">
        <div>Users: {data.users}</div>
        <div>Listings: {data.listings}</div>
        <div>Messages: {data.messages}</div>
      </div>
    </div>
  );
}
