import {useEffect,useState} from 'react'
import {api,formData} from '../services/api'
export default function OrderForm({onDone,onCancel}){
 const [clients,setClients]=useState([]),[form,setForm]=useState({cliente:'',equipo:'',problema:''}),[photos,setPhotos]=useState([]),[busy,setBusy]=useState(false),[error,setError]=useState('')
 useEffect(()=>{api.list('clientes').then(d=>setClients(d.items||[])).catch(e=>setError(e.message))},[])
 const change=e=>setForm({...form,[e.target.name]:e.target.value})
 async function submit(e){e.preventDefault();setError('');setBusy(true);try{await api.create('ordenes',formData({...form,estado:'solicitada',manoObra:0,piezas:[],fotos:photos}));onDone()}catch(e){setError(e.message)}finally{setBusy(false)}}
 return <form className="form" onSubmit={submit}><label>Cliente<select required name="cliente" value={form.cliente} onChange={change}><option value="">Selecciona un cliente</option>{clients.map(c=><option key={c.id} value={c.id}>{c.nombre} · {c.telefono}</option>)}</select></label><label>Equipo<input required name="equipo" value={form.equipo} onChange={change} placeholder="Ej. Samsung Galaxy A54"/></label><label>Problema reportado<textarea required name="problema" value={form.problema} onChange={change} rows="3" placeholder="Describe la falla indicada por el cliente"/></label><label>Fotografías (máximo 3)<input type="file" accept="image/*" multiple onChange={e=>setPhotos([...e.target.files].slice(0,3))}/><small>{photos.length} de 3 imágenes seleccionadas</small></label>{error&&<p className="error">{error}</p>}<div className="actions"><button type="button" className="btn ghost" onClick={onCancel}>Cancelar</button><button className="btn primary" disabled={busy}>{busy?'Guardando…':'Crear orden'}</button></div></form>
}
