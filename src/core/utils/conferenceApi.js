export class ConferenceApiError extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
  }
}

export async function requestConference(path, { method = 'GET', body, headers } = {}) {
  const requestHeaders = new Headers(headers)
  if (body !== undefined) {
    requestHeaders.set('Content-Type', 'application/json')
  }
  requestHeaders.set('Accept', 'application/json')

  let response
  try {
    response = await fetch(`/api${path}`, {
      method,
      headers: requestHeaders,
      credentials: 'same-origin',
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch {
    throw new ConferenceApiError('No se pudo conectar con el backend del congreso.')
  }

  if (response.status === 204) {
    return undefined
  }
  const payload = response.headers.get('Content-Type')?.includes('application/json')
    ? await response.json()
    : null
  if (!response.ok || payload?.status !== 'success') {
    throw new ConferenceApiError(
      payload?.mensaje ?? 'El backend del congreso no pudo completar la solicitud.',
      response.status
    )
  }
  return payload.data
}

const sessionsPath = '/usuarios/sesiones'

export async function startCommitteeSession(email, password, remember) {
  const bytes = new TextEncoder().encode(`${email}:${password}`)
  const basic = btoa(Array.from(bytes, byte => String.fromCharCode(byte)).join(''))
  try {
    return await requestConference(sessionsPath, {
      method: 'POST',
      headers: { Authorization: `Basic ${basic}` },
      body: { recordar: remember },
    })
  } catch (cause) {
    if ([401, 403].includes(cause.status)) {
      return null
    }
    throw cause
  }
}

export async function getCommitteeSession() {
  try {
    return await requestConference(sessionsPath)
  } catch (cause) {
    if (cause.status === 401) {
      return null
    }
    throw cause
  }
}

export function endCommitteeSession() {
  return requestConference(sessionsPath, { method: 'DELETE' })
}
