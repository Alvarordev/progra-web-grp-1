export const initialSessionPreferences = { remember: false }

export function validateSessionPreferences(value) {
  return Boolean(value && typeof value === 'object' &&
    Object.keys(value).length === 1 && typeof value.remember === 'boolean')
}
