import useActiveAccount from './useActiveAccount.js'

const usuarioPorDefecto = {
  iniciales: 'CO',
  nombre: 'Comité organizador',
  rol: 'Rol: Comité organizador',
}

export default function useUsuarioComite() {
  const { participant } = useActiveAccount()
  if (participant?.role !== 'committee') {
    return usuarioPorDefecto
  }
  const inicialNombre = participant.names?.trim()?.[0] ?? 'C'
  const inicialApellido = participant.surnames?.trim()?.[0] ?? 'O'
  return {
    iniciales: `${inicialNombre}${inicialApellido}`.toUpperCase(),
    nombre: participant.name,
    rol: 'Rol: Comité organizador',
  }
}
