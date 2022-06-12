import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Collapse from '@mui/material/Collapse'
import CssBaseline from '@mui/material/CssBaseline'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import TableFooter from '@mui/material/TableFooter'
import TextField from '@mui/material/TextField'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Router from 'next/router'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { usePapaParse } from 'react-papaparse'
import useSWR, { useSWRConfig } from 'swr'
import Modal from '../components/Dashboard/Modal'
import Table from '../components/Dashboard/Table'
import Wrapper from '../components/Wrapper/Wrapper'
import { supabase } from '../libs/initSupabase'
import ExportModal from '../components/Dashboard/ExportModal'

const baseURL = process.env.NEXT_PUBLIC_FUNCTIONS_BASE_URL

interface obje {
    [key: string]: string
}

const fetcher = async (url: string) => {
    const res = await fetch(url)
    if (!res.ok) {
        throw Error("Yo that's NOT OK!!!")
    }
    const data = await res.json()
    return data
}

interface formPost {
    id?: number
    user?: string
    name: string
    row_count: number
    file: string
    campaigns: string[]
    comp_high: number
    comp_medium: number
    comp_low: number
    job_title_high: number
    job_title_medium: number
    job_title_low: number
    job_title_unique_count: number
    comp_unique_count: number
    created_at: string
}

const updateFn = async (newData: formPost, id?: string) => {
    await fetch(`/api/dashboard/${id}`, {
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/json',
            Accept: 'application/json',
        }),
        body: JSON.stringify(newData),
    })
}

function filterlist(list: formPost[], name: string) {
    return list.filter(function (s: formPost) {
        return s.name.match(name)
    })
}

const deleteResult = async (id?: number) => {
    await fetch(`/api/dashboard/${id}`, {
        method: 'DELETE',
        headers: new Headers({
            'Content-Type': 'application/json',
            Accept: 'application/json',
        }),
    })
}

function isIncluded(data: any) {
    return data.filter((a: any) => a.isIncluded).map((a: any) => a.name)
}

function isNotIncluded(data: any) {
    return data.filter((a: any) => !a.isIncluded).map((a: any) => a.name)
}

function sortData(data: any, sortBy: any) {
    switch (sortBy.sortBy) {
        case 'name':
            return [...data].sort((i, j) => {
                return sortBy.sortDirection === 'asc'
                    ? ('' + i.name).localeCompare(j.name)
                    : ('' + i.name).localeCompare(j.name) * -1
            })
        case 'createdDate':
            return [...data].sort((i: any, j: any) => {
                if (i.created_at < j.created_at) {
                    return sortBy.sortDirection === 'asc' ? -1 : 1
                } else {
                    if (i.created_at > j.created_at) {
                        return sortBy.sortDirection === 'asc' ? 1 : -1
                    } else {
                        return 0
                    }
                }
            })
        case 'uniqueRows':
            return [...data].sort((i: any, j: any) => {
                return sortBy.sortDirection === 'asc'
                    ? i.row_count - j.row_count
                    : j.row_count - i.row_count
            })
        default:
            return data
            break
    }
}

