import { Box } from '@mui/material'
import Footer from './Footer'
import Header from './Header'

type Props = {
    children: React.ReactNode
    isAlt?: boolean
}

export default function Layout({
    children,
    isAlt = false,
}: Props): JSX.Element {
    return (
        <Box
            sx={{
                backgroundColor: (theme) =>
                    isAlt
                        ? theme.palette.secondary.main
                        : theme.palette.background.default,
                minHeight: '100vh',
            }}
        >
            <Header />
            <main>{children}</main>
            <Footer />
        </Box>
    )
}
