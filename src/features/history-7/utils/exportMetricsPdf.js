/* Genera y descarga el PDF del tablero de métricas.
   Dibuja el reporte directamente con jsPDF (texto y formas vectoriales), de modo
   que el resultado es nítido y no depende de las variables CSS ni del tamaño de pantalla.
   jsPDF se carga bajo demanda: solo se descarga cuando se pulsa "Exportar reporte".
   Requiere:  npm install jspdf */

const COLORS = {
  primary: [122, 34, 49],
  primarySoft: [246, 233, 236],
  text: [38, 33, 34],
  muted: [111, 102, 98],
  border: [221, 213, 205],
  surface: [255, 255, 255],
  bg: [250, 247, 242],
  success: [29, 126, 77],
  danger: [180, 50, 42],
  warning: [182, 120, 31],
  info: [38, 99, 160],
}

/* Color del texto del valor de cada indicador, según su "tono" en congressData. */
const TONE_COLORS = {
  info: COLORS.text,
  success: COLORS.success,
  accent: COLORS.primary,
  warning: COLORS.warning,
  danger: COLORS.danger,
}

/* Color de cada segmento del gráfico de estado (las variables CSS no existen en el PDF). */
const STATUS_COLORS = {
  Aceptado: COLORS.success,
  Rechazado: COLORS.danger,
  'En revisión': COLORS.warning,
  Borrador: COLORS.muted,
}

const PAGE = { width: 595.28, height: 841.89, margin: 40 }

function setFill(doc, color) {
  doc.setFillColor(color[0], color[1], color[2])
}

function setDraw(doc, color) {
  doc.setDrawColor(color[0], color[1], color[2])
}

function setText(doc, color) {
  doc.setTextColor(color[0], color[1], color[2])
}

function drawCard(doc, x, y, width, height) {
  setFill(doc, COLORS.surface)
  setDraw(doc, COLORS.border)
  doc.setLineWidth(0.8)
  doc.rect(x, y, width, height, 'FD')
}

function drawHeader(doc) {
  setFill(doc, COLORS.primary)
  doc.rect(0, 0, PAGE.width, 62, 'F')

  setFill(doc, [168, 124, 46])
  doc.rect(PAGE.margin, 16, 30, 30, 'F')
  doc.setFont('times', 'bold')
  doc.setFontSize(18)
  setText(doc, [255, 255, 255])
  doc.text('C', PAGE.margin + 15, 37, { align: 'center' })

  doc.setFont('times', 'bold')
  doc.setFontSize(14)
  doc.text('Congreso Académico Estudiantil', PAGE.margin + 42, 28)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.5)
  doc.text('UNIVERSIDAD DE LIMA · EDICIÓN 2026', PAGE.margin + 42, 41)
}

function drawKpis(doc, indicadores, y) {
  const gap = 10
  const width = (PAGE.width - PAGE.margin * 2 - gap * (indicadores.length - 1)) / indicadores.length
  const height = 78

  indicadores.forEach((item, index) => {
    const x = PAGE.margin + index * (width + gap)
    drawCard(doc, x, y, width, height)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7)
    setText(doc, COLORS.muted)
    doc.text(item.etiqueta.toUpperCase(), x + 10, y + 16, { maxWidth: width - 20 })

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(26)
    setText(doc, TONE_COLORS[item.tono] ?? COLORS.text)
    doc.text(String(item.valor), x + 10, y + 46)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7.5)
    setText(doc, COLORS.muted)
    doc.text(item.detalle, x + 10, y + 64, { maxWidth: width - 20 })
  })

  return y + height
}

function drawBarChart(doc, titulo, datos, y) {
  const x = PAGE.margin
  const width = PAGE.width - PAGE.margin * 2
  const rowHeight = 30
  const height = 52 + datos.length * rowHeight
  drawCard(doc, x, y, width, height)

  doc.setFont('times', 'bold')
  doc.setFontSize(13)
  setText(doc, COLORS.text)
  doc.text(titulo, x + 16, y + 28)

  const labelWidth = 190
  const valueWidth = 30
  const trackX = x + 16 + labelWidth
  const trackWidth = width - 32 - labelWidth - valueWidth
  const max = Math.max(...datos.map((item) => item.value), 1)

  datos.forEach((item, index) => {
    const rowY = y + 52 + index * rowHeight

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    setText(doc, COLORS.text)
    doc.text(item.label, x + 16, rowY + 11)

    setFill(doc, COLORS.primarySoft)
    doc.rect(trackX, rowY, trackWidth, 15, 'F')
    setFill(doc, COLORS.primary)
    doc.rect(trackX, rowY, (trackWidth * item.value) / max, 15, 'F')

    doc.setFont('helvetica', 'bold')
    setText(doc, COLORS.text)
    doc.text(String(item.value), x + width - 16, rowY + 11, { align: 'right' })
  })

  return y + height
}

