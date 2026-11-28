export const esCorreoInstitucional = correo =>
  /^[^\s@]+@(?:aloe\.)?ulima\.edu\.pe$/.test(String(correo).trim().toLowerCase())
