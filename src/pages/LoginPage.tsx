import { Card, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import LoginForm from '../features/auth/components/LoginForm'
import styles from './LoginPage.module.css'

const { Title, Text } = Typography

function LoginPage() {
  const { t } = useTranslation()
  return (
    <main className={styles.page}>
      <div className={styles.cardWrapper}>
        <Card>
          <Title level={3}>{t('auth.welcomeBack')}</Title>
          <Text type="secondary">{t('auth.signInSubtitle')}</Text>
          <LoginForm />
        </Card>
      </div>
    </main>
  )
}

export default LoginPage
