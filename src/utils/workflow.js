export const STATES = ['solicitada','en_diagnostico','presupuestada','aprobada','en_reparacion','lista','entregada','rechazada','cancelada']
export const LABELS = {solicitada:'Solicitada',en_diagnostico:'En diagnóstico',presupuestada:'Presupuestada',aprobada:'Aprobada',rechazada:'Rechazada',en_reparacion:'En reparación',lista:'Lista',entregada:'Entregada',cancelada:'Cancelada'}
export const NEXT = {solicitada:['en_diagnostico','cancelada'],en_diagnostico:['presupuestada'],presupuestada:['aprobada','rechazada'],aprobada:['en_reparacion'],en_reparacion:['lista'],lista:['entregada'],entregada:[],rechazada:[],cancelada:[]}
export const money = n => new Intl.NumberFormat('es-ES',{style:'currency',currency:'USD'}).format(Number(n)||0)
export const total = order => Number(order?.manoObra||0)+(order?.piezas||[]).reduce((s,p)=>s+(Number(p.cantidad)||0)*(Number(p.precio)||0),0)
