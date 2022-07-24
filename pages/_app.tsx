import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { SWRConfig } from 'swr'
import Head from 'next/head'
import { supabase } from '@/libs/initSupabase'
import '../styles/globals.css'
import { ThemeProvider } from '@mui/material/styles'
import { Session } from '@supabase/supabase-js'

import theme from '../theme'

const MyApp = ({ Component, pageProps }: any) => {
    const router = useRouter()
    const [session, setSession] = useState<Session>()

    useEffect(() => {
        if (!router.asPath.includes('#access_token')) {
            sessionStorage.removeItem('AUTH')
        }
        const newSession = supabase.auth.session()

        if (newSession) {
            setSession(newSession)
        }

        const { data: authListener } = supabase.auth.onAuthStateChange(
            (_event: any, newSession: Session | null) => {
                if (newSession) {
                    setSession(newSession)
                }
            }
        )
        const handleRouteChange = () => {}

        router.events.on('routeChangeStart', handleRouteChange)

        return () => {
            authListener?.unsubscribe()
            router.events.off('routeChangeStart', handleRouteChange)
        }
    }, [router])

    const fetcher = (url: string, data: any, method: string) => {
        const options: RequestInit = {
            headers: new Headers({
                'Content-Type': 'application/json',
                token: session?.access_token as string,
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

    return (
        <SWRConfig value={{ fetcher }}>
            <ThemeProvider theme={theme}>
                <Head>
                    <title>ScubaData</title>
                    <link rel="icon" href="/diver.svg" />
                </Head>
                <Component {...pageProps} />
            </ThemeProvider>
        </SWRConfig>
    )
}
export default MyApp
