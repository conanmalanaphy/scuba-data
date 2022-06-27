import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import CssBaseline from '@mui/material/CssBaseline'
import Toolbar from '@mui/material/Toolbar'
import { useState } from 'react'
import useSWR, { useSWRConfig } from 'swr'
import ExportModal from '../components/Dashboard/ExportModal'
import Modal from '../components/Dashboard/Modal'
import Table from '../components/Dashboard/Table'
import Wrapper from '../components/Wrapper/Wrapper'
import WithProtection from '../libs/WithProtection'
import { supabase } from '../libs/initSupabase'

async function pythonScript(
    newData: string[][],
    campaigns: any,
    jobTitleCoumn: number,
    companyCoumn: number,
    fileName: string,
    id: number,
    fetcher: any
) {
    const processedfile = newData.reduce<any>(
        (memo, val: any) => {
            if (val[0]) {
                memo.jobTitles.push(val[jobTitleCoumn])
            }

            if (val[1]) {
                memo.compainies.push(val[companyCoumn])
            }
            return memo
        },
        { jobTitles: [], compainies: [] }
    )

    const user = supabase.auth.user()

    fetcher('api/updatedata', {
        user_id: user?.id.toString(),
        file_name: fileName,
        id: id.toString(),
        jobtitles: processedfile.jobTitles,
        companies: processedfile.compainies,
        kw: isIncluded(campaigns.keywords),
        exclude_kw: isNotIncluded(campaigns.keywords),
        sen: isIncluded(campaigns.seniorites),
        exclude_sen: isNotIncluded(campaigns.seniorites),
        jt: isIncluded(campaigns.jobTitles),
        exclude_jt: isNotIncluded(campaigns.jobTitles),
        include_companies: isIncluded(campaigns.companysList),
        exclude_companies: isNotIncluded(campaigns.companysList),
    })
}

interface obje {
    [key: string]: string
}

function isIncluded(data: any) {
    return data.filter((a: any) => a.isIncluded).map((a: any) => a.name)
}

function isNotIncluded(data: any) {
    return data.filter((a: any) => !a.isIncluded).map((a: any) => a.name)
}

function DashboardContent() {
    const [isOpen, setIsOpen] = useState(false)
    const { fetcher, mutate } = useSWRConfig()
    const { data, error } = useSWR(`/api/dashboard/main`, {
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
        fileUrl: any,
        paid_for: any
    ) => {
        setexportModal({
            isOpen: true,
            fileUrl: fileUrl,
            cost: cost,
            id: id,
            paid_for: paid_for,
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
                            campaigns: any,
                            jobTitleCoumn: number,
                            companyCoumn: number,
                            fileName: string
                        ) => {
                            try {
                                const newCampaign = {
                                    name: `${fileName} - ${campaigns.name}`,
                                    campaigns: [campaigns.id.toString()],
                                    is_processing: true,
                                    expected_completion_time: newData.length,
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
                                    onDelete={async (id: any) => {
                                        const newData = data.filter(
                                            (post: any) => post.id !== id
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
