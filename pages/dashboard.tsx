import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import {
    Box,
    Button,
    CircularProgress,
    CssBaseline,
    Toolbar,
} from '@mui/material'
import { useState } from 'react'
import useSWR, { useSWRConfig } from 'swr'
import ExportModal from '@/components/Dashboard/ExportModal'
import Modal from '@/components/Dashboard/ImportModal'
import Table from '@/components/Dashboard/Table'
import Wrapper from '@/components/Core/Wrapper'
import { supabase } from '@/libs/initSupabase'
import WithProtection from '@/libs/WithProtection'

async function pythonScript(
    newData: string[][],
    formPost: Campaign,
    jobTitleCoumn: number,
    companyCoumn: number,
    fileName: string,
    id: number,
    fetcher: any
) {
    const processedfile = newData.reduce(
        (memo, val) => {
            if (val[0]) {
                memo.jobTitles.push(val[jobTitleCoumn])
            }

            if (val[1]) {
                memo.compainies.push(val[companyCoumn])
            }
            return memo
        },
        { jobTitles: [] as string[], compainies: [] as string[] }
    )

    const user = supabase.auth.user()

    fetcher('api/updatedata', {
        user_id: user?.id.toString(),
        file_name: fileName,
        id: id.toString(),
        jobtitles: processedfile.jobTitles,
        companies: processedfile.compainies,
        kw: isIncluded(formPost.keywords),
        exclude_kw: isNotIncluded(formPost.keywords),
        sen: isIncluded(formPost.seniorites),
        exclude_sen: isNotIncluded(formPost.seniorites),
        jt: isIncluded(formPost.jobTitles),
        exclude_jt: isNotIncluded(formPost.jobTitles),
        include_companies: isIncluded(formPost.companysList),
        exclude_companies: isNotIncluded(formPost.companysList),
    })
}

function isIncluded(data: CampaignItem[]) {
    return data.filter((a) => a.isIncluded).map((a) => a.name)
}

function isNotIncluded(data: CampaignItem[]) {
    return data.filter((a) => !a.isIncluded).map((a) => a.name)
}

function DashboardContent() {
    const [isOpen, setIsOpen] = useState(false)
    const { fetcher, mutate } = useSWRConfig()
    const { data, error } = useSWR<formPost[]>(`/api/dashboard/main`, {
        refreshInterval: 1000,
    })

    const handleClickOpen = () => {
        setIsOpen(true)
    }
    const handleClose = () => {
        setIsOpen(false)
    }

    const [exportModal, setexportModal] = useState<any>({
        isOpen: false,
        cost: null,
        fileUrl: null,
        id: null,
    })

    const handleClickExportOpen = (
        id: number | undefined,
        cost: number,
        fileUrl: string,
        paid_for: boolean | undefined
    ) => {
        setexportModal({
            isOpen: true,
            fileUrl,
            cost,
            id,
            paid_for,
        })
    }
    const handleExportClose = () => {
        setexportModal({
            isOpen: false,
            cost: null,
            fileUrl: null,
        })
    }

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <Wrapper pageName={'Dashboard'} />
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
                <Box sx={{ m: 4 }}>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                        }}
                    >
                        <Button variant="contained" onClick={handleClickOpen}>
                            Upload
                        </Button>
                    </Box>
                    <Modal
                        isOpen={isOpen}
                        handleClose={handleClose}
                        processfile={async (
                            newData: string[][],
                            campaigns: Campaign,
                            jobTitleCoumn: number,
                            companyCoumn: number,
                            fileName: string
                        ) => {
                            try {
                                const expected_completion_time = new Date()
                                expected_completion_time.setSeconds(
                                    expected_completion_time.getSeconds() +
                                        newData.length * 2
                                )
                                const newCampaign = {
                                    name: `${fileName} - ${campaigns.name}`,
                                    campaigns: [campaigns.id.toString()],
                                    is_processing: true,
                                    expected_completion_time:
                                        expected_completion_time.toISOString(),
                                    created_at: new Date().toISOString(),
                                }
                                let result

                                handleClose()

                                if (fetcher) {
                                    result = await mutate(
                                        '/api/dashboard/main',
                                        fetcher(
                                            `/api/dashboard/main`,
                                            newCampaign
                                        )
                                    )
                                    result = result[result.length - 1]
                                }

                                pythonScript(
                                    newData,
                                    campaigns,
                                    jobTitleCoumn,
                                    companyCoumn,
                                    fileName,
                                    result.id,
                                    fetcher
                                )
                            } catch (error) {
                                // Handle an error while updating the user here
                                debugger
                            }
                        }}
                    />

                    {!error && data ? (
                        <>
                            <ExportModal
                                isExportOpen={exportModal.isOpen}
                                cost={exportModal.cost}
                                id={exportModal.id}
                                fileUrl={exportModal.fileUrl}
                                paid_for={exportModal.paid_for}
                                handleClose={handleExportClose}
                            />
                            {data.length > 0 ? (
                                <Table
                                    data={data}
                                    handleClickExportOpen={
                                        handleClickExportOpen
                                    }
                                    onDelete={async (
                                        id: number | undefined
                                    ) => {
                                        const newData = data.filter(
                                            (post) => post.id !== id
                                        )

                                        if (fetcher) {
                                            mutate(
                                                `/api/dashboard/main`,
                                                fetcher(
                                                    `/api/dashboard/main`,
                                                    { id: id },
                                                    'DELETE'
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
                            ) : (
                                <Box
                                    sx={{
                                        display: 'flex',
                                        width: '100%',
                                        justifyContent: 'center',
                                        margin: 'auto',
                                        paddingTop: '3rem',
                                        gap: '0.5rem',
                                        color: 'rgb(53, 113, 128)',
                                    }}
                                >
                                    <AddCircleOutlineIcon />
                                    Please upload some results
                                </Box>
                            )}
                        </>
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
    )
}

export default WithProtection(DashboardContent)
