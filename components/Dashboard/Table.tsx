import {
    Delete as DeleteIcon,
    Error as ErrorIcon,
    KeyboardArrowDown as KeyboardArrowDownIcon,
    KeyboardArrowUp as KeyboardArrowUpIcon,
} from '@mui/icons-material'
import {
    Box,
    Button,
    CircularProgress,
    Collapse,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableRow,
    TableSortLabel,
    TextField,
    Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'

interface RowProps {
    row: formPost
    handleClickExportOpen: (
        id: number | undefined,
        row_count: number,
        file: any,
        paid_for: boolean
    ) => void
    onDelete: (id: number | undefined) => void
}
function Row({ row, handleClickExportOpen, onDelete }: RowProps) {
    const [open, setOpen] = useState(false)

    const {
        name,
        row_count,
        created_at,
        id,
        file,
        paid_for,
        comp_high,
        comp_medium,
        comp_low,
        job_title_high,
        job_title_medium,
        job_title_low,
        job_title_unique_count,
        comp_unique_count,
        is_processing,
        expected_completion_time,
        error,
    } = row

    return is_processing || error ? (
        <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
            <TableCell component="th" scope="row" sx={{ width: '1rem' }}>
                <IconButton
                    aria-label="expand row"
                    size="small"
                    onClick={() => setOpen(!open)}
                >
                    {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
            </TableCell>
            <TableCell component="th" scope="row">
                {name}
            </TableCell>
            {is_processing ? (
                <TableCell
                    sx={{ fontWeight: '500', fontStyle: 'italic' }}
                    colSpan={3}
                >
                    Expected Completion:{' '}
                    {new Intl.DateTimeFormat('en-GB', {
                        timeStyle: 'medium',
                        dateStyle: 'medium',
                    }).format(new Date(expected_completion_time))}
                </TableCell>
            ) : (
                <TableCell sx={{ color: 'red', fontWeight: '700' }} colSpan={4}>
                    <Typography sx={{ display: 'flex', gap: '1rem' }}>
                        {' '}
                        <ErrorIcon></ErrorIcon>
                        {error}
                    </Typography>
                </TableCell>
            )}
            {is_processing ? (
                <TableCell>
                    <CircularProgress />
                </TableCell>
            ) : null}
        </TableRow>
    ) : (
        <>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell component="th" scope="row" sx={{ width: '1rem' }}>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? (
                            <KeyboardArrowUpIcon />
                        ) : (
                            <KeyboardArrowDownIcon />
                        )}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    {name}
                </TableCell>
                <TableCell>{row_count}</TableCell>
                <TableCell>
                    {new Intl.DateTimeFormat('en-GB', {
                        timeStyle: 'medium',
                        dateStyle: 'medium',
                    }).format(new Date(created_at))}
                </TableCell>
                <TableCell sx={{ textAlign: 'right' }}>
                    <Button
                        variant="outlined"
                        sx={{
                            marginLeft: '1rem',
                            flex: '1 1 0px',
                            backgroundColor: paid_for ? 'green' : 'inherit',
                            color: paid_for ? 'white' : 'inherit',
                        }}
                        onClick={(event: React.MouseEvent<HTMLElement>) => {
                            event.preventDefault()
                            event.stopPropagation()
                            handleClickExportOpen(id, row_count, file, paid_for)
                        }}
                    >
                        Export
                    </Button>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={() => onDelete(id)}
                        sx={{
                            marginLeft: '1rem',
                        }}
                    >
                        <DeleteIcon />
                    </IconButton>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell
                    style={{ paddingBottom: 0, paddingTop: 0 }}
                    colSpan={6}
                >
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box
                            sx={{
                                display: 'flex',
                                width: '100%',
                                padding: '1rem',
                                paddingLeft: '3rem',
                                gap: '5rem',
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
                                        Unique Rows: {job_title_unique_count}
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
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    )
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

function filterlist(list: formPost[], name: string) {
    return list.filter(function (s: formPost) {
        return s.name.match(name)
    })
}

type SortDirection = 'asc' | 'desc'
interface sortBy {
    sortBy: string
    sortDirection: SortDirection
}
export default function TableC({ data, handleClickExportOpen, onDelete }: any) {
    const [sortBy, setSortBy] = useState<sortBy>({
        sortBy: 'name',
        sortDirection: 'asc',
    })
    const [sortedData, setSortedData] = useState<any>([])

    const requestSort = (pSortBy: any) => {
        let sortOrder: SortDirection = 'asc'
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
        setSortedData(sortData(data, sortBy))
    }, [data, sortBy, setSortedData])

    return (
        <Box sx={{ marginTop: '-3rem' }}>
            <TextField
                sx={{ width: 300 }}
                autoFocus
                label="Filter Results"
                type="email"
                variant="standard"
                onChange={(event: any) => {
                    setSortedData(filterlist(data, event.target.value))
                }}
            />
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
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ width: '1rem' }}></TableCell>
                            <TableCell sx={{ fontWeight: '700' }}>
                                <TableSortLabel
                                    active={sortBy.sortBy === 'name'}
                                    direction={sortBy.sortDirection}
                                    onClick={() => requestSort('name')}
                                >
                                    Name
                                </TableSortLabel>
                            </TableCell>
                            <TableCell sx={{ fontWeight: '700' }}>
                                <TableSortLabel
                                    active={sortBy.sortBy === 'uniqueRows'}
                                    direction={sortBy.sortDirection}
                                    onClick={() => requestSort('uniqueRows')}
                                >
                                    Unique Rows
                                </TableSortLabel>
                            </TableCell>
                            <TableCell sx={{ fontWeight: '700' }}>
                                <TableSortLabel
                                    active={sortBy.sortBy === 'Created Date'}
                                    direction={sortBy.sortDirection}
                                    onClick={() => requestSort('createdDate')}
                                >
                                    Created date
                                </TableSortLabel>
                            </TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedData.map((item: any, indx: number) => (
                            <Row
                                row={item}
                                key={indx}
                                handleClickExportOpen={handleClickExportOpen}
                                onDelete={onDelete}
                            />
                        ))}
                    </TableBody>
                    <TableFooter />
                </Table>
            </Paper>
        </Box>
    )
}
