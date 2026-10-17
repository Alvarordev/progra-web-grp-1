export function getProgramWorks(works, program) {
  return works
    .filter(work => work.estado === 'Aceptado')
    .map(work => {
      const assignment = program.assignments.find(item => item.codigo === work.codigo)
      return {
        codigo: work.codigo,
        titulo: work.titulo,
        eje: work.eje,
        tipoTrabajo: work.tipo,
        autores: work.autores.join(', '),
        ownerId: work.ownerId,
        ownerEmail: work.ownerEmail,
        sesionId: assignment?.sesionId ?? null,
        orden: assignment?.orden ?? null,
      }
    })
}

export function publicProgram(program) {
  if (!program.published) {
    return { sessions: [], assignments: [] }
  }
  return program.publishedSnapshot ?? program
}
