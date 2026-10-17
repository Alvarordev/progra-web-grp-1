export const initialUsers = [
  {
    id: 1,
    nombre: 'Rosa María Quispe Ttito',
    correo: 'rosa.quispe@aloe.ulima.edu.pe',
    rol: 'Autor',
    femenino: true,
    institucion: 'Universidad de Lima',
    actividad: '4 trabajos',
    bloqueado: false,
  },
  {
    id: 2,
    nombre: 'Mg. Luis Ramírez Cárdenas',
    correo: 'luis.ramirez@ulima.edu.pe',
    rol: 'Revisor',
    femenino: false,
    institucion: 'Universidad de Lima',
    actividad: '6 revisiones',
    bloqueado: false,
  },
  {
    id: 3,
    nombre: 'Dra. Ana Salazar Bermúdez',
    correo: 'ana.salazar@ulima.edu.pe',
    rol: 'Comité',
    femenino: true,
    institucion: 'Universidad de Lima',
    actividad: '—',
    bloqueado: false,
  },
  {
    id: 4,
    nombre: 'Diego Alonso Chávez Manrique',
    correo: 'diego.chavez@aloe.ulima.edu.pe',
    rol: 'Autor',
    femenino: false,
    institucion: 'Universidad de Lima',
    actividad: '2 trabajos',
    bloqueado: false,
  },
  {
    id: 5,
    nombre: 'Dr. Óscar Nakamura Trigoso',
    correo: 'onakamura@pucp.edu.pe',
    rol: 'Revisor',
    femenino: false,
    institucion: 'Pontificia Universidad Católica',
    actividad: '2 revisiones',
    bloqueado: false,
  },
  {
    id: 6,
    nombre: 'Ing. Jorge Palomino Ávila',
    correo: 'jorge.palomino@ulima.edu.pe',
    rol: 'Revisor',
    femenino: false,
    institucion: 'Universidad de Lima',
    actividad: '5 revisiones · 2 vencidas',
    bloqueado: true,
  },
  {
    id: 7,
    nombre: 'Sofía Bustamante León',
    correo: 'sofia.bustamante@aloe.ulima.edu.pe',
    rol: 'Autor',
    femenino: true,
    institucion: 'Universidad de Lima',
    actividad: '1 trabajo',
    bloqueado: false,
  },
  {
    id: 8,
    nombre: 'Mg. Carmen Effio Vargas',
    correo: 'carmen.effio@ulima.edu.pe',
    rol: 'Revisor',
    femenino: true,
    institucion: 'Universidad de Lima',
    actividad: '4 revisiones',
    bloqueado: false,
  },
  {
    id: 9,
    nombre: 'Mg. Renzo Bustamante Loayza',
    correo: 'renzo.bustamante@up.edu.pe',
    rol: 'Revisor',
    femenino: false,
    institucion: 'Universidad del Pacífico',
    actividad: '3 revisiones',
    bloqueado: false,
  },
  {
    id: 10,
    nombre: 'Dra. Milagros Yupanqui Ríos',
    correo: 'milagros.yupanqui@ulima.edu.pe',
    rol: 'Revisor',
    femenino: true,
    institucion: 'Universidad de Lima',
    actividad: '3 revisiones',
    bloqueado: false,
  },
]

export function validateUsers(value) {
  return (
    Array.isArray(value) &&
    value.every(
      user =>
        user !== null &&
        Number.isInteger(user.id) &&
        typeof user.nombre === 'string' &&
        Boolean(user.nombre.trim()) &&
        typeof user.correo === 'string' &&
        Boolean(user.correo.trim()) &&
        ['Autor', 'Revisor', 'Ambos', 'Comité'].includes(user.rol) &&
        typeof user.femenino === 'boolean' &&
        typeof user.institucion === 'string' &&
        typeof user.actividad === 'string' &&
        typeof user.bloqueado === 'boolean' &&
        (user.motivoBloqueo === undefined || typeof user.motivoBloqueo === 'string')
    ) &&
    new Set(value.map(user => user.id)).size === value.length
  )
}
