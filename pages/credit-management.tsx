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
import Slider from '@mui/material/Slider'
import { Typography } from '@mui/material'

const marks = [
    {
        value: 100,
        label: '100',
    },
    {
        value: 500,
        label: '500',
    },
    {
        value: 1000,
        label: '1000',
    },
]

function valuetext(value: number) {
    return `${value}°C`
}

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

function calc(c: number) {
    if (c < 100) {
        return c * 1
    } else if (c >= 100 && c < 500) {
        const lower = c - 100
        return 100 + lower * 0.5
    } else {
        const lower = c - 500
        return 300 + lower * 0.1
    }
}

function Profile() {
    const profile = supabase.auth.user()
    const { data } = useSWR(`/api/credit-management/${profile?.id}`, fetcher)
    const [isLoading, setIsLoading] = useState(true)
    const [value, setValue] = useState(100)
    const [state, setState] = useState<any>({
        credit_count: 0,
    })

    const { mutate } = useSWRConfig()

    useEffect(() => {
        if (data) {
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
                <Container sx={{ mt: 4, mb: 4, height: '70%' }}>
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
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-evenly',
                                    height: '100%',
                                }}
                            >
                                <Typography variant="h2">
                                    Credit count: {state.credit_count}
                                </Typography>
                                <Box sx={{ width: 300 }}>
                                    <Typography variant="h3">
                                        1-100: £1 per credit
                                    </Typography>
                                    <Typography variant="h3">
                                        100-500: 50p per credit
                                    </Typography>
                                    <Typography variant="h3">
                                        500-1000: 10p per credit
                                    </Typography>
                                </Box>
                                <Box sx={{ width: 300 }}>
                                    <Slider
                                        aria-label="Always visible"
                                        value={value}
                                        onChange={(e: any) => {
                                            setValue(e.target.value)
                                        }}
                                        getAriaValueText={valuetext}
                                        step={1}
                                        marks={marks}
                                        valueLabelDisplay="on"
                                        min={1}
                                        max={1000}
                                    />
                                    cost: £{calc(value)}
                                </Box>
                                <Button
                                    variant="contained"
                                    sx={{ ml: 2 }}
                                    onClick={async () => {
                                        mutate(
                                            `/api/credit-management/${profile?.id}`,

                                            addMoreCredits(
                                                profile?.id,
                                                data.credit_count + value,
                                                data.id
                                            ),
                                            {
                                                optimisticData: {
                                                    credit_count:
                                                        data.credit_count +
                                                        value,
                                                },
                                                rollbackOnError: true,
                                            }
                                        )
                                    }}
                                >
                                    Add {value} more tokens
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
