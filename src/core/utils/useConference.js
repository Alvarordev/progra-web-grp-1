import { useCallback, useEffect, useRef, useState } from 'react'
import { getActiveAccount } from './accounts.js'
import {
  criteriaRepository,
  decisionsRepository,
  editionRepository,
  editionStatusRepository,
  programRepository,
  reviewersRepository,
  reviewsRepository,
  scheduleRepository,
  thematicAxesRepository,
  workTypesRepository,
  worksRepository,
} from './repositories.js'

const repositories = {
  edition: editionRepository,
  works: worksRepository,
  reviewers: reviewersRepository,
  reviews: reviewsRepository,
  decisions: decisionsRepository,
  program: programRepository,
  criteria: criteriaRepository,
  status: editionStatusRepository,
  schedule: scheduleRepository,
  axes: thematicAxesRepository,
  types: workTypesRepository,
}
const initialData = {
  edition: {},
  works: [],
  reviewers: [],
  reviews: {},
  decisions: {},
  program: { sessions: [], assignments: [], published: false },
  criteria: [],
  status: '',
  schedule: {},
  axes: [],
  types: [],
  account: null,
}

export default function useConference() {
  const [data, setData] = useState(initialData)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const active = useRef(false)
  const pending = useRef(false)

  const refresh = useCallback(async () => {
    const entries = await Promise.all(
      Object.entries(repositories).map(async ([key, repository]) => [
        key,
        await repository.get(),
      ])
    )
    const account = await getActiveAccount()
    const next = { ...Object.fromEntries(entries), account }
    if (active.current) {
      setData(next)
    }
    return next
  }, [])

  useEffect(() => {
    active.current = true
    refresh()
      .catch(cause => {
        if (active.current) {
          setError(cause.message)
        }
      })
      .finally(() => {
        if (active.current) {
          setLoading(false)
        }
      })
    return () => {
      active.current = false
    }
  }, [refresh])

  async function save(key, value) {
    if (loading || pending.current) {
      throw new Error('Espere a que termine la operación actual.')
    }
    pending.current = true
    setSaving(true)
    setError('')
    try {
      if (key === 'program' && data.program.published && !value.publishedSnapshot) {
        value = {
          ...value,
          publishedSnapshot: structuredClone({
            sessions: data.program.sessions,
            assignments: data.program.assignments,
          }),
        }
      }
      const result = await repositories[key].save(value)
      await refresh()
      return result
    } catch (cause) {
      setError(cause.message)
      throw cause
    } finally {
      pending.current = false
      if (active.current) {
        setSaving(false)
      }
    }
  }

  return {
    ...data,
    loading,
    saving,
    error,
    save,
    refresh,
    busy: loading || saving || Boolean(error),
  }
}
