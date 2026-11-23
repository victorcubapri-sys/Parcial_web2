// Reglas de negocio del taller. Las transiciones se ejecutan en una ruta propia.
const allowed = {
  solicitada: ["en_diagnostico", "cancelada"],
  en_diagnostico: ["presupuestada"],
  presupuestada: ["aprobada", "rechazada"],
  aprobada: ["en_reparacion"],
  en_reparacion: ["lista"],
  lista: ["entregada"],
  entregada: [], rechazada: [], cancelada: []
}
const terminal = ["rechazada", "cancelada", "entregada"]\n// Bandera de ejecución interna: permite que la ruta propia guarde orden y evento.\nlet internalTransition = false

// Bloquea actualizaciones directas de estado y cambios de presupuesto después de presupuestar.
onRecordUpdate((e) => {
  if (internalTransition) return e.next()\n  const old = e.record.original()
  const from = old.getString("estado")
  const to = e.record.getString("estado")
  if (from !== to) throw new Error("Los cambios de etapa deben realizarse mediante la acción de transición.")
  if (terminal.includes(from)) throw new Error("Esta orden está cerrada y no puede modificarse.")
  if (["presupuestada","aprobada","en_reparacion","lista"].includes(from)) {
    for (const field of ["diagnostico","manoObra","piezas"]) {
      if (JSON.stringify(old.get(field)) !== JSON.stringify(e.record.get(field))) throw new Error("El presupuesto no puede modificarse después de presupuestar.")
    }
  }
  e.next()
}, "ordenes")

// Nunca se permite borrar órdenes desde la API.
onRecordDelete((e) => { throw new Error("No está permitido eliminar órdenes.") }, "ordenes")
// El historial solo se crea internamente al completar una transición.
onRecordCreate((e) => { if (!internalTransition) throw new Error("Los eventos solo pueden generarse desde el servidor."); e.next() }, "eventos")
onRecordUpdate((e) => { throw new Error("El historial es inmutable.") }, "eventos")
onRecordDelete((e) => { throw new Error("El historial es inmutable.") }, "eventos")

routerAdd("POST", "/api/taller/ordenes/{id}/transicion", (e) => {
  const id = e.request.pathValue("id")
  const body = new DynamicModel({a:"",diagnostico:"",manoObra:0,piezas:[]})
  e.bindBody(body)
  const app = e.app
  let result = null
  internalTransition = true\n  try { app.runInTransaction((txApp) => {
    const order = txApp.findRecordById("ordenes", id)
    const from = order.getString("estado")
    const to = String(body.a || "")
    if (!(allowed[from] || []).includes(to)) throw new Error("Transición no permitida: " + from + " → " + to)
    if (from === "en_diagnostico" && to === "presupuestada") {
      if (!String(body.diagnostico || "").trim()) throw new Error("El diagnóstico es obligatorio.")
      if (Number(body.manoObra) < 0) throw new Error("La mano de obra no puede ser negativa.")
      const pieces = Array.isArray(body.piezas) ? body.piezas : []
      for (const p of pieces) {
        if (!String(p.descripcion || "").trim() || Number(p.cantidad) <= 0 || Number(p.precio) < 0) throw new Error("Revisa los datos de las piezas.")
      }
      order.set("diagnostico", body.diagnostico)
      order.set("manoObra", Number(body.manoObra))
      order.set("piezas", pieces)
    }
    order.set("estado", to)
    txApp.save(order)
    const event = new Record(txApp.findCollectionByNameOrId("eventos"))
    event.set("orden", id)
    event.set("de", from)
    event.set("a", to)
    txApp.save(event)
    result = order
  })
  return e.json(200, {id:result.id,estado:result.getString("estado")})
})
