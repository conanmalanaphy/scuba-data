import React from 'react'
import { Container } from '@mui/material'

interface Props {
    children: React.ReactNode
}

export default function FeatureContainer({ children }: Props): JSX.Element {
    return (
        <Container maxWidth="md" sx={{ mt: 3, pb: { xs: 8, md: 12 } }}>
            {children}
        </Container>
    )
}
