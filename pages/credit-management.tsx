import { Typography } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Container from '@mui/material/Container'
import CssBaseline from '@mui/material/CssBaseline'
import Paper from '@mui/material/Paper'
import Slider from '@mui/material/Slider'
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

function Profile() {
    const { fetcher, mutate } = useSWRConfig()
    const { data, error } = useSWR(`/api/credit-management/add-credits`)
    const [value, setValue] = useState(100)

    const handleAdd = async () => {
        if (fetcher) {
            await mutate(
                `/api/credit-management/add-credits`,
                fetcher(`/api/credit-management/add-credits`, {
                    credit_count: value + data,
                }),
                { optimisticData: value + data, rollbackOnError: true }
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
                <Container sx={{ mt: 4, mb: 4, height: '70%' }}>
                    {!error && data ? (
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                gap: '3rem',
                                height: '25rem',
                            }}
                        >
                            <Paper
                                sx={{
                                    p: 2,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    height: '100%',
                                    flexBasis: '30%',
                                    marginTop: 2,
                                }}
                            >
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'start',
                                        height: '100%',
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontSize: '2rem',
                                        }}
                                    >
                                        Pricing:
                                    </Typography>
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
                                                    1-100
                                                </TableCell>
                                                <TableCell align="right">
                                                    £1 per credit
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
                                                    100-500
                                                </TableCell>
                                                <TableCell align="right">
                                                    50p per credit
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
                                                    500-1000
                                                </TableCell>
                                                <TableCell align="right">
                                                    10p per credit
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
                                    height: '100%',
                                    flexBasis: '70%',
                                    marginTop: 2,
                                    justifyContent: 'space-between',
                                }}
                            >
                                <Typography sx={{ fontSize: '2rem' }}>
                                    Credit count: {data}
                                </Typography>
                                <Box sx={{ textAlign: 'center' }}>
                                    <Slider
                                        aria-label="Always visible"
                                        value={value}
                                        onChange={(e: any) => {
                                            setValue(e.target.value)
                                        }}
                                        step={1}
                                        marks={marks}
                                        valueLabelDisplay="on"
                                        min={1}
                                        max={1000}
                                    />
                                    <b>£{calc(value)}</b>
                                </Box>
                                <Button
                                    variant="contained"
                                    sx={{ ml: 2 }}
                                    onClick={handleAdd}
                                >
                                    Add {value} more tokens
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
