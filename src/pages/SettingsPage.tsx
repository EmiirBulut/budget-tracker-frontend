import ChangePasswordForm from '../features/settings/components/ChangePasswordForm'
import ProfileForm from '../features/settings/components/ProfileForm'
import styles from './SettingsPage.module.css'

function SettingsPage() {
  return (
    <main className={styles.page}>
      <div>
        <h1 className={styles.title}>Settings</h1>
        <p className={styles.description}>Manage your profile and account security.</p>
      </div>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Profile</h2>
        <ProfileForm />
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Change Password</h2>
        <ChangePasswordForm />
      </section>
    </main>
  )
}

export default SettingsPage
