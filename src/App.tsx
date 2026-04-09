import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConfigProvider, theme } from 'antd'
import i18n from 'i18next'
import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { usePreferences } from './features/settings/hooks/usePreferences'
import { useUiStore } from './features/settings/store/uiStore'
import router from './router'

const LANGUAGE_NAME_TO_CODE: Record<string, string> = {
  English: 'en', Turkish: 'tr', French: 'fr', German: 'de', Spanish: 'es',
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
})

function LanguageSync() {
  const { data } = usePreferences()
  useEffect(() => {
    if (data) {
      const code = LANGUAGE_NAME_TO_CODE[data.language] ?? 'en'
      i18n.changeLanguage(code)
    }
  }, [data])
  return null
}

function AppProviders() {
  const { isDarkMode } = useUiStore()

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: '#2563eb',
          borderRadius: 8,
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        },
      }}
    >
      <QueryClientProvider client={queryClient}>
        <LanguageSync />
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ConfigProvider>
  )
}

export default AppProviders
