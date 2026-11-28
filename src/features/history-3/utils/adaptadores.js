import { toSubmission } from '../../../core/utils/submissions.js'

// Pasa un trabajo que llega del backend al formato que ya usan las pantallas
// de la Historia 3  // Asi las tarjetas, el detalle y el modo lectura no cambian.
export function aTrabajoLocal(trabajo, decision) {
  const fechaEnvio = trabajo.fechaEnvio ? new Date(trabajo.fechaEnvio) : null
  const enviado = fechaEnvio ? fechaEnvio.toLocaleDateString('es-PE') : ''
  const esBorrador = trabajo.estado === 'Borrador'
  let fecha = 'Enviado al comité'
  if (esBorrador) {
    fecha = 'Borrador guardado'
  } else if (enviado) {
    fecha = `Enviado el ${enviado}`
  }
  const autores = trabajo.autores.map(autor => ({
    ...autor,
    rol: autor.correspondencia ? 'Autor de correspondencia' : 'Coautor',
  }))

  const local = toSubmission(
    {
      codigo: trabajo.codigo,
      titulo: trabajo.titulo,
      tipo: trabajo.tipo,
      eje: trabajo.eje,
      estado: trabajo.estado,
      documentUrl: trabajo.enlace,
      autores: autores.map(autor => autor.nombre),
      details: {
        resumen: trabajo.resumen,
        palabrasClave: trabajo.palabrasClave,
        autores,
        enviado,
        hora: fechaEnvio
          ? fechaEnvio.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })
          : '',
        fecha,
        noEnviado: esBorrador,
        queSigue: !esBorrador
          ? 'El comité revisará el trabajo y publicará el dictamen en esta página.'
          : 'El borrador no fue enviado al comité y no participa en la revisión.',
      },
    },
    decision
  )

  // Se guarda el id de forma numérica porque el backend lo pide para editar (PUT)
  return {
    ...local,
    // Un borrador sin enlace no debe mostrar el documento de ejemplo de las maquetas
    enlace: trabajo.enlace ?? '',
    enlaceFinal: trabajo.enlaceFinal ?? '',
    actualizadoEn: trabajo.actualizadoEn,
    id: trabajo.id,
    // Solo quien registró el trabajo lo edita o sube su versión final; los coautores lo consultan
    titular: trabajo.titular,
    editable: trabajo.editable,
  }
}

// Arma el cuerpo que esperan POST y PUT /api/trabajos a partir del formulario.
// El backend pide el id del tipo y del eje, asi que se buscan por su nombre.
export function aCuerpoTrabajo({ trabajo, tipos, ejes, correoAutor, enviar = false }) {
  const tipo = tipos.find(item => item.nombre === trabajo.tipo)
  const eje = ejes.find(item => item.nombre === trabajo.eje)
  const autores = trabajo.autores ?? []

  return {
    estado: enviar ? 'enviado' : 'borrador',
    titulo: trabajo.titulo,
    tipoId: tipo ? Number(tipo.id) : null,
    ejeId: eje ? Number(eje.id) : null,
    resumen: trabajo.resumen,
    palabrasClave: trabajo.palabrasClave,
    enlace: trabajo.enlace,
    // El autor que registra el trabajo lo agrega el backend --> aquí van solo los coautores
    coautores: autores
      .filter(autor => autor.correo !== correoAutor)
      .map(({ nombre, correo, institucion }) => ({ nombre, correo, institucion })),
    correspondencia: autores.find(autor => autor.correspondencia)?.correo,
  }
}
