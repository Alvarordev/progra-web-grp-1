export function splitAccountName(fullName) {
  const parts = fullName
    .replace(/^(Mg\.|Dra?\.|Ing\.)\s*/, '')
    .trim()
    .split(/\s+/)
  const surnameCount = parts.length > 2 ? 2 : 1
  return {
    names: parts.length > 1 ? parts.slice(0, -surnameCount).join(' ') : parts[0],
    surnames: parts.slice(-surnameCount).join(' '),
  }
}
