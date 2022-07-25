import {
    Box,
    Collapse,
    Table,
    TableBody,
    TableCell,
    TableRow,
    Typography,
    ToggleButton,
    ToggleButtonGroup,
} from '@mui/material'
import BarChartIcon from '@mui/icons-material/BarChart'
import TableRowsIcon from '@mui/icons-material/TableRows'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

import { useState } from 'react'
interface FooterProps {
    open: boolean
    row: FormPost
}

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const options = {
    plugins: {
        title: {
            display: false,
        },
        legend: {
            display: false,
        },
    },
    scaleShowLabels: false,
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        x: {
            stacked: true,
            ticks: {
                //option 2, use callback to change labels to empty string
                callback: () => '',
            },
            grid: {
                display: false,
            },
        },
        y: {
            stacked: true,
            grid: {
                display: false,
            },
        },
    },
}
const labels = ['Job Title', 'Company']

export default function Footer({ open, row }: FooterProps) {
    const [isChart, setIsChart] = useState(true)
    const {
        comp_high,
        comp_medium,
        comp_low,
        job_title_high,
        job_title_medium,
        job_title_low,
        job_title_unique_count,
        comp_unique_count,
    } = row

    const data = {
        labels,
        datasets: [
            {
                label: 'Low',
                data: [comp_low, job_title_low],
                backgroundColor: 'rgb(255, 99, 132)',
            },
            {
                label: 'Medium',
                data: [comp_medium, job_title_medium],
                backgroundColor: 'rgb(75, 192, 192)',
            },
            {
                label: 'High',
                data: [comp_high, job_title_high],
                backgroundColor: 'rgb(53, 162, 235)',
            },
        ],
    }

    return (
        <TableRow>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <Box
                        sx={{
                            display: 'flex',
                            padding: '1rem',
                            height: '15rem',
                        }}
                    >
                        <ToggleButtonGroup
                            orientation="vertical"
                            value={isChart}
                            exclusive
                            onChange={() => setIsChart(!isChart)}
                            sx={{ mt: 'auto', mb: 'auto' }}
                        >
                            <ToggleButton
                                value={true}
                                aria-label="module"
                                sx={{ height: '50%' }}
                            >
                                <BarChartIcon />
                            </ToggleButton>
                            <ToggleButton
                                value={false}
                                aria-label="quilt"
                                sx={{ height: '50%' }}
                            >
                                <TableRowsIcon />
                            </ToggleButton>
                        </ToggleButtonGroup>
                        {isChart ? (
                            <Box
                                sx={{
                                    ml: '2rem',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    gap: '2rem',
                                }}
                            >
                                <Box sx={{ width: '80%' }}>
                                    <Bar options={options} data={data} />
                                </Box>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        margin: 'auto',
                                        gap: '1rem',
                                        width: '10rem',
                                    }}
                                >
                                    <Box sx={{ display: 'flex' }}>
                                        <Typography>
                                            Unique Rows: {comp_unique_count}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex' }}>
                                        <Typography>
                                            Unique Rows:{' '}
                                            {job_title_unique_count}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        ) : (
                            <Box
                                sx={{
                                    display: 'flex',
                                    padding: '1rem',
                                    paddingLeft: '3rem',
                                    gap: '5rem',
                                    width: '100%',
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
                                    <Box sx={{ display: 'flex' }}>
                                        <Typography
                                            sx={{
                                                fontWeight: 700,
                                                flexShrink: 0,
                                                fontSize: '125%',
                                                margin: 'auto',
                                                marginLeft: '0rem',
                                            }}
                                        >
                                            Companies
                                        </Typography>
                                        <Typography>
                                            Unique Rows: {comp_unique_count}
                                        </Typography>
                                    </Box>
                                    <Table aria-label="simple table">
                                        <TableBody>
                                            <TableRow
                                                sx={{
                                                    '&:last-child td, &:last-child th':
                                                        { border: 0 },
                                                }}
                                            >
                                                <TableCell
                                                    component="th"
                                                    scope="row"
                                                >
                                                    High
                                                </TableCell>
                                                <TableCell align="right">
                                                    {comp_high}
                                                </TableCell>
                                            </TableRow>
                                            <TableRow
                                                sx={{
                                                    '&:last-child td, &:last-child th':
                                                        { border: 0 },
                                                }}
                                            >
                                                <TableCell
                                                    component="th"
                                                    scope="row"
                                                >
                                                    Medium
                                                </TableCell>
                                                <TableCell align="right">
                                                    {comp_medium}
                                                </TableCell>
                                            </TableRow>
                                            <TableRow
                                                sx={{
                                                    '&:last-child td, &:last-child th':
                                                        { border: 0 },
                                                }}
                                            >
                                                <TableCell
                                                    component="th"
                                                    scope="row"
                                                >
                                                    Low
                                                </TableCell>
                                                <TableCell align="right">
                                                    {comp_low}
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </Box>
                                <Box sx={{ flex: '50%' }}>
                                    <Box sx={{ display: 'flex' }}>
                                        <Typography
                                            sx={{
                                                fontWeight: 700,
                                                flexShrink: 0,
                                                fontSize: '125%',
                                                margin: 'auto',
                                                marginLeft: '0rem',
                                            }}
                                        >
                                            Job titles
                                        </Typography>
                                        <Typography>
                                            Unique Rows:{' '}
                                            {job_title_unique_count}
                                        </Typography>
                                    </Box>
                                    <Table aria-label="simple table">
                                        <TableBody>
                                            <TableRow
                                                sx={{
                                                    '&:last-child td, &:last-child th':
                                                        { border: 0 },
                                                }}
                                            >
                                                <TableCell
                                                    component="th"
                                                    scope="row"
                                                >
                                                    High
                                                </TableCell>
                                                <TableCell align="right">
                                                    {job_title_high}
                                                </TableCell>
                                            </TableRow>
                                            <TableRow
                                                sx={{
                                                    '&:last-child td, &:last-child th':
                                                        { border: 0 },
                                                }}
                                            >
                                                <TableCell
                                                    component="th"
                                                    scope="row"
                                                >
                                                    Medium
                                                </TableCell>
                                                <TableCell align="right">
                                                    {job_title_medium}
                                                </TableCell>
                                            </TableRow>
                                            <TableRow
                                                sx={{
                                                    '&:last-child td, &:last-child th':
                                                        { border: 0 },
                                                }}
                                            >
                                                <TableCell
                                                    component="th"
                                                    scope="row"
                                                >
                                                    Low
                                                </TableCell>
                                                <TableCell align="right">
                                                    {job_title_low}
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </Box>
                            </Box>
                        )}
                    </Box>
                </Collapse>
            </TableCell>
        </TableRow>
    )
}
