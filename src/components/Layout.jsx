import {NavLink,Outlet} from 'react-router'
const links=[['/','▦','Resumen'],['/ordenes','▤','Órdenes'],['/clientes','♙','Clientes']]
export default function Layout(){
 return <div className="shell"><aside className="sidebar"><div className="brand"><span className="brand-icon">✦</span><div><b>Taller</b><small>CONTROL DE SERVICIO</small></div></div><nav>{links.map(([to,icon,label])=><NavLink key={to} to={to} end={to==='/'}><span>{icon}</span>{label}</NavLink>)}</nav><div className="side-note"><b>Panel de trabajo</b><p>Control de equipos, presupuestos y entregas.</p></div></aside><main className="main"><header className="topbar"><div><span className="eyebrow">GESTIÓN DEL TALLER</span><b>Centro de operaciones</b></div><span className="live"><i/> Sistema local</span></header><section className="content"><Outlet/></section></main></div>
}
