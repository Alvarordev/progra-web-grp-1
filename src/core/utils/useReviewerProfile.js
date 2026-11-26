import { useEffect, useState } from 'react'
import { consultarPerfil, guardarPerfil } from './usuariosApi.js'

const extraerPerfil = datos => ({
  names: datos.names,
  surnames: datos.surnames,
  email: datos.email,
  institution: datos.institution,
  interestIds: datos.interestIds,
})

export default function usePerfilUsuario() {
  const [profile, setProfile] = useState({
    names: '',
    surnames: '',
    email: '',
    institution: '',
    interestIds: [],
  })
  const [session, setSession] = useState(null)
  const [actividad, setActividad] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let activo = true
    consultarPerfil()
      .then(datos => {
        if (!activo) {
          return
        }
        setProfile(extraerPerfil(datos))
        setSession(datos)
        setActividad(datos.actividad)
      })
      .catch(err => {
        if (activo) {
          setError(err.message)
        }
      })
      .finally(() => {
        if (activo) {
          setLoading(false)
        }
      })
    return () => {
      activo = false
    }
  }, [])

  const guardar = async siguiente => {
    if (loading || saving || error) {
      throw new Error('Espere a que termine la operación actual.')
    }
    setSaving(true)
    try {
      const datos = {
        names: siguiente.names,
        surnames: siguiente.surnames,
        institution: siguiente.institution,
      }
      if (['reviewer', 'both'].includes(session.role)) {
        datos.interestIds = siguiente.interestIds
      }
      const actualizado = await guardarPerfil(datos)
      setProfile(extraerPerfil(actualizado))
      setSession(actualizado)
      setActividad(actualizado.actividad)
      return actualizado
    } finally {
      setSaving(false)
    }
  }

  return {
    profile,
    session,
    actividad,
    reviewerId: session?.userId,
    loading,
    saving,
    error,
    save: guardar,
  }
}
