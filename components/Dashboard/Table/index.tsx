import {
    Box,
    Paper,
    Table as MUITable,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableRow,
    TableSortLabel,
    TextField,
} from '@mui/material'
import { ChangeEvent, useEffect, useState } from 'react'
import Row from './Row'
import { filterlist, sortData } from './row.HELPER'

interface TableProps {
    data: formPost[]
    handleClickExportOpen: (
        id: number | undefined,
        cost: number,
        fileUrl: string,
        paid_for: boolean | undefined
    ) => void
    onDelete: (id: number) => void
}

export default function Table({
    data,
    handleClickExportOpen,
    onDelete,
}: TableProps) {
    const [sortBy, setSortBy] = useState<SortBy>({
        sortBy: 'name',
        sortDirection: 'asc',
    })
    const [sortedData, setSortedData] = useState<formPost[]>([])

    const requestSort = (pSortBy: string) => {
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
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
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
                <MUITable>
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
                        {sortedData.map((item, indx: number) => (
                            <Row
                                row={item}
                                key={indx}
                                handleClickExportOpen={handleClickExportOpen}
                                onDelete={onDelete}
                            />
                        ))}
                    </TableBody>
                    <TableFooter />
                </MUITable>
            </Paper>
        </Box>
    )
}
