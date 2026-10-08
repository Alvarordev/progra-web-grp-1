const STORAGE_KEY = 'congreso-academico-revisiones'

export function getSubmittedReviews() {
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '{}')
  } catch {
    return {}
  }
}

export function getSubmittedReview(codigo) {
  return getSubmittedReviews()[codigo] ?? null
}

export function saveSubmittedReview(codigo, review) {
  try {
    const reviews = getSubmittedReviews()
    reviews[codigo] = review
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews))
    return true
  } catch {
    return false
  }
}
