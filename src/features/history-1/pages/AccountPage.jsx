import { useState } from 'react'
import { Link, Navigate, useOutletContext } from 'react-router'
import Header from '../../../core/ui/Header/Header.jsx'
import Footer from '../../../core/ui/Footer/Footer.jsx'
import ReviewerNavigation from '../../../core/ui/ReviewerNavigation/ReviewerNavigation.jsx'
import AuthorNavigation from '../../../core/ui/AuthorNavigation/AuthorNavigation.jsx'
import Button from '../../../core/ui/Button/Button.jsx'
import useStoredState from '../../../core/utils/useStoredState.js'
import useReviewerProfile from '../../../core/utils/useReviewerProfile.js'
import { reviewsRepository, thematicAxesRepository } from '../../../core/utils/repositories.js'
import { getReviewerAssignments } from '../../../core/utils/reviewerAssignments.js'
import { getReviewerUser } from '../../../core/utils/states/reviewerProfilesState.js'
import AccountSettings from '../components/AccountSettings/AccountSettings.jsx'
import ReviewerActivity from '../components/ReviewerActivity/ReviewerActivity.jsx'
import ChangePasswordPanel from '../components/ChangePasswordPanel/ChangePasswordPanel.jsx'
import RegistrationNotice from '../components/RegistrationNotice/RegistrationNotice.jsx'
import styles from './AccountPage.module.css'

function AccountPage() {
  const participant = useOutletContext()
  const profileState = useReviewerProfile()
  const isReviewer = ['reviewer', 'both'].includes(participant.role)
  const axesState = useStoredState(thematicAxesRepository, [], isReviewer)
  const reviewsState = useStoredState(reviewsRepository, {}, isReviewer)
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [notice, setNotice] = useState('')
  const [saveError, setSaveError] = useState('')
  const loading = profileState.loading || (isReviewer && (axesState.loading || reviewsState.loading))
  const loadError = profileState.error || (isReviewer ? axesState.error || reviewsState.error : '')
  const blocked = loading || Boolean(loadError) || profileState.saving || passwordSaving
  const assignments = getReviewerAssignments(reviewsState.value, profileState.reviewerId)
  const user = {
    ...getReviewerUser(profileState.loading ? participant : profileState.profile),
    rol: participant.role === 'both' ? 'Rol: Autor y revisor' : isReviewer ? 'Rol: Revisor' : 'Rol: Autor',
  }

  async function handleSave(profile) {
    if (blocked) return
    setNotice('')
    setSaveError('')
    try {
      await profileState.save(profile)
      setNotice(isReviewer ? 'Datos personales y líneas de interés guardados en este navegador.' : 'Datos personales guardados en este navegador.')
    } catch (cause) {
      setSaveError(cause.message)
    }
  }

  if (!loading && !loadError && !profileState.session) {
    return <Navigate replace to="/iniciar-sesion" />
  }

  return (
    <div className={styles.page}>
      <Header estado={isReviewer ? 'En revisión' : 'Recepción abierta'} />
      {isReviewer
        ? <ReviewerNavigation rutaActiva="/mi-cuenta" usuario={user} />
        : <AuthorNavigation rutaActiva="/autor/cuenta" usuario={user} />}
      <main className={styles.main}>
        <div className={styles.heading}>
          <div>
            <h1>Mi cuenta</h1>
            <p>{isReviewer ? 'Datos personales, líneas de interés y seguridad.' : 'Datos personales y seguridad.'}</p>
          </div>
          <Button disabled={blocked} form="account-settings-form" loading={profileState.saving} type="submit">Guardar cambios</Button>
        </div>
        {loading && <p role="status">Cargando su cuenta y actividad…</p>}
        <RegistrationNotice />
        {!loading && profileState.session?.role === 'both' && <p><Link to="/autor">Ir a mi vista de autor</Link></p>}
        {(loadError || saveError) && <p className={styles.error} role="alert">{loadError || saveError}</p>}
        {notice && <p className={styles.success} role="status">✓ {notice}</p>}
        {!loading && !loadError && (
          <div className={styles.columns}>
            <AccountSettings alGuardar={handleSave} bloqueado={blocked} ejes={axesState.value} mostrarIntereses={isReviewer} perfil={profileState.profile} />
            <div className={styles.sideColumn}>
              <ChangePasswordPanel alCambiarEstado={setPasswordSaving} bloqueado={profileState.saving} correo={profileState.profile.email} />
              {isReviewer && <ReviewerActivity asignaciones={assignments} />}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}

export default AccountPage
