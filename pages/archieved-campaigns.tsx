import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CssBaseline from '@mui/material/CssBaseline'
import Paper from '@mui/material/Paper'
import Toolbar from '@mui/material/Toolbar'
import { useEffect, useState } from 'react'
import CampaignModal from '../components/CampaignModal/CampaignModal'
import Wrapper from '../components/Wrapper/Wrapper'
import Accord from '../components/Accord/Accord'
import CircularProgress from '@mui/material/CircularProgress'
import { supabase } from '../libs/initSupabase'
import { useSWRConfig } from 'swr'
import Link from '@mui/material/Link'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import useSWR from 'swr'

const fetcher = async (url: string) => {
    const res = await fetch(url)
    if (!res.ok) {
        throw Error("Yo that's NOT OK!!!")
    }
    const data = await res.json()
    return data
}

const archieveSetting = async (id: string) => {
    await fetch(`/api/campaigns/archieve`, {
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/json',
            Accept: 'application/json',
        }),
        body: JSON.stringify({
            id: id,
            state: 'INACTIVE',
        }),
    })
}

function ArchivedCampaigns() {
    const [expanded, setExpanded] = useState('')
    const [state, setState] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const profile = supabase.auth.user()
    const result = useSWR(`/api/campaigns/${profile?.id}`, fetcher)
    const data = result.data
    const { mutate } = useSWRConfig()

    const handleChange = (event: string) => {
        setExpanded((prevstate: string) => {
            return event == prevstate ? '' : event
        })
    }

    useEffect(() => {
        if (data) {
            setState(data.filter((a: any) => a.state === 'ARCHIVED'))
            setIsLoading(false)
        }
    }, [data])

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <Wrapper pageName={'Campaigns'} />
            <Box
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
                <Box sx={{ m: 4 }}>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Link href="/campaigns">
                            <Button variant="contained">
                                <ArrowBackIcon sx={{ marginRight: 1 }} /> Back
                                to Campaigns
                            </Button>
                        </Link>
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            height: '100%',
                            width: '100%',
                            marginTop: 2,
                            gap: '2rem',
                        }}
                    >
                        {!isLoading ? (
                            state.map((item: any) => (
                                <Accord
                                    key={item.id}
                                    updateData={() => {}}
                                    item={item}
                                    isExpanded={expanded == item.id?.toString()}
                                    handleChange={() => handleChange(item.id)}
                                    isDisabled
                                    sendToArchive={async () => {
                                        const newData = data.filter(
                                            (post: any) => post.id !== item.id
                                        )
                                        mutate(
                                            `/api/campaigns/${profile?.id}`,
                                            archieveSetting(item.id),
                                            {
                                                optimisticData: [...newData],
                                                rollbackOnError: true,
                                            }
                                        )
                                    }}
                                />
                            ))
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
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default ArchivedCampaigns
