export const passwordIterations = 210000

export function validateDemoCredentials(value) {
  if (!Array.isArray(value)) return false
  const emails = new Set()

  return value.every(record => {
    if (!record || typeof record !== 'object' || Array.isArray(record)) return false
    const keys = Object.keys(record)
    if (keys.length !== 5 || !keys.every(key => ['email', 'salt', 'hash', 'iterations', 'algorithm'].includes(key))) return false
    if (typeof record.email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(record.email)) return false
    if (record.email !== record.email.trim().toLowerCase() || emails.has(record.email)) return false
    emails.add(record.email)

    return record.algorithm === 'PBKDF2-SHA-256' &&
      record.iterations === passwordIterations &&
      typeof record.salt === 'string' && /^[a-f0-9]{32}$/.test(record.salt) &&
      typeof record.hash === 'string' && /^[a-f0-9]{64}$/.test(record.hash)
  })
}
