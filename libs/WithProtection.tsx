import { supabase } from './initSupabase'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import { Session } from '@supabase/supabase-js'

const withAuth = (Component: any) => {
    const AuthenticatedComponent = () => {
        const router = useRouter()
        const [data, setData] = useState<Session>()

        useEffect(() => {
            const user = supabase.auth.session()

            if (!user) {
                router.push('/login-page')
            } else {
                setData(user)
            }
        }, [])

        return !!data ? (
            <Component data={data} />
        ) : (
            <Box
                sx={{
                    height: '100vh',
                    width: '100vw',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <CircularProgress />
            </Box>
        ) // Render whatever you want while the authentication occurs
    }

    return AuthenticatedComponent
}

export default withAuth
