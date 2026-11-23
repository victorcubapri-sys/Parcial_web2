import {useEffect,useState} from 'react'
import {Link} from 'react-router'
import {api} from '../services/api'
export default function Clients(){
 const [items,setItems]=useState([]),[form,setForm]=useState({nombre:'',telefono:''}),[q,setQ]=useState(''),[error,setError]=useState('')
 const load=()=>api.list('clientes').then(d=>setItems(d.items||[])).catch(e=>setError(e.message))
 useEffect(()=>{load()},[])
 async function save(e){e.preventDefault();setError('');try{await api.create('clientes',form);setForm({nombre:'',telefono:''});load()}catch(e){setError(e.message)}}
 const shown=items.filter(c=>(c.nombre+' '+c.telefono).toLowerCase().includes(q.toLowerCase()))
 return <><div className="page-heading"><div><span className="eyebrow">DIRECTORIO</span><h1>Clientes</h1><p>Contactos de las personas que confían en el taller.</p></div></div><div className="two-col clients-layout"><section className="panel"><div className="panel-head"><div><h2>Registrar cliente</h2><p>Los clientes no necesitan iniciar sesión.</p></div></div><form className="form" onSubmit={save}><label>Nombre<input required value={form.nombre} onChange={e=>setForm({...form,nombre:e.target.value})}/></label><label>Teléfono<input required value={form.telefono} onChange={e=>setForm({...form,telefono:e.target.value})}/></label>{error&&<p className="error">{error}</p>}<button className="btn primary">Guardar cliente</button></form></section><section className="panel"><div className="panel-head"><div><h2>Clientes registrados</h2><p>{items.length} contactos</p></div></div><input className="search" value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar cliente…"/>{shown.map(c=><div className="client-row" key={c.id}><div className="avatar">{c.nombre.slice(0,1).toUpperCase()}</div><div><b>{c.nombre}</b><small>{c.telefono}</small></div><Link to={`/clientes/${c.id}`}>Ver →</Link></div>)}{!shown.length&&<div className="empty">No hay clientes.</div>}</section></div></>
}
