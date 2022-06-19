import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import CssBaseline from '@mui/material/CssBaseline'
import Paper from '@mui/material/Paper'
import Toolbar from '@mui/material/Toolbar'
import { useState } from 'react'
import { usePapaParse } from 'react-papaparse'
import useSWR, { useSWRConfig } from 'swr'
import ExportModal from '../components/Dashboard/ExportModal'
import Modal from '../components/Dashboard/Modal'
import Table from '../components/Dashboard/Table'
import Wrapper from '../components/Wrapper/Wrapper'

const baseURL = process.env.NEXT_PUBLIC_FUNCTIONS_BASE_URL

async function pythonScript(
    newData: string[][],
    campaigns: any,
    jobTitleCoumn: number,
    companyCoumn: number,
    fileName: string,
    handleClose: any,
    jsonToCSV: any
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

    const fomattedData = await fetch(
        (baseURL ? baseURL + '/' : '') + 'api/updatedata',
        {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/json',
                Accept: 'application/json',
            }),
            body: JSON.stringify({
                user_id: '5',
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
            }),
        }
    )
    const score = await fomattedData.json()

    const {
        comp_report,
        comp_report_sum,
        comp_ucounts,
        jt_report,
        jt_report_sum,
        jt_ucounts,
    } = score

    handleClose()

    const jt_report_file = Object.entries(jt_report).map((item: any) => {
        const b: obje = {}

        item.forEach((element: string, index: number) => {
            b[`Column ${index + 1}`] = element
        })

        return b
    })

    const comp_report_file = Object.entries(comp_report).map((item: any) => {
        const b: obje = {}

        item.forEach((element: string, index: number) => {
            b[`Column ${index + 1}`] = element
        })

        return b
    })

    return {
        comp_high: comp_report_sum.High,
        comp_medium: comp_report_sum.Medium,
        comp_low: comp_report_sum.Low,
        job_title_high: jt_report_sum.High,
        job_title_medium: jt_report_sum.Medium,
        job_title_low: jt_report_sum.Low,
        user: null,
        name: `${fileName} - ${campaigns.name}`,
        job_title_unique_count: jt_ucounts,
        created_at: new Date().toISOString(),
        comp_unique_count: comp_ucounts,
        row_count:
            processedfile.compainies.length + processedfile.jobTitles.length,
        file: jsonToCSV([
            {
                'Column 1': 'Job Report',
                'Column 2': '',
            },
            ...jt_report_file,
            {
                'Column 1': '',
                'Column 2': '',
            },
            {
                'Column 1': '',
                'Column 2': '',
            },
            {
                'Column 1': 'Company Report',
                'Column 2': '',
            },
            ...comp_report_file,
        ]),
        campaigns: [campaigns.id.toString()],
    }
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
    const { jsonToCSV } = usePapaParse()
    const { fetcher, mutate } = useSWRConfig()
    const { data, error } = useSWR(`/api/dashboard/main`)

    const handleClickOpen = () => {
        setIsOpen(true)
    }
    const handleClose = () => {
        setIsOpen(false)
    }

    const [exportModal, setexportModal] = useState<any>({
        isOpen: false,
        exportId: null,
        cost: null,
        file: null,
    })

    const handleClickExportOpen = (
        id: number | undefined,
        cost: number,
        file: any
    ) => {
        setexportModal({
            isOpen: true,
            exportId: id,
            file: file,
            cost: cost,
        })
    }
    const handleExportClose = () => {
        setexportModal({
            isOpen: false,
            exportId: null,
            cost: null,
            file: null,
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
                            justifyContent: 'space-between',
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
                            const newTodo = await pythonScript(
                                newData,
                                campaigns,
                                jobTitleCoumn,
                                companyCoumn,
                                fileName,
                                handleClose,
                                jsonToCSV
                            )

                            if (fetcher) {
                                mutate(
                                    `/api/dashboard/main`,
                                    fetcher(`/api/dashboard/main`, newTodo),
                                    {
                                        optimisticData: [...data, newTodo],
                                        rollbackOnError: true,
                                    }
                                )
                            }
                        }}
                    />

                    {!error && data ? (
                        <>
                            <ExportModal
                                isExportOpen={exportModal.isOpen}
                                cost={exportModal.cost}
                                exportId={exportModal.exportId}
                                handleClose={handleExportClose}
                                file={exportModal.file}
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
                                    <AddCircleOutlineIcon
                                        sx={{
                                            color: '#1976d2',
                                        }}
                                    />{' '}
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

export default DashboardContent
