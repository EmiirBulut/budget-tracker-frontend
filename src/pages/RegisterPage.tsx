import { Card, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import RegisterForm from '../features/auth/components/RegisterForm'
import styles from './RegisterPage.module.css'

const { Title, Text } = Typography

function RegisterPage() {
  const { t } = useTranslation()
  return (
    <main className={styles.page}>
      <div className={styles.cardWrapper}>
        <Card>
          <Title level={3}>{t('auth.createAccountTitle')}</Title>
          <Text type="secondary">{t('auth.createAccountSubtitle')}</Text>
          <RegisterForm />
        </Card>
      </div>
    </main>
  )
}

export default RegisterPage
