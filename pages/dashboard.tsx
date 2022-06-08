import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import DeleteIcon from '@mui/icons-material/Delete'
import CardContent from '@mui/material/CardContent'
import TextField from '@mui/material/TextField'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import CssBaseline from '@mui/material/CssBaseline'
import Paper from '@mui/material/Paper'
import Toolbar from '@mui/material/Toolbar'
import Router from 'next/router'
import Typography from '@mui/material/Typography'
import { useEffect, useState } from 'react'
import { usePapaParse } from 'react-papaparse'
import Modal from '../components/Modal/Modal'
import Wrapper from '../components/Wrapper/Wrapper'
import CircularProgress from '@mui/material/CircularProgress'
import useSWR, { useSWRConfig } from 'swr'
import { supabase } from '../libs/initSupabase'
import IconButton from '@mui/material/IconButton'

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'

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
}

const updateFn = async (newData: formPost) => {
    await fetch('/api/dashboard/1', {
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

function DashboardContent() {
    const [isOpen, setIsOpen] = useState(false)
    const [expanded, setExpanded] = useState('')
    const [cards, setCards] = useState<formPost[]>([])
    const { jsonToCSV } = usePapaParse()
    const { mutate } = useSWRConfig()
    const [isLoading, setIsLoading] = useState(true)
    const profile = supabase.auth.user()
    const { data } = useSWR(`/api/dashboard/${profile?.id}`, fetcher)

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
        if (!profile) {
            Router.replace('/')
        }
    }, [profile])

    useEffect(() => {
        if (data) {
            setCards(data)
            setIsLoading(false)
        }
    }, [data])

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
                    <Button variant="contained" onClick={handleClickOpen}>
                        Upload
                    </Button>
                    <TextField
                        sx={{ width: 300, marginLeft: 20 }}
                        autoFocus
                        label="Filter Results"
                        type="email"
                        variant="standard"
                        onChange={(event) => {
                            setCards(filterlist(data, event.target.value))
                        }}
                    />
                    <Modal
                        isOpen={isOpen}
                        handleClose={handleClose}
                        processfile={async (
                            newData: string[][],
                            campaigns: any
                        ) => {
                            const processedfile = newData.reduce<any>(
                                (memo, val: any) => {
                                    if (val[0]) {
                                        memo.jobTitles.push(val[0])
                                    }

                                    if (val[1]) {
                                        memo.compainies.push(val[1])
                                    }
                                    return memo
                                },
                                { jobTitles: [], compainies: [] }
                            )

                            const kw = campaigns.keywords
                                .filter((a: any) => a.isIncluded)
                                .map((a: any) => a.name)
                            const exclude_kw = campaigns.keywords
                                .filter((a: any) => !a.isIncluded)
                                .map((a: any) => a.name)
                            const sen = campaigns.seniorites
                                .filter((a: any) => a.isIncluded)
                                .map((a: any) => a.name)
                            const exclude_sen: string[] = campaigns.seniorites
                                .filter((a: any) => !a.isIncluded)
                                .map((a: any) => a.name)
                            const jt: string[] = campaigns.jobTitles
                                .filter((a: any) => a.isIncluded)
                                .map((a: any) => a.name)
                            const exclude_jt: string[] = campaigns.jobTitles
                                .filter((a: any) => !a.isIncluded)
                                .map((a: any) => a.name)
                            const compainies: string[] = campaigns.companysList
                                .filter((a: any) => a.isIncluded)
                                .map((a: any) => a.name)
                            const exclude_compaines: string[] =
                                campaigns.companysList
                                    .filter((a: any) => !a.isIncluded)
                                    .map((a: any) => a.name)

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
                                        jobtitles: processedfile.jobTitles,
                                        companies: processedfile.compainies,
                                        kw: kw,
                                        exclude_kw: exclude_kw,
                                        sen: sen,
                                        exclude_sen: exclude_sen,
                                        jt: jt,
                                        exclude_jt: exclude_jt,
                                        include_companies: compainies,
                                        exclude_companies: exclude_compaines,
                                    }),
                                }
                            )
                            const score = await fomattedData.json()

                            console.log(score)

                            const {
                                comp_report,
                                comp_report_sum,
                                comp_ucounts,
                                jt_report,
                                jt_report_sum,
                                jt_ucounts,
                            } = score
                            console.log(comp_report)
                            console.log(jt_report)

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
                                name: newData[0][0],
                                job_title_unique_count: jt_ucounts,
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
                                updateFn(newTodo),
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
                            {cards.length > 0 ? (
                                cards.map((cards: formPost, index: number) => {
                                    const {
                                        name,
                                        row_count,
                                        id,
                                        file,
                                        campaigns,
                                        comp_high,
                                        comp_medium,
                                        comp_low,
                                        job_title_high,
                                        job_title_medium,
                                        job_title_low,
                                        job_title_unique_count,
                                        comp_unique_count,
                                    } = cards

                                    return (
                                        <Accordion
                                            sx={{ pt: 1 }}
                                            key={index}
                                            expanded={
                                                expanded == index?.toString()
                                            }
                                            onChange={() =>
                                                handleChange(index.toString())
                                            }
                                        >
                                            <AccordionSummary
                                                aria-controls="panel1bh-content"
                                                id="panel1bh-header"
                                            >
                                                <Typography
                                                    sx={{
                                                        fontWeight: 700,
                                                        width: '33%',
                                                        flexShrink: 0,
                                                        fontSize: '125%',
                                                        margin: 'auto',
                                                        marginLeft: '1rem',
                                                    }}
                                                >
                                                    Name: {name}
                                                </Typography>
                                                <Typography
                                                    sx={{
                                                        fontWeight: 700,
                                                        width: '33%',
                                                        flexShrink: 0,
                                                        fontSize: '125%',
                                                        margin: 'auto',
                                                        marginLeft: '1rem',
                                                    }}
                                                >
                                                    rows: {row_count}
                                                </Typography>
                                                <Button
                                                    variant="outlined"
                                                    sx={{
                                                        color: 'blue',
                                                        flex: '1 1 0px',
                                                    }}
                                                    onClick={() => {
                                                        var csvData = new Blob(
                                                            [file],
                                                            {
                                                                type: 'text/csv;charset=utf-8;',
                                                            }
                                                        )
                                                        var csvURL =
                                                            window.URL.createObjectURL(
                                                                csvData
                                                            )

                                                        var tempLink =
                                                            document.createElement(
                                                                'a'
                                                            )
                                                        tempLink.href = csvURL
                                                        tempLink.setAttribute(
                                                            'download',
                                                            'download.csv'
                                                        )
                                                        tempLink.click()
                                                    }}
                                                >
                                                    Export
                                                </Button>
                                                <IconButton
                                                    edge="start"
                                                    color="inherit"
                                                    onClick={async () => {
                                                        const newData =
                                                            data.filter(
                                                                (post: any) =>
                                                                    post.id !==
                                                                    id
                                                            )
                                                        mutate(
                                                            `/api/dashboard/${profile?.id}`,
                                                            deleteResult(id),
                                                            {
                                                                optimisticData:
                                                                    [
                                                                        ...newData,
                                                                    ],
                                                                rollbackOnError:
                                                                    true,
                                                            }
                                                        )
                                                    }}
                                                    sx={{
                                                        color: '#1976d2',
                                                        marginLeft: '1rem',
                                                    }}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </AccordionSummary>
                                            <AccordionDetails
                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: 'row',
                                                    borderTop:
                                                        'lightgray solid 1px',
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        flex: '50%',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        color: 'grey',
                                                    }}
                                                >
                                                    <Typography
                                                        sx={{
                                                            fontWeight: 700,
                                                            flexShrink: 0,
                                                            fontSize: '125%',
                                                            margin: 'auto',
                                                            marginLeft: '1rem',
                                                            color: 'black',
                                                        }}
                                                    >
                                                        Companies
                                                    </Typography>
                                                    <Typography
                                                        sx={{
                                                            flexShrink: 0,
                                                            margin: 'auto',
                                                            marginLeft: '1rem',
                                                        }}
                                                    >
                                                        High:{comp_high}
                                                    </Typography>
                                                    <Typography
                                                        sx={{
                                                            flexShrink: 0,
                                                            margin: 'auto',
                                                            marginLeft: '1rem',
                                                        }}
                                                    >
                                                        Medium:{comp_medium}
                                                    </Typography>
                                                    <Typography
                                                        sx={{
                                                            flexShrink: 0,
                                                            margin: 'auto',
                                                            marginLeft: '1rem',
                                                        }}
                                                    >
                                                        Low:{comp_low}
                                                    </Typography>
                                                    <Typography
                                                        sx={{
                                                            flexShrink: 0,
                                                            margin: 'auto',
                                                            marginLeft: '1rem',
                                                        }}
                                                    >
                                                        Unique:
                                                        {comp_unique_count}
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ flex: '50%' }}>
                                                    <Typography
                                                        sx={{
                                                            fontWeight: 700,
                                                            flexShrink: 0,
                                                            fontSize: '125%',
                                                            margin: 'auto',
                                                            marginLeft: '1rem',
                                                        }}
                                                    >
                                                        Job titles
                                                    </Typography>
                                                    <Typography
                                                        sx={{
                                                            flexShrink: 0,
                                                            margin: 'auto',
                                                            marginLeft: '1rem',
                                                        }}
                                                    >
                                                        High:{job_title_high}
                                                    </Typography>
                                                    <Typography
                                                        sx={{
                                                            flexShrink: 0,
                                                            margin: 'auto',
                                                            marginLeft: '1rem',
                                                        }}
                                                    >
                                                        Medium:
                                                        {job_title_medium}
                                                    </Typography>
                                                    <Typography
                                                        sx={{
                                                            flexShrink: 0,
                                                            margin: 'auto',
                                                            marginLeft: '1rem',
                                                        }}
                                                    >
                                                        Low:{job_title_low}
                                                    </Typography>
                                                    <Typography
                                                        sx={{
                                                            flexShrink: 0,
                                                            margin: 'auto',
                                                            marginLeft: '1rem',
                                                        }}
                                                    >
                                                        Unique:
                                                        {job_title_unique_count}
                                                    </Typography>
                                                </Box>
                                            </AccordionDetails>
                                        </Accordion>
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
