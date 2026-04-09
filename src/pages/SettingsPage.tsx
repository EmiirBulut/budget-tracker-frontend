import {
  BellOutlined,
  DollarCircleOutlined,
  DownloadOutlined,
  GlobalOutlined,
  LockOutlined,
  MoonOutlined,
  QuestionCircleOutlined,
  RightOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Alert, Button, Card, Divider, Flex, Modal, Select, Switch, Typography } from 'antd'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ChangePasswordForm from '../features/settings/components/ChangePasswordForm'
import ProfileForm from '../features/settings/components/ProfileForm'
import { usePreferences } from '../features/settings/hooks/usePreferences'
import { useUpdatePreferences } from '../features/settings/hooks/useUpdatePreferences'
import { useUiStore } from '../features/settings/store/uiStore'
import styles from './SettingsPage.module.css'

const { Title, Text } = Typography

// ── Enum mappings (must match backend C# enums) ───────────────────────────────

const CURRENCY_TO_ENUM: Record<string, number> = {
  USD: 0, EUR: 1, GBP: 2, TRY: 3, JPY: 4, CHF: 5, CAD: 6, AUD: 7, CNY: 8, INR: 9,
}
const ENUM_TO_CURRENCY: Record<number, string> = Object.fromEntries(
  Object.entries(CURRENCY_TO_ENUM).map(([k, v]) => [v, k]),
)

const LANGUAGE_TO_ENUM: Record<string, number> = {
  en: 0, tr: 1, fr: 2, de: 3, es: 4,
}

// Backend returns full enum name (e.g. "Turkish") — map back to UI code
const LANGUAGE_NAME_TO_CODE: Record<string, string> = {
  English: 'en', Turkish: 'tr', French: 'fr', German: 'de', Spanish: 'es',
}

const LANGUAGE_LABELS: Record<string, string> = {
  en: 'English', tr: 'Turkish', fr: 'French', de: 'German', es: 'Spanish',
}

interface SettingRowProps {
  icon: React.ReactNode
  title: string
  subtitle: string
  action: React.ReactNode
  onClick?: () => void
}

function SettingRow({ icon, title, subtitle, action, onClick }: SettingRowProps) {
  return (
    <Flex
      align="center"
      justify="space-between"
      className={`${styles.row} ${onClick ? styles.rowClickable : ''}`}
      onClick={onClick}
    >
      <Flex align="center" gap={12}>
        <div className={styles.iconCircle}>{icon}</div>
        <Flex vertical gap={2}>
          <Text className={styles.rowTitle}>{title}</Text>
          <Text className={styles.rowSubtitle}>{subtitle}</Text>
        </Flex>
      </Flex>
      <div onClick={(e) => e.stopPropagation()}>{action}</div>
    </Flex>
  )
}

interface SectionProps {
  title: string
  rows: React.ReactNode[]
  footer?: React.ReactNode
}

function Section({ title, rows, footer }: SectionProps) {
  return (
    <Flex vertical gap={8}>
      <Text className={styles.sectionTitle}>{title}</Text>
      <Card className={styles.sectionCard} styles={{ body: { padding: '0 20px' } }}>
        {rows.map((row, i) => (
          <div key={i}>
            {row}
            {i < rows.length - 1 && <Divider style={{ margin: 0 }} />}
          </div>
        ))}
        {footer && (
          <>
            <Divider style={{ margin: 0 }} />
            <div className={styles.sectionFooter}>{footer}</div>
          </>
        )}
      </Card>
    </Flex>
  )
}

