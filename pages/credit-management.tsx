import { Typography } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Container from '@mui/material/Container'
import CssBaseline from '@mui/material/CssBaseline'
import Paper from '@mui/material/Paper'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableFooter from '@mui/material/TableFooter'
import TableRow from '@mui/material/TableRow'
import Toolbar from '@mui/material/Toolbar'
import { useState } from 'react'
import useSWR, { useSWRConfig } from 'swr'
import Wrapper from '../components/Wrapper/Wrapper'
import WithProtection from '../libs/WithProtection'
import TableHead from '@mui/material/TableHead'

const marks = [
    {
        value: 100,
        label: '100',
    },
    {
        value: 500,
        label: '500',
    },
    {
        value: 1000,
        label: '1000',
    },
]

function calc(c: number) {
    if (c < 100) {
        return c * 1
    } else if (c >= 100 && c < 500) {
        const lower = c - 100
        return 100 + lower * 0.5
    } else {
        const lower = c - 500
        return 300 + lower * 0.1
    }
}

const priceMap: any = {
    '20': 1000,
    '100': 5000,
    '150': 10000,
    '300': 25000,
    '500': 50000,
    '800': 100000,
    '1750': 250000,
    '3000': 500000,
    '5000': 1000000,
}

function Profile() {
    const { fetcher, mutate } = useSWRConfig()
    const { data, error } = useSWR(`/api/credit-management/add-credits`)
    const [value, setValue] = useState(20)

    const handleChange = (event: SelectChangeEvent) => {
        setValue(parseInt(event.target.value, 10))
    }

    const handleAdd = async () => {
        if (fetcher) {
            await mutate(
                `/api/credit-management/add-credits`,
                fetcher(`/api/credit-management/add-credits`, {
                    credit_count: priceMap[value.toString() as any] + data,
                }),
                {
                    optimisticData: priceMap[value.toString() as any] + data,
                    rollbackOnError: true,
                }
            )
        }
    }

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <Wrapper pageName={'Credit Management'} />
            <Box
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
                <Container sx={{ mt: 1, mb: 1, height: '70%' }}>
                    {!error && (data || data === 0) ? (
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                gap: '3rem',
                                height: '100%',
                            }}
                        >
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
                            <Paper
                                sx={{
                                    p: 2,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    height: '20rem',
                                    marginTop: 2,
                                    flexBasis: '40%',

                                    justifyContent: 'space-between',
                                }}
                            >
                                <Typography sx={{ fontSize: '1.5rem' }}>
                                    Current credit count: {data}
                                </Typography>
                                <Box sx={{ textAlign: 'center' }}>
                                    <Select
                                        value={value.toString()}
                                        onChange={handleChange}
                                    >
                                        <MenuItem value={20}>1000</MenuItem>
                                        <MenuItem value={100}>5000</MenuItem>
                                        <MenuItem value={150}>10,000</MenuItem>
                                        <MenuItem value={300}>25,000</MenuItem>
                                        <MenuItem value={500}>50,000</MenuItem>
                                        <MenuItem value={800}>100,000</MenuItem>
                                        <MenuItem value={1750}>
                                            250,000
                                        </MenuItem>
                                        <MenuItem value={3000}>
                                            500,000
                                        </MenuItem>
                                        <MenuItem value={5000}>
                                            1,000,000
                                        </MenuItem>
                                    </Select>
                                </Box>
                                <Button
                                    variant="contained"
                                    sx={{ ml: 2 }}
                                    onClick={handleAdd}
                                >
                                    Pay £{value}
                                </Button>
                            </Paper>
                        </Box>
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
                </Container>
            </Box>
        </Box>
    )
}

export default WithProtection(Profile)
