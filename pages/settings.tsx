import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CssBaseline from '@mui/material/CssBaseline'
import Link from '@mui/material/Link'
import Toolbar from '@mui/material/Toolbar'
import { useEffect, useState } from 'react'
import CampaignModal from '../components/CampaignModal/CampaignModal'
import Wrapper from '../components/Wrapper/Wrapper'
import Accord from '../components/Accord/Accord'
import CircularProgress from '@mui/material/CircularProgress'
import { useSWRConfig } from 'swr'
import { supabase } from '../libs/initSupabase'
import useSWR from 'swr'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'

interface item {
    name: string
    isIncluded: boolean
}

interface campaign {
    user: string
    id: string
    name: string
    state: string
    seniorites: item[]
    keywords: item[]
    companysList: item[]
    jobTitles: item[]
}

const fetcher = async (url: string) => {
    const res = await fetch(url)
    if (!res.ok) {
        throw Error("Yo that's NOT OK!!!")
    }
    const data = await res.json()
    return data
}

const updateData = async (newData: campaign) => {
    await fetch(`/api/settings/update`, {
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/json',
            Accept: 'application/json',
        }),
        body: JSON.stringify(newData),
    })
}

const updateFn = async (newData: campaign) => {
    await fetch(`/api/settings/${newData.user}`, {
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/json',
            Accept: 'application/json',
        }),
        body: JSON.stringify(newData),
    })
}

const archieveSetting = async (id: string) => {
    await fetch(`/api/settings/archieve`, {
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/json',
            Accept: 'application/json',
        }),
        body: id,
    })
}

function Settings() {
    const [expanded, setExpanded] = useState('')
    const [state, setState] = useState<campaign[]>([])
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const profile = supabase.auth.user()

    const result = useSWR(`/api/settings/${profile?.id}`, fetcher)
    const data = result.data

    const { mutate } = useSWRConfig()

    const handleClickOpen = () => {
        setIsOpen(true)
    }
    const handleClose = () => {
        setIsOpen(false)
    }

    const handleChange = (event: string) => {
        setExpanded((prevstate: string) => {
            return event == prevstate ? '' : event
        })
    }

    useEffect(() => {
        if (data) {
            setState(data.filter((a: campaign) => a.state !== 'ARCHIVED'))
            setIsLoading(false)
        }
    }, [data])

    return (
        <Box sx={{ display: 'flex' }}>
            <CampaignModal
                isOpen={isOpen}
                handleClose={handleClose}
                onSubmit={(name: string) => {
                    const newTodo = {
                        id: '',
                        name: name,
                        state: 'LIVE',
                        seniorites: [],
                        keywords: [],
                        companysList: [],
                        jobTitles: [],
                        user: profile?.id || '',
                    }

                    mutate(`/api/settings/${profile?.id}`, updateFn(newTodo), {
                        optimisticData: [...data, newTodo],
                        rollbackOnError: true,
                    })

                    handleClose()
                }}
            />
            <CssBaseline />
            <Wrapper pageName={'Settings'} />
            <Box
                sx={{
                    backgroundColor: 'grey',
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
                        <Button variant="contained" onClick={handleClickOpen}>
                            Create
                        </Button>
                        <Link href="/archieved-campaigns">
                            <Button variant="contained">
                                View Archieved Campaigns
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
                            state.length > 0 ? (
                                state.map((item: campaign) => {
                                    return (
                                        <Accord
                                            key={item.id}
                                            updateData={async (
                                                updatedsetting
                                            ) => {
                                                const newData = state.map(
                                                    (post: campaign) => {
                                                        if (
                                                            post.id === item.id
                                                        ) {
                                                            return updatedsetting
                                                        }
                                                        return post
                                                    }
                                                )
                                                mutate(
                                                    `/api/settings/${profile?.id}`,
                                                    updateData(updatedsetting),
                                                    {
                                                        optimisticData: [
                                                            ...newData,
                                                        ],
                                                        rollbackOnError: true,
                                                    }
                                                )
                                            }}
                                            item={item}
                                            isExpanded={
                                                expanded == item.id?.toString()
                                            }
                                            handleChange={() =>
                                                handleChange(item.id)
                                            }
                                            sendToArchive={async () => {
                                                const newData = data.filter(
                                                    (post: campaign) =>
                                                        post.id !== item.id
                                                )
                                                mutate(
                                                    `/api/settings/${profile?.id}`,
                                                    archieveSetting(item.id),
                                                    {
                                                        optimisticData: [
                                                            ...newData,
                                                        ],
                                                        rollbackOnError: true,
                                                    }
                                                )
                                            }}
                                        />
                                    )
                                })
                            ) : (
                                <Box
                                    sx={{
                                        display: 'flex',
                                        width: '100%',
                                        justifyContent: 'center',
                                        margin: 'auto',
                                    }}
                                >
                                    <AddCircleOutlineIcon
                                        sx={{
                                            color: '#1976d2',
                                        }}
                                    />{' '}
                                    Please upload some results
                                </Box>
                            )
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

export default Settings
