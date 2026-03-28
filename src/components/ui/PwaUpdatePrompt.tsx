import { useEffect } from 'react'
import { Button, notification } from 'antd'
import { useRegisterSW } from 'virtual:pwa-register/react'

function PwaUpdatePrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_swUrl: string, registration: ServiceWorkerRegistration | undefined) {
      if (registration) {
        // Poll for new SW versions every 60 minutes while the app is open.
        setInterval(() => {
          void registration.update()
        }, 60 * 60 * 1000)
      }
    },
    onRegisterError(error: unknown) {
      if (import.meta.env.DEV) {
        console.warn('[PWA] Service worker registration failed:', error)
      }
    },
  })

  const [api, contextHolder] = notification.useNotification()

  useEffect(() => {
    if (!needRefresh) return

    api.info({
      key: 'pwa-update',
      message: 'Update available',
      description: 'A new version of Budget Tracker is ready.',
      duration: 0,
      placement: 'bottomRight',
      btn: (
        <Button
          type="primary"
          size="small"
          onClick={() => {
            setNeedRefresh(false)
            void updateServiceWorker(true)
          }}
        >
          Update now
        </Button>
      ),
      onClose: () => setNeedRefresh(false),
    })
  }, [needRefresh, api, setNeedRefresh, updateServiceWorker])

  return <>{contextHolder}</>
}

export default PwaUpdatePrompt