function DashboardContent() {
    const [isOpen, setIsOpen] = useState(false)
    const [cards, setCards] = useState<formPost[]>([])
    const { jsonToCSV } = usePapaParse()
    const { mutate } = useSWRConfig()
    const [isLoading, setIsLoading] = useState(true)
    const profile = supabase.auth.user()
    const { data } = useSWR(`/api/dashboard/${profile?.id}`, fetcher)

    const [sortBy, setSortBy] = React.useState({
        sortBy: 'name',
        sortDirection: 'asc',
    })

    const handleClickOpen = () => {
        setIsOpen(true)
    }
    const handleClose = () => {
        setIsOpen(false)
    }

    useEffect(() => {
        if (!profile) {
            Router.replace('/')
        }
    }, [profile])

    const requestSort = (pSortBy: any) => {
        let sortOrder = 'asc'
        let sortByc = sortBy.sortBy

        if (pSortBy === sortBy.sortBy) {
            sortOrder = sortBy.sortDirection === 'asc' ? 'desc' : 'asc'
        } else {
            sortByc = pSortBy
            sortOrder = 'asc'
        }
        setSortBy({
            sortDirection: sortOrder,
            sortBy: sortByc,
        })
    }

    useEffect(() => {
        if (data) {
            setCards(sortData(data, sortBy))
            setIsLoading(false)
        }
    }, [data, sortBy])

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
                        <TextField
                            sx={{ width: 300 }}
                            autoFocus
                            label="Filter Results"
                            type="email"
                            variant="standard"
                            onChange={(event) => {
                                setCards(filterlist(data, event.target.value))
                            }}
                        />
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
                                (baseURL ? baseURL + '/' : '') +
                                    'api/updatedata',
                                {
                                    method: 'POST',
                                    headers: new Headers({
                                        'Content-Type': 'application/json',
                                        Accept: 'application/json',
                                    }),
                                    body: JSON.stringify({
                                        user_id: profile?.id,
                                        jobtitles: processedfile.jobTitles,
                                        companies: processedfile.compainies,
                                        kw: isIncluded(campaigns.keywords),
                                        exclude_kw: isNotIncluded(
                                            campaigns.keywords
                                        ),
                                        sen: isIncluded(campaigns.seniorites),
                                        exclude_sen: isNotIncluded(
                                            campaigns.seniorites
                                        ),
                                        jt: isIncluded(campaigns.jobTitles),
                                        exclude_jt: isNotIncluded(
                                            campaigns.jobTitles
                                        ),
                                        include_companies: isIncluded(
                                            campaigns.companysList
                                        ),
                                        exclude_companies: isNotIncluded(
                                            campaigns.companysList
                                        ),
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

                            const jt_report_file = Object.entries(
                                jt_report
                            ).map((item: any) => {
                                const b: obje = {}

                                item.forEach(
                                    (element: string, index: number) => {
                                        b[`Column ${index + 1}`] = element
                                    }
                                )

                                return b
                            })

                            const comp_report_file = Object.entries(
                                comp_report
                            ).map((item: any) => {
                                const b: obje = {}

                                item.forEach(
                                    (element: string, index: number) => {
                                        b[`Column ${index + 1}`] = element
                                    }
                                )

                                return b
                            })

                            const newTodo = {
                                comp_high: comp_report_sum.High,
                                comp_medium: comp_report_sum.Medium,
                                comp_low: comp_report_sum.Low,
                                job_title_high: jt_report_sum.High,
                                job_title_medium: jt_report_sum.Medium,
                                job_title_low: jt_report_sum.Low,
                                user: profile?.id,
                                name: `${fileName} - ${campaigns.name}`,
                                job_title_unique_count: jt_ucounts,
                                created_at: new Date().toISOString(),
                                comp_unique_count: comp_ucounts,
                                row_count:
                                    processedfile.compainies.length +
                                    processedfile.jobTitles.length,
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

                            mutate(
                                `/api/dashboard/${profile?.id}`,
                                updateFn(newTodo, profile?.id),
                                {
                                    optimisticData: [...data, newTodo],
                                    rollbackOnError: true,
                                }
                            )
                        }}
                    />

                    {!isLoading ? (
                        <Paper
                            sx={{
                                p: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                height: '100%',
                                width: '100%',
                                marginTop: 2,
                                minHeight: '60vh',
                            }}
                        >
                            <ExportModal
                                isExportOpen={exportModal.isOpen}
                                cost={exportModal.cost}
                                exportId={exportModal.exportId}
                                handleClose={handleExportClose}
                                file={exportModal.file}
                            />
                            {cards.length > 0 ? (
                                <Table
                                    data={cards}
                                    sortBy={sortBy}
                                    requestSort={requestSort}
                                    handleClickExportOpen={
                                        handleClickExportOpen
                                    }
                                    onDelete={async (id: any) => {
                                        const newData = data.filter(
                                            (post: any) => post.id !== id
                                        )
                                        mutate(
                                            `/api/dashboard/${profile?.id}`,
                                            deleteResult(id),
                                            {
                                                optimisticData: [...newData],
                                                rollbackOnError: true,
                                            }
                                        )
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
                        </Paper>
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
