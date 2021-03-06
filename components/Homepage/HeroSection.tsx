import React from 'react'
import { Typography, Box, Grid, Container } from '@mui/material'
import Image from 'next/image'

type Props = {
    title: string
    subtitle: string
    image: string
    children?: React.ReactNode
}

export default function HeroSection({
    title,
    subtitle,
    image,
    children,
}: Props) {
    return (
        <Box sx={{ backgroundColor: (theme) => theme.palette.secondary.main }}>
            <Container maxWidth="md">
                <Grid container alignItems="center" sx={{ py: 12 }}>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="h1">{title}</Typography>
                        <Typography variant="body1">{subtitle}</Typography>
                        {children}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Container>
                            <Image
                                src={image}
                                width={400}
                                height={400}
                                alt="Diver"
                            />
                        </Container>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    )
}