function SettingsPage() {
  const { t } = useTranslation()
  const [isAccountOpen, setIsAccountOpen] = useState(false)
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false)
  const { isDarkMode, toggleDarkMode } = useUiStore()

  const { data: savedPreferences } = usePreferences()
  const { mutate: savePreferences, isPending, isError, isSuccess, reset } = useUpdatePreferences()

  const [currency, setCurrency] = useState('USD')
  const [language, setLanguage] = useState('en')
  const [notifications, setNotifications] = useState(true)

  // Populate local state once backend data loads
  useEffect(() => {
    if (savedPreferences) {
      setCurrency(savedPreferences.defaultCurrency)
      setLanguage(LANGUAGE_NAME_TO_CODE[savedPreferences.language] ?? 'en')
      setNotifications(savedPreferences.notificationsEnabled)
    }
  }, [savedPreferences])

  const handleSavePreferences = (): void => {
    reset()
    savePreferences({
      defaultCurrency: CURRENCY_TO_ENUM[currency] ?? 0,
      language: LANGUAGE_TO_ENUM[language] ?? 0,
      notificationsEnabled: notifications,
    })
  }

  return (
    <main className={styles.page}>
      {/* Header */}
      <div>
        <Title level={3} style={{ margin: 0 }}>{t('settings.title')}</Title>
        <Text style={{ color: '#2563eb' }}>{t('settings.subtitle')}</Text>
      </div>

      {/* Profile */}
      <Section
        title={t('settings.profile')}
        rows={[
          <SettingRow
            icon={<UserOutlined className={styles.icon} />}
            title={t('settings.account')}
            subtitle={t('settings.accountSubtitle')}
            action={<RightOutlined className={styles.chevron} />}
            onClick={() => setIsAccountOpen(true)}
          />,
          <SettingRow
            icon={<LockOutlined className={styles.icon} />}
            title={t('settings.privacySecurity')}
            subtitle={t('settings.privacySubtitle')}
            action={<RightOutlined className={styles.chevron} />}
            onClick={() => setIsPrivacyOpen(true)}
          />,
        ]}
      />

      {/* Preferences */}
      <Section
        title={t('settings.preferences')}
        rows={[
          <SettingRow
            icon={<DollarCircleOutlined className={styles.icon} />}
            title={t('settings.currency')}
            subtitle={currency}
            action={
              <Select
                value={currency}
                onChange={setCurrency}
                size="small"
                style={{ width: 100 }}
                options={[
                  { label: 'USD ($)', value: 'USD' },
                  { label: 'EUR (€)', value: 'EUR' },
                  { label: 'GBP (£)', value: 'GBP' },
                  { label: 'TRY (₺)', value: 'TRY' },
                  { label: 'JPY (¥)', value: 'JPY' },
                  { label: 'CHF (₣)', value: 'CHF' },
                  { label: 'CAD ($)', value: 'CAD' },
                  { label: 'AUD ($)', value: 'AUD' },
                  { label: 'CNY (¥)', value: 'CNY' },
                  { label: 'INR (₹)', value: 'INR' },
                ]}
              />
            }
          />,
          <SettingRow
            icon={<GlobalOutlined className={styles.icon} />}
            title={t('settings.language')}
            subtitle={LANGUAGE_LABELS[language] ?? language}
            action={
              <Select
                value={language}
                onChange={setLanguage}
                size="small"
                style={{ width: 100 }}
                options={[
                  { label: 'English', value: 'en' },
                  { label: 'Turkish', value: 'tr' },
                  { label: 'French', value: 'fr' },
                  { label: 'German', value: 'de' },
                  { label: 'Spanish', value: 'es' },
                ]}
              />
            }
          />,
          <SettingRow
            icon={<BellOutlined className={styles.icon} />}
            title={t('settings.notifications')}
            subtitle={t('settings.notificationsSubtitle')}
            action={<Switch checked={notifications} onChange={setNotifications} />}
          />,
          <SettingRow
            icon={<MoonOutlined className={styles.icon} />}
            title={t('settings.darkMode')}
            subtitle={t('settings.darkModeSubtitle')}
            action={<Switch checked={isDarkMode} onChange={toggleDarkMode} />}
          />,
        ]}
        footer={
          <Flex vertical gap={8} className={styles.saveArea}>
            {isError && <Alert message={t('settings.preferencesFailed')} type="error" showIcon />}
            {isSuccess && <Alert message={t('settings.preferencesSaved')} type="success" showIcon />}
            <Button type="primary" loading={isPending} onClick={handleSavePreferences}>
              {isPending ? t('common.saving') : t('settings.savePreferences')}
            </Button>
          </Flex>
        }
      />

      {/* Data Management */}
      <Section
        title={t('settings.dataManagement')}
        rows={[
          <SettingRow
            icon={<DownloadOutlined className={styles.icon} />}
            title={t('settings.exportData')}
            subtitle={t('settings.exportSubtitle')}
            action={<Button type="primary" size="small">{t('common.export')}</Button>}
          />,
          <SettingRow
            icon={<DownloadOutlined className={styles.icon} />}
            title={t('settings.backup')}
            subtitle={t('settings.backupSubtitle')}
            action={<RightOutlined className={styles.chevron} />}
            onClick={() => {}}
          />,
        ]}
      />

      {/* Support */}
      <Section
        title={t('settings.support')}
        rows={[
          <SettingRow
            icon={<QuestionCircleOutlined className={styles.icon} />}
            title={t('settings.helpCenter')}
            subtitle={t('settings.helpSubtitle')}
            action={<RightOutlined className={styles.chevron} />}
            onClick={() => {}}
          />,
        ]}
      />

      {/* Account Modal */}
      <Modal
        title={t('settings.account')}
        open={isAccountOpen}
        onCancel={() => setIsAccountOpen(false)}
        footer={null}
        destroyOnClose
      >
        <ProfileForm />
      </Modal>

      {/* Privacy & Security Modal */}
      <Modal
        title={t('settings.privacySecurity')}
        open={isPrivacyOpen}
        onCancel={() => setIsPrivacyOpen(false)}
        footer={null}
        destroyOnClose
      >
        <ChangePasswordForm />
      </Modal>
    </main>
  )
}

export default SettingsPage
