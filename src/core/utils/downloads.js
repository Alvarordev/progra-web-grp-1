export function downloadFile(filename, content, type) {
  const url = URL.createObjectURL(new Blob([content], { type }))
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export async function downloadPdf(title, lines, filename) {
  const { jsPDF } = await import('jspdf')
  const pdf = new jsPDF()
  pdf.setFontSize(18)
  pdf.text(title, 18, 22)
  pdf.setFontSize(10)
  let y = 34
  for (const line of lines) {
    for (const part of pdf.splitTextToSize(String(line), 174)) {
      if (y > 278) { pdf.addPage(); y = 20 }
      pdf.text(part, 18, y)
      y += 6
    }
    y += 3
  }
  pdf.save(filename)
}

export function downloadCalendar(work, session, times) {
  const stamp = time => `${session.fecha.replaceAll('-', '')}T${time.replace(':', '')}00`
  const escape = value => String(value).replaceAll('\\', '\\\\').replaceAll('\n', '\\n').replaceAll(',', '\\,').replaceAll(';', '\\;')
  const content = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Congreso ULima//Programa//ES', 'BEGIN:VEVENT', `UID:${work.codigo}@congreso.ulima.edu.pe`, `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+Z$/, 'Z')}`, `DTSTART;TZID=America/Lima:${stamp(times.horaInicio)}`, `DTEND;TZID=America/Lima:${stamp(times.horaFin)}`, `SUMMARY:${escape(work.titulo)}`, `LOCATION:${escape(session.sala)}`, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n')
  downloadFile(`${work.codigo}.ics`, content, 'text/calendar;charset=utf-8')
}
