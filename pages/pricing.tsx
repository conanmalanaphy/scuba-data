import Box from '@mui/material/Box'
import React from 'react'
import TableHead from '@mui/material/TableHead'
import Layout from '../components/Homepage/layout/Layout'
import Link from '@mui/material/Link'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableFooter from '@mui/material/TableFooter'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'

export default function Pricing(): JSX.Element {
    return (
        <Layout>
            <Paper
                sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    flexBasis: '60%',
                    marginTop: 2,
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'start',
                        height: '100%',
                        width: '100%',
                    }}
                >
                    <Table aria-label="simple table">
                        <TableHead>
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
                                    Credits
                                </TableCell>
                                <TableCell align="right">
                                    Price per credit (p)
                                </TableCell>
                                <TableCell align="right">
                                    Total (£)
                                </TableCell>
                            </TableRow>
                        </TableHead>
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
                                    1000
                                </TableCell>
                                <TableCell align="right">
                                    0.02
                                </TableCell>
                                <TableCell align="right">
                                    20
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
                                    5000
                                </TableCell>
                                <TableCell align="right">
                                    0.02
                                </TableCell>
                                <TableCell align="right">
                                    100
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
                                    10000
                                </TableCell>
                                <TableCell align="right">
                                    0.015
                                </TableCell>
                                <TableCell align="right">
                                    150
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
                                    10000
                                </TableCell>
                                <TableCell align="right">
                                    0.015
                                </TableCell>
                                <TableCell align="right">
                                    150
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
                                    25000
                                </TableCell>
                                <TableCell align="right">
                                    0.012
                                </TableCell>
                                <TableCell align="right">
                                    300
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
                                    50000
                                </TableCell>
                                <TableCell align="right">
                                    0.01
                                </TableCell>
                                <TableCell align="right">
                                    500
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
                                    100000
                                </TableCell>
                                <TableCell align="right">
                                    0.008
                                </TableCell>
                                <TableCell align="right">
                                    800
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
                                    250000
                                </TableCell>
                                <TableCell align="right">
                                    0.007
                                </TableCell>
                                <TableCell align="right">
                                    1750
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
                                    500000
                                </TableCell>
                                <TableCell align="right">
                                    0.006
                                </TableCell>
                                <TableCell align="right">
                                    3000
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
                                    1000000
                                </TableCell>
                                <TableCell align="right">
                                    0.005
                                </TableCell>
                                <TableCell align="right">
                                    5000
                                </TableCell>
                            </TableRow>
                        </TableBody>
                        <TableFooter />
                    </Table>
                </Box>
            </Paper>
          </Box>
        </Layout>
    )
}
