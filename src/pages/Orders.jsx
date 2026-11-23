import {useEffect,useState} from 'react'
import {Link} from 'react-router'
import {api} from '../services/api'
import Status from '../components/Status'
export default function Orders(){
 const [items,setItems]=useState([]),[q,setQ]=useState(''),[error,setError]=useState('')
 const load=()=>api.list('ordenes','&expand=cliente').then(d=>setItems(d.items||[])).catch(e=>setError(e.message))
 useEffect(()=>{load()},[])
 const shown=items.filter(o=>(o.equipo+' '+o.problema+' '+(o.expand?.cliente?.nombre||'')).toLowerCase().includes(q.toLowerCase()))
 return <><div className="page-heading"><div><span className="eyebrow">GESTIÓN</span><h1>Órdenes de reparación</h1><p>Consulta y controla cada equipo recibido.</p></div><Link className="btn primary" to="/ordenes/nueva">＋ Nueva orden</Link></div><section className="panel"><div className="toolbar"><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar por equipo, cliente o problema…"/></div>{error&&<p className="error">{error}</p>}<div className="table-wrap"><table><thead><tr><th>Equipo / orden</th><th>Cliente</th><th>Estado</th><th>Registro</th><th></th></tr></thead><tbody>{shown.map(o=><tr key={o.id}><td><b>{o.equipo}</b><small className="cell-sub">{o.id.slice(0,8).toUpperCase()}</small></td><td>{o.expand?.cliente?.nombre||'—'}</td><td><Status value={o.estado}/></td><td>{new Date(o.created).toLocaleDateString('es')}</td><td><Link className="table-link" to={`/ordenes/${o.id}`}>Abrir →</Link></td></tr>)}</tbody></table>{!shown.length&&<div className="empty">No se encontraron órdenes.</div>}</div></section></>
}
