import {useNavigate} from 'react-router'
import OrderForm from '../components/OrderForm'
export default function NewOrder(){const nav=useNavigate();return <><div className="page-heading"><div><span className="eyebrow">NUEVO REGISTRO</span><h1>Recibir equipo</h1><p>Registra los datos iniciales de la reparación.</p></div></div><section className="panel form-panel"><OrderForm onDone={()=>nav('/ordenes')} onCancel={()=>nav('/ordenes')}/></section></>}
