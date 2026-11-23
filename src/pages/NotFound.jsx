import {Link} from 'react-router'
export default function NotFound(){return <div className="not-found"><b>404</b><h1>Página no encontrada</h1><p>La dirección que buscas no existe.</p><Link className="btn primary" to="/">Volver al resumen</Link></div>}
