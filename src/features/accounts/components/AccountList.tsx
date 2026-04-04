import { Alert, Col, Empty, Row, Skeleton } from 'antd'
import { useAccounts } from '../hooks/useAccounts'
import AccountCard from './AccountCard'

function AccountList() {
  const { data, isLoading, isError, error } = useAccounts()

  if (isLoading) {
    return (
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12}><Skeleton active paragraph={{ rows: 4 }} /></Col>
        <Col xs={24} sm={12}><Skeleton active paragraph={{ rows: 4 }} /></Col>
      </Row>
    )
  }

  if (isError) {
    const message = error.response?.data?.error ?? 'Failed to load accounts.'
    return <Alert type="error" message={message} showIcon />
  }

  if (!data || data.length === 0) {
    return <Empty description="No accounts yet" />
  }

  return (
    <Row gutter={[16, 16]}>
      {data.map((account) => (
        <Col key={account.id} xs={24} sm={12}>
          <AccountCard account={account} />
        </Col>
      ))}
    </Row>
  )
}

export default AccountList
