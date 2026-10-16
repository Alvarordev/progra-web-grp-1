export const authorUser = {
  iniciales: 'RQ',
  nombre: 'Rosa Quispe Ttito',
  rol: 'Rol: Autor',
}

export const workTypes = [
  {
    nombre: 'Artículo completo',
    requisitos: 'Hasta 8 000 palabras · PDF con plantilla IEEE · admite hasta 4 coautores.',
    maxCoautores: 4,
  },
  {
    nombre: 'Resumen extendido',
    requisitos: 'Hasta 2 000 palabras · PDF · admite hasta 3 coautores.',
    maxCoautores: 3,
  },
  {
    nombre: 'Póster',
    requisitos: 'Póster A1 en PDF · admite hasta 3 coautores.',
    maxCoautores: 3,
  },
  {
    nombre: 'Caso de estudio',
    requisitos: 'Hasta 5 000 palabras · PDF · admite hasta 4 coautores.',
    maxCoautores: 4,
  },
]

export const thematicAxes = [
  'Inteligencia artificial y datos',
  'Ingeniería de software',
  'Sostenibilidad y ciudad',
  'Innovación y emprendimiento',
  'Salud y sociedad',
  'Economía y mercados',
]

export const works = [
  {
    codigo: 'TRB-2026-042',
    titulo: 'Predicción de deserción universitaria mediante aprendizaje supervisado',
    tipo: 'Artículo completo',
    eje: 'Inteligencia artificial y datos',
    estado: 'revision',
    fecha: 'Enviado el 22/09/2026',
    resumen:
      'Se evalúan tres modelos supervisados para anticipar el abandono de estudios en una universidad privada de Lima, usando registros académicos de cinco cohortes y variables socioeconómicas declaradas en la matrícula.',
    palabrasClave: ['deserción universitaria', 'aprendizaje supervisado', 'analítica educativa'],
    enlace: 'https://drive.ulima.edu.pe/trb-2026-042/articulo.pdf',
    autores: [
      { nombre: 'Rosa María Quispe Ttito', rol: 'Autora de correspondencia' },
      { nombre: 'Diego Alonso Chávez Manrique', rol: 'Coautor' },
      { nombre: 'Milagros Yupanqui Ríos', rol: 'Coautora' },
    ],
    seguimiento: [
      { paso: 'Enviado al comité', fecha: '22/09/2026 · 21:15', hecho: true },
      { paso: 'Revisores asignados', fecha: '02/10/2026 · 09:40', hecho: true },
      { paso: 'Revisión en curso · 2 de 3 entregadas', fecha: 'Actualizado el 12/10/2026', hecho: true },
      { paso: 'Publicación de resultados', fecha: '28/10/2026', hecho: false },
    ],
  },
  {
    codigo: 'TRB-2026-051',
    titulo: 'Evaluación del uso de agua reciclada en riego de áreas verdes del campus',
    tipo: 'Resumen extendido',
    eje: 'Sostenibilidad y ciudad',
    estado: 'aceptado',
    fecha: 'Dictamen publicado el 28/10/2026',
    resumen:
      'Se evalúa el uso de agua tratada para el riego de las áreas verdes del campus, comparando el consumo, el costo por metro cúbico y la calidad del suelo durante dos temporadas.',
    palabrasClave: ['agua reciclada', 'riego', 'campus sostenible'],
    enlace: 'https://drive.ulima.edu.pe/trb-2026-051/resumen.pdf',
    autores: [
      { nombre: 'Rosa María Quispe Ttito', rol: 'Autora de correspondencia' },
      { nombre: 'Sofía Bustamante León', rol: 'Coautora' },
    ],
    dictamen: {
      titulo: 'Trabajo aceptado para presentación oral',
      detalle:
        'Puntaje promedio 17.4 de 20 · 3 revisores · Sesión asignada: Sostenibilidad y ciudad, 12/11/2026, Sala B-201.',
      puntajes: [
        { criterio: 'Originalidad (25 %)', nota: '17.0' },
        { criterio: 'Rigor metodológico (30 %)', nota: '18.0' },
        { criterio: 'Claridad (20 %)', nota: '17.5' },
        { criterio: 'Relevancia (25 %)', nota: '17.0' },
      ],
      promedio: '17.4',
      revisiones: [
        {
          recomendacion: 'Aceptar',
          comentario:
            'El diseño experimental es sólido y la comparación de costos por metro cúbico está bien sustentada. Recomiendo detallar el protocolo de muestreo del suelo.',
        },
        {
          recomendacion: 'Aceptar con observaciones',
          comentario:
            'Conviene precisar el periodo de medición y añadir la referencia normativa sobre reúso de agua tratada en el país.',
        },
        {
          recomendacion: 'Aceptar',
          comentario:
            'Aporte pertinente para la gestión del campus. Sugiero mejorar la resolución de las figuras 2 y 3 para la versión final.',
        },
      ],
    },
  },
  {
    codigo: 'TRB-2026-057',
    titulo: 'Tablero de indicadores para la gestión de residuos sólidos en Surco',
    tipo: 'Caso de estudio',
    eje: 'Sostenibilidad y ciudad',
    estado: 'rechazado',
    fecha: 'Dictamen publicado el 28/10/2026',
    resumen:
      'Se propone un tablero de indicadores para monitorear la recolección y disposición de residuos sólidos en el distrito de Santiago de Surco.',
    palabrasClave: ['residuos sólidos', 'indicadores', 'gestión municipal'],
    enlace: 'https://drive.ulima.edu.pe/trb-2026-057/caso.pdf',
    autores: [
      { nombre: 'Diego Alonso Chávez Manrique', rol: 'Autor de correspondencia' },
      { nombre: 'Rosa María Quispe Ttito', rol: 'Coautora' },
    ],
    dictamen: {
      titulo: 'Trabajo no aceptado en esta edición',
      detalle:
        'Puntaje promedio 11.8 de 20 · 3 revisores · Puede volver a presentarlo en la siguiente convocatoria atendiendo las observaciones.',
      puntajes: [
        { criterio: 'Originalidad (25 %)', nota: '13.0' },
        { criterio: 'Rigor metodológico (30 %)', nota: '10.0' },
        { criterio: 'Claridad (20 %)', nota: '13.5' },
        { criterio: 'Relevancia (25 %)', nota: '11.5' },
      ],
      promedio: '11.8',
      revisiones: [
        {
          recomendacion: 'Rechazar',
          comentario:
            'El tablero es útil, pero el trabajo no documenta la fuente ni el periodo de los datos municipales empleados.',
        },
        {
          recomendacion: 'Rechazar',
          comentario:
            'Falta una discusión de resultados: se describen los indicadores sin comparar contra una línea base.',
        },
        {
          recomendacion: 'Aceptar con observaciones',
          comentario:
            'La propuesta tiene potencial; con datos verificables y una sección metodológica ampliada podría ser aceptada.',
        },
      ],
    },
  },
  {
    codigo: 'TRB-2026-058',
    titulo: 'Clasificación automática de reclamos vecinales con procesamiento de texto',
    tipo: 'Póster',
    eje: 'Inteligencia artificial y datos',
    estado: 'borrador',
    fecha: 'No enviado · la recepción ya cerró',
    soloLectura: true,
    resumen:
      'Se entrena un clasificador de texto para ordenar por categoría los reclamos vecinales recibidos por una municipalidad de Lima.',
    palabrasClave: ['procesamiento de texto', 'reclamos vecinales', 'clasificación'],
    enlace: 'https://drive.ulima.edu.pe/trb-2026-058/poster.pdf',
    autores: [{ nombre: 'Rosa María Quispe Ttito', rol: 'Autora de correspondencia' }],
  },
]
