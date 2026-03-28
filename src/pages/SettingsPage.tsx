import { Card, Col, Row, Typography } from 'antd'
import ChangePasswordForm from '../features/settings/components/ChangePasswordForm'
import ProfileForm from '../features/settings/components/ProfileForm'
import styles from './SettingsPage.module.css'

const { Title, Text } = Typography

function SettingsPage() {
  return (
    <main className={styles.page}>
      <Row>
        <Col>
          <Title level={3} style={{ margin: 0 }}>Settings</Title>
          <Text type="secondary">Manage your profile and account security.</Text>
        </Col>
      </Row>

      <Card title="Profile">
        <ProfileForm />
      </Card>

      <Card title="Change Password">
        <ChangePasswordForm />
      </Card>
    </main>
  )
}

export default SettingsPage
