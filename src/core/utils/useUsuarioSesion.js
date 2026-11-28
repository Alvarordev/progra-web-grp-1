import useActiveAccount from './useActiveAccount.js'

const etiquetasRol = {
  author: 'Rol: Autor',
  reviewer: 'Rol: Revisor',
  both: 'Rol: Autor y revisor',
  committee: 'Rol: Comité organizador',
}

const primeraLetra = texto =>
  texto
    .trim()
    .split(/\s+/)
    .find(palabra => !palabra.endsWith('.'))?.[0] ?? ''

export function obtenerUsuarioVisible(cuenta) {
  return {
    nombre: cuenta.name,
    iniciales: `${primeraLetra(cuenta.names)}${primeraLetra(cuenta.surnames)}`.toUpperCase(),
    rol: etiquetasRol[cuenta.role] ?? etiquetasRol.author,
  }
}

export default function useUsuarioSesion() {
  const { participant } = useActiveAccount()
  return participant ? obtenerUsuarioVisible(participant) : null
}
