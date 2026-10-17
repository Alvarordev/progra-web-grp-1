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

export const sampleWork = {
  titulo: 'Predicción de deserción universitaria mediante aprendizaje supervisado',
  tipo: 'Artículo completo',
  eje: 'Inteligencia artificial y datos',
  resumen:
    'Se evalúan tres modelos supervisados para anticipar el abandono de estudios en una universidad privada de Lima, usando registros académicos de cinco cohortes.',
  palabrasClave: ['deserción universitaria', 'aprendizaje supervisado', 'analítica educativa'],
  enlace: 'https://drive.ulima.edu.pe/trb-2026-058/articulo.pdf',
}

export const works = [
  {
    codigo: 'TRB-2026-042',
    titulo: 'Predicción de deserción universitaria mediante aprendizaje supervisado',
    tipo: 'Artículo completo',
    eje: 'Inteligencia artificial y datos',
    estado: 'revision',
    estadoLectura: 'enviado',
    firmantes: 'Rosa Quispe Ttito, Diego Chávez Manrique, Milagros Yupanqui Ríos',
    fecha: 'Enviado el 22/09/2026',
    enviado: '22/09/2026',
    hora: '21:15',
    resumen:
      'Se evalúan tres modelos supervisados para anticipar el abandono de estudios en una universidad privada de Lima, usando registros académicos de cinco cohortes y variables socioeconómicas declaradas en la matrícula.',
    palabrasClave: ['deserción universitaria', 'aprendizaje supervisado', 'analítica educativa'],
    enlace: 'https://drive.ulima.edu.pe/trb-2026-042/articulo.pdf',
    autores: [
      { nombre: 'Rosa María Quispe Ttito', institucion: 'Universidad de Lima', rol: 'Autora de correspondencia', correspondencia: true },
      { nombre: 'Diego Alonso Chávez Manrique', institucion: 'Universidad de Lima', rol: 'Coautor' },
      { nombre: 'Milagros Yupanqui Ríos', institucion: 'Universidad de Lima', rol: 'Coautora' },
    ],
    seguimiento: [
      { paso: 'Enviado al comité', fecha: '22/09/2026 · 21:15', estado: 'hecho' },
      { paso: 'Revisores asignados', fecha: '02/10/2026 · 09:40', estado: 'hecho' },
      { paso: 'Revisión en curso · 2 de 3 entregadas', fecha: 'actualizado el 12/10/2026', estado: 'actual' },
      { paso: 'Publicación de resultados', fecha: '28/10/2026', estado: 'pendiente' },
    ],
    queSigue: 'El comité asignará revisores. Recibirá un correo cuando se publique la decisión, el 28/10/2026.',
  },
  {
    codigo: 'TRB-2026-051',
    titulo: 'Evaluación del uso de agua reciclada en riego de áreas verdes del campus',
    tipo: 'Resumen extendido',
    eje: 'Sostenibilidad y ciudad',
    estado: 'aceptado',
    firmantes: 'Rosa Quispe Ttito, Sofía Bustamante León',
    fecha: 'Dictamen publicado el 28/10/2026',
    resumen:
      'Se evalúa el uso de agua tratada para el riego de las áreas verdes del campus, comparando el consumo, el costo por metro cúbico y la calidad del suelo durante dos temporadas.',
    palabrasClave: ['agua reciclada', 'riego', 'campus sostenible'],
    enlace: 'https://drive.ulima.edu.pe/trb-2026-051/resumen.pdf',
    autores: [
      { nombre: 'Rosa María Quispe Ttito', institucion: 'Universidad de Lima', rol: 'Autora de correspondencia', correspondencia: true },
      { nombre: 'Sofía Bustamante León', institucion: 'Universidad de Lima', rol: 'Coautora' },
    ],
    dictamen: {
      resultado: 'aceptado',
      publicado: '28/10/2026',
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
    firmantes: 'Diego Chávez Manrique, Rosa Quispe Ttito',
    fecha: 'Dictamen publicado el 28/10/2026',
    enviado: '28/09/2026',
    resumen:
      'Se propone un tablero de indicadores para monitorear la recolección y disposición de residuos sólidos en el distrito de Santiago de Surco.',
    palabrasClave: ['residuos sólidos', 'indicadores', 'gestión municipal'],
    enlace: 'https://drive.ulima.edu.pe/trb-2026-057/caso.pdf',
    autores: [
      { nombre: 'Diego Alonso Chávez Manrique', institucion: 'Universidad de Lima', rol: 'Autor de correspondencia', correspondencia: true },
      { nombre: 'Rosa María Quispe Ttito', institucion: 'Universidad de Lima', rol: 'Coautora' },
    ],
    dictamen: {
      resultado: 'rechazado',
      publicado: '28/10/2026',
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
    estadoLectura: 'borrador',
    firmantes: 'Rosa Quispe Ttito',
    fecha: 'No enviado · la recepción ya cerró',
    noEnviado: true,
    resumen:
      'Se entrena un clasificador de texto para ordenar por categoría los reclamos vecinales recibidos por una municipalidad de Lima.',
    palabrasClave: ['procesamiento de texto', 'reclamos vecinales', 'clasificación'],
    enlace: 'https://drive.ulima.edu.pe/trb-2026-058/poster.pdf',
    autores: [
      { nombre: 'Rosa María Quispe Ttito', institucion: 'Universidad de Lima', rol: 'Autora de correspondencia', correspondencia: true },
    ],
    queSigue: 'El trabajo no se envió antes del cierre, por lo que no participa en la revisión de esta edición.',
  },
]

