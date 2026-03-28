import { Card, Typography } from 'antd'
import LoginForm from '../features/auth/components/LoginForm'
import styles from './LoginPage.module.css'

const { Title, Text } = Typography

function LoginPage() {
  return (
    <main className={styles.page}>
      <div className={styles.cardWrapper}>
        <Card>
          <Title level={3}>Welcome back</Title>
          <Text type="secondary">Sign in to your account</Text>
          <LoginForm />
        </Card>
      </div>
    </main>
  )
}

export default LoginPage
