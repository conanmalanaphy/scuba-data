import {
    Typography,
    Container,
    Grid,
    Box,
    Divider,
    Button,
} from '@mui/material'
import Link from 'next/link'

export default function Header() {
    return (
        <Box
            sx={{
                backgroundColor: (theme) => theme.palette.background.default,
            }}
        >
            <Container maxWidth="md" sx={{ py: 1 }}>
                <Grid container alignItems="center">
                    <Grid item xs={2}>
                        <Link href="/" passHref>
                            <Typography
                                variant="body1"
                                align="center"
                                sx={{ fontWeight: 600, cursor: 'pointer' }}
                            >
                                ScubaData
                            </Typography>
                        </Link>
                    </Grid>
                    <Grid container item xs={10} justifyContent="flex-end">
                        <Link href="/pricing" passHref>
                            <Button sx={{ mr: 2 }}>Pricing</Button>
                        </Link>
                        <Link href="/login-page" passHref>
                            <Button sx={{ mr: 2 }}>Login</Button>
                        </Link>
                    </Grid>
                </Grid>
            </Container>
            <Divider />
        </Box>
    )
}
