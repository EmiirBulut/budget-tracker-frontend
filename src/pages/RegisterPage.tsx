import RegisterForm from '../features/auth/components/RegisterForm'
import styles from './RegisterPage.module.css'

function RegisterPage() {
  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Create an account</h1>
        <p className={styles.subtitle}>Start tracking your finances today</p>
        <RegisterForm />
      </div>
    </main>
  )
}

export default RegisterPage
