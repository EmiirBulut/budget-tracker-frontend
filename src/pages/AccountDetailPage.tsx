import { ArrowLeftOutlined } from '@ant-design/icons'
import { Alert, Button, Card, Col, Row, Skeleton, Space, Tag, Typography } from 'antd'
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import EditAccountModal from '../features/accounts/components/EditAccountModal'
import { useAccountDetail } from '../features/accounts/hooks/useAccountDetail'
import { useArchiveAccount } from '../features/accounts/hooks/useArchiveAccount'
import { ACCOUNT_TYPE_LABELS } from '../features/accounts/types/AccountTypes'
import { formatBalance } from '../lib/formatCurrency'
import { ROUTES } from '../router/routes'
import styles from './AccountDetailPage.module.css'

const { Title, Text } = Typography

function AccountDetailPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const [isEditOpen, setIsEditOpen] = useState(false)

  const { data: account, isLoading, isError, error } = useAccountDetail(id)
  const { mutate: archive, isPending: isArchiving } = useArchiveAccount()

  const handleArchive = (): void => {
    if (!account || account.isArchived) return
    archive(account.id, { onSuccess: () => navigate(ROUTES.ACCOUNTS) })
  }

  if (isLoading) return <Skeleton active paragraph={{ rows: 6 }} />

  if (isError) {
    const message = error.response?.data?.error ?? 'Failed to load account detail.'
    return <Alert type="error" message={message} showIcon />
  }

  if (!account) return <Alert type="warning" message="Account not found." showIcon />

  return (
    <main className={styles.page}>
      {/* Back link */}
      <Link to={ROUTES.ACCOUNTS}>
        <Button icon={<ArrowLeftOutlined />} type="text">Accounts</Button>
      </Link>

      {/* Blue header card */}
      <Card className={styles.headerCard}>
        <div className={styles.cardHeader}>
          <div>
            <Space align="center" wrap>
              <Title level={4} className={styles.headerName}>{account.name}</Title>
              <Tag color="blue">{ACCOUNT_TYPE_LABELS[account.type]}</Tag>
              {account.isArchived && <Tag color="default">Archived</Tag>}
            </Space>
            <Text className={styles.headerSub}>{account.currency}</Text>
            <p className={styles.balanceAmount}>{formatBalance(account.balance, account.currency)}</p>
          </div>
          <Space>
            <Button onClick={() => setIsEditOpen(true)} disabled={account.isArchived}>
              Edit
            </Button>
            <Button danger loading={isArchiving} onClick={handleArchive} disabled={account.isArchived}>
              Archive
            </Button>
          </Space>
        </div>
      </Card>

      {/* Income / Expense summary */}
      <Row gutter={16}>
        <Col xs={24} sm={12}>
          <Card>
            <Text type="secondary">Income</Text>
            <br />
            <Text strong>—</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12}>
          <Card>
            <Text type="secondary">Expenses</Text>
            <br />
            <Text strong>—</Text>
          </Card>
        </Col>
      </Row>

      {/* Transactions section — connected in Transactions phase */}
      <Card title={<Text strong>Recent Transactions</Text>}>
        <Text type="secondary">Transactions for this account will appear here.</Text>
      </Card>

      <EditAccountModal isOpen={isEditOpen} account={account} onClose={() => setIsEditOpen(false)} />
    </main>
  )
}

export default AccountDetailPage
