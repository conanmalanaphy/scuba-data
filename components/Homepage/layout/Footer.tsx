import { Typography, Box } from '@mui/material'

export default function Footer() {
    return (
        <Box sx={{ py: 3 }}>
            <Typography variant="body2" align="center">
                {'Copyright © ScubaData '}
                {new Date().getFullYear()}.
            </Typography>
        </Box>
    )
}
