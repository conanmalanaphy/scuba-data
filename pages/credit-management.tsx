import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import CssBaseline from '@mui/material/CssBaseline'
import Paper from '@mui/material/Paper'
import Toolbar from '@mui/material/Toolbar'
import { useEffect, useState } from 'react'
import useSWR from 'swr'
import Wrapper from '../components/Wrapper/Wrapper'
import { supabase } from '../libs/initSupabase'
import { useSWRConfig } from 'swr'
import CircularProgress from '@mui/material/CircularProgress'

const fetcher = async (url: string) => {
    const res = await fetch(url)
    if (!res.ok) {
        throw Error("Yo that's NOT OK!!!")
    }
    const data = await res.json()
    return data
}

const addMoreCredits = async (
    id?: string,
    credits?: number,
    row_id?: number
) => {
    await fetch(`/api/credit-management/${id}`, {
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/json',
            Accept: 'application/json',
        }),
        body: JSON.stringify({
            credit_count: credits,
            row_id: row_id,
        }),
    })
}

function Profile() {
    const profile = supabase.auth.user()
    const { data } = useSWR(`/api/credit-management/${profile?.id}`, fetcher)
    const [isLoading, setIsLoading] = useState(true)
    const [state, setState] = useState<any>({
        credit_count: null,
    })

    const { mutate } = useSWRConfig()

    useEffect(() => {
        if (data) {
            console.log(data)
            setState({
                credit_count: data.credit_count,
                user_id: data.user_id,
                row_id: data.row_id,
            })
            setIsLoading(false)
        }
    }, [data])

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <Wrapper pageName={'Credit Management'} />
            <Box
                component="main"
                sx={{
                    backgroundColor: (theme) =>
                        theme.palette.mode === 'light'
                            ? theme.palette.grey[100]
                            : theme.palette.grey[900],
                    flexGrow: 1,
                    height: '100vh',
                    overflow: 'auto',
                }}
            >
                <Toolbar />
                <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                    <Paper
                        sx={{
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            height: '100%',
                            width: '100%',
                            marginTop: 2,
                        }}
                    >
                        {!isLoading ? (
                            <Box sx={{ display: 'flex' }}>
                                Credit count: {state.credit_count}
                                <Button
                                    variant="contained"
                                    sx={{ ml: 2 }}
                                    onClick={async () => {
                                        mutate(
                                            `/api/credit-management/${profile?.id}`,

                                            addMoreCredits(
                                                profile?.id,
                                                data.credit_count + 10,
                                                data.id
                                            ),
                                            {
                                                optimisticData: {
                                                    user_id: profile?.id,
                                                    credit_count:
                                                        data.credit_count + 10,
                                                },
                                                rollbackOnError: true,
                                            }
                                        )
                                    }}
                                >
                                    Add 10 more tokens
                                </Button>
                            </Box>
                        ) : (
                            <Box
                                sx={{
                                    display: 'flex',
                                    width: '100%',
                                    justifyContent: 'center',
                                }}
                            >
                                <CircularProgress />
                            </Box>
                        )}
                    </Paper>
                </Container>
            </Box>
        </Box>
    )
}

export default Profile
