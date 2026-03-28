import LoginForm from '../features/auth/components/LoginForm'
import styles from './LoginPage.module.css'

function LoginPage() {
  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Welcome back</h1>
        <p className={styles.subtitle}>Sign in to your account</p>
        <LoginForm />
      </div>
    </main>
  )
}

export default LoginPage
