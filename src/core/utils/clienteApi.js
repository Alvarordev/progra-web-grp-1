export class ErrorApi extends Error {
  constructor(mensaje, codigo, errores) {
    super(mensaje)
    this.status = codigo
    this.errores = errores
  }
}

export const solicitarApi = async (ruta, { method = 'GET', body, headers } = {}) => {
  const encabezados = new Headers(headers)
  encabezados.set('Accept', 'application/json')
  if (body !== undefined) {
    encabezados.set('Content-Type', 'application/json')
  }
  const base = (import.meta.env?.VITE_API_URL || '/api').replace(/\/$/, '')
  let respuesta
  try {
    respuesta = await fetch(`${base}${ruta}`, {
      method,
      headers: encabezados,
      credentials: 'include',
      cache: 'no-store',
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch {
    throw new ErrorApi('No se pudo conectar con el backend del congreso.')
  }
  if (respuesta.status === 204) {
    return undefined
  }
  const contenido = respuesta.headers.get('Content-Type')?.includes('application/json')
    ? await respuesta.json()
    : null
  if (!respuesta.ok || contenido?.status !== 'success') {
    throw new ErrorApi(
      contenido?.mensaje || 'No se pudo completar la solicitud.',
      respuesta.status,
      contenido?.errores
    )
  }
  return contenido.data
}
