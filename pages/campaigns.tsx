import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
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
import Accord from '@/components//Accordion'
import CampaignModal from '@/components//CampaignModal'
import Wrapper from '@/components//Wrapper'
import WithProtection from '@/libs/WithProtection'

interface item {
    name: string
    isIncluded: boolean
}

interface campaign {
    user_id: string
    id: string
    name: string
    state: string
    seniorites: item[]
    keywords: item[]
    companysList: item[]
    jobTitles: item[]
}

function Campaigns() {
    const [expanded, setExpanded] = useState('')
    const [isOpen, setIsOpen] = useState(false)
    const [isSaveAsOpen, setIsSaveAsOpen] = useState(false)

    const { fetcher, mutate } = useSWRConfig()
    const { data, error } = useSWR(`/api/campaigns/main`)

    return (
        <Box sx={{ display: 'flex' }}>
            <CampaignModal
                isOpen={isOpen}
                handleClose={() => {
                    setIsOpen(false)
                }}
                onSubmit={async (addedCampaign: Partial<Campaign>) => {
                    const newCampaign = {
                        id: '',
                        name: name,
                        state: 'INACTIVE',
                        seniorites: [],
                        keywords: [],
                        companysList: [],
                        jobTitles: [],
                        user_id: '',
                        ...addedCampaign,
                    }

                    setIsOpen(false)

                    if (fetcher) {
                        await mutate(
                            `/api/campaigns/main`,
                            fetcher(`/api/campaigns/main`, newCampaign),
                            {
                                optimisticData: [...data, newCampaign],
                                rollbackOnError: true,
                            }
                        )
                    }
                }}
            />
            <CampaignModal
                isOpen={isSaveAsOpen}
                handleClose={() => setIsSaveAsOpen(false)}
                campaigns={data}
                onSubmit={(newCampaign: Partial<Campaign>) => {
                    if (fetcher) {
                        mutate(
                            `/api/campaigns/main`,
                            fetcher(`/api/campaigns/main`, newCampaign),
                            {
                                optimisticData: [...data, newCampaign],
                                rollbackOnError: true,
                            }
                        )
                    }
                    setIsSaveAsOpen(false)
                }}
            />
            <CssBaseline />
            <Wrapper pageName={'Campaigns'} />
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
                        <Box>
                            <Button
                                variant="contained"
                                onClick={() => {
                                    setIsOpen(true)
                                }}
                            >
                                Create
                            </Button>
                            <Button
                                variant="outlined"
                                sx={{ ml: 2 }}
                                onClick={() => {
                                    setIsSaveAsOpen(true)
                                }}
                            >
                                Save As
                            </Button>
                        </Box>

                        <Link href="/archived-campaigns">
                            <Button variant="contained">
                                View Archived Campaigns
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
                            data.length > 0 ? (
                                data.map((item: campaign) => {
                                    return (
                                        <Accord
                                            key={item.id}
                                            isDisabled={item.state === 'LIVE'}
                                            updateData={async (
                                                updatedsetting
                                            ) => {
                                                if (fetcher) {
                                                    await mutate(
                                                        `/api/campaigns/main`,
                                                        fetcher(
                                                            `/api/campaigns/update`,
                                                            updatedsetting
                                                        ),
                                                        {
                                                            optimisticData: [
                                                                ...data.map(
                                                                    (
                                                                        post: campaign
                                                                    ) => {
                                                                        if (
                                                                            post.id ===
                                                                            item.id
                                                                        ) {
                                                                            return updatedsetting
                                                                        }
                                                                        return post
                                                                    }
                                                                ),
                                                            ],
                                                            rollbackOnError:
                                                                true,
                                                        }
                                                    )
                                                }
                                            }}
                                            item={item}
                                            isExpanded={
                                                expanded == item.id?.toString()
                                            }
                                            handleChange={() =>
                                                setExpanded(
                                                    (prevstate: string) => {
                                                        return item.id ==
                                                            prevstate
                                                            ? ''
                                                            : item.id
                                                    }
                                                )
                                            }
                                            sendToArchive={async () => {
                                                const newData = data.filter(
                                                    (post: campaign) =>
                                                        post.id !== item.id
                                                )
                                                if (fetcher) {
                                                    mutate(
                                                        `/api/campaigns/main`,
                                                        fetcher(
                                                            `/api/campaigns/archive`,
                                                            {
                                                                id: item.id,
                                                                state: 'ARCHIVED',
                                                            }
                                                        ),
                                                        {
                                                            optimisticData: [
                                                                ...newData,
                                                            ],
                                                            rollbackOnError:
                                                                true,
                                                        }
                                                    )
                                                }
                                            }}
                                            onDelete={async () => {
                                                const newData = data.filter(
                                                    (post: campaign) =>
                                                        post.id !== item.id
                                                )
                                                if (fetcher) {
                                                    mutate(
                                                        `/api/campaigns/main`,
                                                        fetcher(
                                                            `/api/campaigns/main`,
                                                            { id: item.id },
                                                            'DELETE'
                                                        ),
                                                        {
                                                            optimisticData: [
                                                                ...newData,
                                                            ],
                                                            rollbackOnError:
                                                                true,
                                                        }
                                                    )
                                                }
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
                                        marginTop: '2rem',
                                    }}
                                >
                                    <AddCircleOutlineIcon />
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

export default WithProtection(Campaigns)
