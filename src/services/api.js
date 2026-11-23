const BASE = import.meta.env.VITE_POCKETBASE_URL || 'http://127.0.0.1:8090'
async function request(path, options={}) {
  const response = await fetch(`${BASE}${path}`, options)
  const data = response.status === 204 ? null : await response.json().catch(()=>null)
  if (!response.ok) throw new Error(data?.message || data?.data && Object.values(data.data).map(x=>x.message).join(', ') || `Error HTTP ${response.status}`)
  return data
}
export const api = {
  base: BASE,
  list: (collection, params='') => request(`/api/collections/${collection}/records?perPage=200${params}`),
  get: (collection,id,expand='') => request(`/api/collections/${collection}/records/${id}${expand ? `?expand=${expand}` : ''}`),
  create: (collection, body) => request(`/api/collections/${collection}/records`, {method:'POST',body}),
  update: (collection,id,body) => request(`/api/collections/${collection}/records/${id}`, {method:'PATCH',body}),
  remove: (collection,id) => request(`/api/collections/${collection}/records/${id}`, {method:'DELETE'}),
  transition: (id, to, payload={}) => request(`/api/taller/ordenes/${id}/transicion`, {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({a:to,...payload})}),
  fileUrl: (record, filename) => `${BASE}/api/files/${record.collectionId}/${record.id}/${encodeURIComponent(filename)}`
}
export function formData(values) {
  const fd = new FormData()
  Object.entries(values).forEach(([k,v])=>{
    if (k === 'fotos') [...(v || [])].forEach(file=>fd.append('fotos',file))
    else if (v !== undefined && v !== null) fd.append(k, typeof v === 'object' ? JSON.stringify(v) : v)
  })
  return fd
}
