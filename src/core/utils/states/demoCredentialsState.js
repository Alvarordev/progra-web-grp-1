export function validateDemoCredentials(value) {
  if (!Array.isArray(value)) {
    return false
  }
  const emails = new Set()

  return value.every(record => {
    if (!record || typeof record !== 'object' || Array.isArray(record)) {
      return false
    }
    const keys = Object.keys(record)
    if (keys.length !== 2 || !keys.includes('email') || !keys.includes('password')) {
      return false
    }
    if (
      typeof record.email !== 'string' ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(record.email)
    ) {
      return false
    }
    if (record.email !== record.email.trim().toLowerCase() || emails.has(record.email)) {
      return false
    }
    emails.add(record.email)

    return typeof record.password === 'string' && record.password !== ''
  })
}
