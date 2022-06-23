import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { SWRConfig } from 'swr'
import Login from '../components/Login/Login'
import { supabase } from '../libs/initSupabase'
import '../styles/globals.css'
import { ThemeProvider } from '@mui/material/styles'
import theme from '../theme'

const allowedPaths = ["/", "/sign-up", "/login-page"];
const MyApp = ({ Component, pageProps }: any) => {
    const router = useRouter()
    const [session, setSession] = useState<any>(null)

    useEffect(() => {
        if (!router.asPath.includes('#access_token')) {
            sessionStorage.removeItem('AUTH')
        }
        setSession(supabase.auth.session())

        const { data: authListener } = supabase.auth.onAuthStateChange(
            (_event: any, session: any) => {
                setSession(session)
            }
        )
        const handleRouteChange = () => {}

        router.events.on('routeChangeStart', handleRouteChange)

        return () => {
            authListener?.unsubscribe()
            router.events.off('routeChangeStart', handleRouteChange)
        }
    }, [router])

    const fetcher = (url: any, data: any, method: any) => {
        const options: any = {
            headers: new Headers({
                'Content-Type': 'application/json',
                token: session?.access_token,
            }),
            credentials: 'same-origin',
        }

        if (data) {
            options.method = 'POST'
            options.body = JSON.stringify(data)
        }

        if (method) {
            options.method = 'DELETE'
        }

        return fetch(url, options).then((res) => {
            if (!res.ok) {
                // global error handling
            }
            return res.json()
        })
    }

    return session || allowedPaths.includes(router.asPath) ? (
        <SWRConfig value={{ fetcher }}>
            <ThemeProvider theme={theme}>
                <Component {...pageProps} />
            </ThemeProvider>
        </SWRConfig>
    ) : (
        <ThemeProvider theme={theme}>
            <Login {...pageProps} />
        </ThemeProvider>
    )
}
export default MyApp