/* Sector de anillo como polígono (jsPDF no dibuja arcos rellenos). */
function ringSegmentPoints(cx, cy, outer, inner, startAngle, endAngle) {
  const steps = Math.max(4, Math.ceil(((endAngle - startAngle) / (Math.PI * 2)) * 90))
  const points = []

  for (let step = 0; step <= steps; step += 1) {
    const angle = startAngle + ((endAngle - startAngle) * step) / steps
    points.push([cx + outer * Math.cos(angle), cy + outer * Math.sin(angle)])
  }
  for (let step = steps; step >= 0; step -= 1) {
    const angle = startAngle + ((endAngle - startAngle) * step) / steps
    points.push([cx + inner * Math.cos(angle), cy + inner * Math.sin(angle)])
  }

  return points
}

function drawDonutChart(doc, titulo, datos, nota, y) {
  const x = PAGE.margin
  const width = PAGE.width - PAGE.margin * 2
  const height = 210
  drawCard(doc, x, y, width, height)

  doc.setFont('times', 'bold')
  doc.setFontSize(13)
  setText(doc, COLORS.text)
  doc.text(titulo, x + 16, y + 28)

  const total = datos.reduce((sum, item) => sum + item.value, 0)
  const cx = x + 100
  const cy = y + 118
  const outer = 62
  const inner = 38
  let angle = -Math.PI / 2

  datos.forEach((item) => {
    if (item.value <= 0) return
    const sweep = (item.value / total) * Math.PI * 2
    const points = ringSegmentPoints(cx, cy, outer, inner, angle, angle + sweep)
    const [first, ...rest] = points
    const color = STATUS_COLORS[item.label] ?? COLORS.muted
    setFill(doc, color)
    setDraw(doc, COLORS.surface)
    doc.setLineWidth(1.2)
    doc.lines(
      rest.map((point, index) => [
        point[0] - (index === 0 ? first[0] : rest[index - 1][0]),
        point[1] - (index === 0 ? first[1] : rest[index - 1][1]),
      ]),
      first[0],
      first[1],
      [1, 1],
      'FD',
      true,
    )
    angle += sweep
  })

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(20)
  setText(doc, COLORS.text)
  doc.text(String(total), cx, cy + 3, { align: 'center' })
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.5)
  setText(doc, COLORS.muted)
  doc.text('trabajos', cx, cy + 14, { align: 'center' })

  /* Leyenda: el valor siempre va escrito, el color no es el único portador. */
  const legendX = x + 230
  datos.forEach((item, index) => {
    const rowY = y + 62 + index * 24
    setFill(doc, STATUS_COLORS[item.label] ?? COLORS.muted)
    doc.rect(legendX, rowY - 8, 10, 10, 'F')
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    setText(doc, COLORS.text)
    doc.text(`${item.label} · ${item.value}`, legendX + 18, rowY)
    doc.setFontSize(9)
    setText(doc, COLORS.muted)
    doc.text(
      `${Math.round((item.value / total) * 100)} %`,
      x + width - 16,
      rowY,
      { align: 'right' },
    )
  })

  setDraw(doc, COLORS.border)
  doc.setLineWidth(0.6)
  doc.line(legendX, y + height - 46, x + width - 16, y + height - 46)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  setText(doc, COLORS.muted)
  doc.text(nota, legendX, y + height - 32, { maxWidth: width - 246 })

  return y + height
}

function drawFooter(doc) {
  const generated = new Date().toLocaleString('es-PE', {
    dateStyle: 'short',
    timeStyle: 'short',
  })

  setDraw(doc, COLORS.border)
  doc.setLineWidth(0.6)
  doc.line(PAGE.margin, PAGE.height - 44, PAGE.width - PAGE.margin, PAGE.height - 44)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  setText(doc, COLORS.muted)
  doc.text(
    'Congreso Académico Estudiantil · Facultad de Ingeniería · Universidad de Lima',
    PAGE.margin,
    PAGE.height - 30,
  )
  doc.text(`Generado el ${generated}`, PAGE.width - PAGE.margin, PAGE.height - 30, {
    align: 'right',
  })
}

export async function exportMetricsPdf({
  titulo,
  descripcion,
  indicadores,
  trabajosPorEje,
  tituloEjes,
  trabajosPorEstado,
  tituloEstados,
  notaEstados,
}) {
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })

  setFill(doc, COLORS.bg)
  doc.rect(0, 0, PAGE.width, PAGE.height, 'F')
  drawHeader(doc)

  doc.setFont('times', 'bold')
  doc.setFontSize(22)
  setText(doc, COLORS.text)
  doc.text(titulo, PAGE.margin, 100)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9.5)
  setText(doc, COLORS.muted)
  doc.text(descripcion, PAGE.margin, 117)

  let y = drawKpis(doc, indicadores, 134)
  y = drawBarChart(doc, tituloEjes, trabajosPorEje, y + 16)
  drawDonutChart(doc, tituloEstados, trabajosPorEstado, notaEstados, y + 16)
  drawFooter(doc)

  doc.setProperties({ title: `${titulo} · Edición 2026` })
  doc.save('tablero-de-metricas-2026.pdf')
}
