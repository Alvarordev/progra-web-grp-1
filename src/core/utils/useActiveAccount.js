import { useEffect, useState } from 'react'
import { getActiveAccount } from './accounts.js'

export default function useActiveAccount() {
  const [participant, setParticipant] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function loadAccount() {
      try {
        const account = await getActiveAccount()
        if (active) setParticipant(account)
      } catch (cause) {
        if (active) setError(cause.message)
      } finally {
        if (active) setLoading(false)
      }
    }

    loadAccount()
    return () => { active = false }
  }, [])

  return { participant, loading, error }
}
