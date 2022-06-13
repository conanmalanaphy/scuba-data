import DeleteIcon from '@mui/icons-material/Delete'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableFooter from '@mui/material/TableFooter'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import Typography from '@mui/material/Typography'
import * as React from 'react'

function Row({ row, handleClickExportOpen, onDelete }: any) {
    const [open, setOpen] = React.useState(false)

    const {
        name,
        row_count,
        created_at,
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
    } = row

    return (
        <React.Fragment>
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
                    {new Date(created_at).toLocaleDateString('en-UK', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                    })}
                </TableCell>
                <TableCell sx={{ textAlign: "right" }}>
                    <Button
                        variant="outlined"
                        sx={{
                            marginLeft: '1rem',
                            color: '#1565c0',
                            flex: '1 1 0px',
                        }}
                        onClick={(event: React.MouseEvent<HTMLElement>) => {
                            event.preventDefault()
                            event.stopPropagation()
                            handleClickExportOpen(id, row_count, file)
                        }}
                    >
                        Export
                    </Button>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={() => onDelete(id)}
                        sx={{
                            color: '#1976d2',
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
                                gap: "5rem"
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
                                <Box sx={{ display: "flex" }}>
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
                                    <Typography
                                    >
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
                                <Box sx={{ display: "flex" }}>
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
                                    <Typography
                                    >
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
        </React.Fragment>
    )
}
export default function TableC({
    data,
    sortBy,
    handleClickExportOpen,
    onDelete,
    requestSort,
}: any) {
    return (
        <Table>
            <TableHead>
                <TableRow >
                    <TableCell sx={{ width: '1rem' }}></TableCell>
                    <TableCell sx={{ fontWeight: "700" }}>
                        <TableSortLabel
                            active={sortBy.sortBy === 'name'}
                            direction={sortBy.sortDirection}
                            onClick={() => requestSort('name')}
                        >
                            Name
                        </TableSortLabel>
                    </TableCell>
                    <TableCell sx={{ fontWeight: "700" }}>
                        <TableSortLabel
                            active={sortBy.sortBy === 'uniqueRows'}
                            direction={sortBy.sortDirection}
                            onClick={() => requestSort('uniqueRows')}
                        >
                            Unique Rows
                        </TableSortLabel>
                    </TableCell>
                    <TableCell sx={{ fontWeight: "700" }}>
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
                {data.map((item: any, indx: number) => (
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
    )
}
