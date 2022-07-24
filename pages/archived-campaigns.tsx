import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import {
    Box,
    Button,
    CircularProgress,
    CssBaseline,
    Link,
    Toolbar,
} from '@mui/material'
import { useState } from 'react'
import useSWR, { useSWRConfig } from 'swr'
import Accordion from '@/components/Accordion'
import Wrapper from '@/components/Wrapper'
import WithProtection from '@/libs/WithProtection'

function ArchivedCampaigns() {
    const [expanded, setExpanded] = useState('')
    const { fetcher, mutate } = useSWRConfig()
    const { data, error } = useSWR<Campaign[]>(`/api/campaigns/archived`)

    const handleChange = (event: string) => {
        setExpanded((prevstate: string) => {
            return event == prevstate ? '' : event
        })
    }

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
                        {!error && data ? (
                            data.map((item) => (
                                <Accordion
                                    key={item.id}
                                    updateData={() => {}}
                                    item={item}
                                    isExpanded={expanded == item.id?.toString()}
                                    handleChange={() => handleChange(item.id)}
                                    isDisabled
                                    sendToArchive={async () => {
                                        const newData = data.filter(
                                            (post) => post.id !== item.id
                                        )

                                        if (fetcher) {
                                            mutate(
                                                `/api/campaigns/archived`,
                                                fetcher(
                                                    `/api/campaigns/archived`,
                                                    {
                                                        id: item.id,
                                                        state: 'ARCHIVED',
                                                    }
                                                ),
                                                {
                                                    optimisticData: [
                                                        ...newData,
                                                    ],
                                                    rollbackOnError: true,
                                                }
                                            )
                                        }
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

export default WithProtection(ArchivedCampaigns)
