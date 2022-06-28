import React from 'react'
import { Typography, Box, Grid, Container, Button } from '@mui/material'
import Image from 'next/image'

export default function ContactSection(): JSX.Element {
    return (
        <Container maxWidth="md">
            <Box
                sx={{
                    backgroundColor: (theme) => theme.palette.secondary.main,
                    borderRadius: 4,
                    p: 2,
                }}
                id="contact-us"
            >
                <Grid container alignItems="center" spacing={4}>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="h2">Contact us</Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            Get in touch to ask us anything, sales or otherwise!
                        </Typography>
                        <Button
                            variant="contained"
                            href="mailto:conanmalanaphy@gmail.com"
                        >
                            Send an email
                        </Button>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Container>
                            <Image src="/diver.svg" width={400} height={250} />
                        </Container>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    )
}
