import { isInstitutionalEmail, requiresAcademicDetails } from '../../../core/utils/states/participantState.js'
import { getPasswordRequirements } from '../../../core/utils/passwords.js'

export const initialRegistrationForm = {
  names: 'Rosa María', surnames: 'Quispe Ttito', email: 'rosa.quispe@aloe.ulima.edu.pe',
  institution: 'Universidad de Lima', password: 'Segura2026', confirmPassword: 'Segura2026',
  role: 'author', degree: 'Ingeniería de Sistemas', studentCode: '20211547', acceptedTerms: false,
}

export function validateRegistrationForm(form) {
  const errors = {}
  if (!form.names.trim()) errors.names = 'Este campo es obligatorio.'
  if (!form.surnames.trim()) errors.surnames = 'Este campo es obligatorio.'
  if (!isInstitutionalEmail(form.email)) errors.email = 'Use un correo institucional válido (@ulima.edu.pe o @aloe.ulima.edu.pe).'
  if (!form.institution) errors.institution = 'Seleccione una institución.'
  if (!getPasswordRequirements(form.password).every(item => item.valid)) errors.password = 'Mínimo 8 caracteres, con una mayúscula y un número.'
  if (form.password !== form.confirmPassword) errors.confirmPassword = 'Las contraseñas no coinciden.'
  if (!['author', 'reviewer', 'both'].includes(form.role)) errors.role = 'Seleccione un rol.'
  if (requiresAcademicDetails(form.role)) {
    if (!form.degree.trim()) errors.degree = 'Seleccione su carrera.'
    if (!/^[0-9]+$/.test(form.studentCode.trim())) errors.studentCode = 'Ingrese su código de alumno, solo con números.'
  }
  if (!form.acceptedTerms) errors.acceptedTerms = 'Debe aceptar las bases y el tratamiento de sus datos.'
  return errors
}

export function getRegistrationPasswordRequirements(form) {
  return [
    ...getPasswordRequirements(form.password),
    { label: 'La confirmación debe coincidir', valid: Boolean(form.confirmPassword) && form.password === form.confirmPassword },
  ]
}

export function getRegistrationParticipant(form) {
  const email = form.email.trim().toLowerCase()
  const names = form.names.trim()
  const surnames = form.surnames.trim()
  return {
    userId: `participant:${email}`, names, surnames, name: `${names} ${surnames}`, email,
    institution: form.institution,
    role: form.role,
    degree: requiresAcademicDetails(form.role) ? form.degree.trim() : '',
    studentCode: requiresAcademicDetails(form.role) ? form.studentCode.trim() : '',
    acceptedTerms: form.acceptedTerms,
  }
}
