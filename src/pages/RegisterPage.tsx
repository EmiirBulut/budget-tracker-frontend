import { Card, Typography } from 'antd'
import RegisterForm from '../features/auth/components/RegisterForm'
import styles from './RegisterPage.module.css'

const { Title, Text } = Typography

function RegisterPage() {
  return (
    <main className={styles.page}>
      <div className={styles.cardWrapper}>
        <Card>
          <Title level={3}>Create an account</Title>
          <Text type="secondary">Start tracking your finances today</Text>
          <RegisterForm />
        </Card>
      </div>
    </main>
  )
}

export default RegisterPage
