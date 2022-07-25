import {
    Box,
    Collapse,
    Table,
    TableBody,
    TableCell,
    TableRow,
    Typography,
} from '@mui/material'

interface FooterProps {
    open: boolean
    row: FormPost
}

export default function Footer({ open, row }: FooterProps) {
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

    return (
        <TableRow>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
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
                                        <TableCell component="th" scope="row">
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
                                        <TableCell component="th" scope="row">
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
                                        <TableCell component="th" scope="row">
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
                                        <TableCell component="th" scope="row">
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
                                        <TableCell component="th" scope="row">
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
                                        <TableCell component="th" scope="row">
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
    )
}
