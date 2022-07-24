import {
    Error as ErrorIcon,
    KeyboardArrowDown as KeyboardArrowDownIcon,
    KeyboardArrowUp as KeyboardArrowUpIcon,
} from '@mui/icons-material'
import {
    CircularProgress,
    IconButton,
    TableCell,
    TableRow,
    Typography,
} from '@mui/material'

interface RowProps {
    setOpen: (isOpen: boolean) => void
    open: boolean
    is_processing: boolean
    name: string
    expected_completion_time: string
    error: string
}

export default function ProcessedRow({
    setOpen,
    open,
    is_processing,
    name,
    expected_completion_time,
    error,
}: RowProps) {
    return (
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
    )
}
