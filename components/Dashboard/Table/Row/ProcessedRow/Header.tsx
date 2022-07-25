import {
    Delete as DeleteIcon,
    KeyboardArrowDown as KeyboardArrowDownIcon,
    KeyboardArrowUp as KeyboardArrowUpIcon,
} from '@mui/icons-material'
import { Button, IconButton, TableCell, TableRow } from '@mui/material'

interface HeaderProps {
    setOpen: (isOpen: boolean) => void
    open: boolean
    row: FormPost
    handleClickExportOpen: (
        id: number | undefined,
        row_count: number,
        file: string,
        paid_for: boolean | undefined
    ) => void
    onDelete: (id: number) => void
}

export default function Header({
    setOpen,
    open,
    row,
    handleClickExportOpen,
    onDelete,
}: HeaderProps) {
    const { name, row_count, created_at, id, file, paid_for } = row

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
                    onClick={() => onDelete(id as number)}
                    sx={{
                        marginLeft: '1rem',
                    }}
                >
                    <DeleteIcon />
                </IconButton>
            </TableCell>
        </TableRow>
    )
}
