import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CssBaseline from '@mui/material/CssBaseline'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useRouter } from 'next/router'
import * as React from 'react'
import { useState } from 'react'
import Snackbar from '@mui/material/Snackbar'
import Alert from '../Alert'
import { supabase } from '../../libs/initSupabase'
import ResetPasswordModal from './Modal'

export default function SignInSide() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [isOpen, setIsOpen] = useState(false)
    const [password, setPassword] = useState('')
    const [errorOpen, setErrorOpen] = React.useState('')

    const handleClose = (
        event?: React.SyntheticEvent | Event,
        reason?: string
    ) => {
        if (reason === 'clickaway') {
            return
        }

        setErrorOpen('')
    }

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault()

        const { error } = await supabase.auth.signIn({
            email: email.trim(),
            password: password.trim(),
        })

        if (error) {
            setErrorOpen(error.message)
        } else {
            router.push('/dashboard')
        }
    }

    return (
        <Grid container component="main" sx={{ height: '100vh' }}>
            <CssBaseline />
            <Grid
                item
                xs={false}
                sm={4}
                md={7}
                sx={{
                    backgroundImage: 'url(/card.svg)',
                    backgroundRepeat: 'no-repeat',
                    backgroundColor: '#A2D4DE',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    verticalAlign: 'middle',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                }}
            ></Grid>
            <Grid
                item
                xs={12}
                sm={8}
                md={5}
                component={Paper}
                elevation={6}
                square
            >
                <ResetPasswordModal
                    isOpen={isOpen}
                    handleClose={() => {
                        setIsOpen(false)
                    }}
                />
                <Snackbar
                    open={errorOpen.length > 0}
                    autoHideDuration={6000}
                    onClose={handleClose}
                >
                    <Alert
                        onClose={handleClose}
                        severity="error"
                        sx={{ width: '100%' }}
                    >
                        {errorOpen}
                    </Alert>
                </Snackbar>
                <Box
                    sx={{
                        my: 8,
                        mx: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1 }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <Box
                        component="form"
                        noValidate
                        onSubmit={handleSignIn}
                        sx={{ mt: 1 }}
                    >
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={email}
                            onChange={(
                                event: React.ChangeEvent<
                                    HTMLInputElement | HTMLTextAreaElement
                                >
                            ) => {
                                setEmail(event?.target.value)
                            }}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(
                                event: React.ChangeEvent<
                                    HTMLInputElement | HTMLTextAreaElement
                                >
                            ) => {
                                setPassword(event?.target.value)
                            }}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    handleSignIn(e)
                                }
                            }}
                        />
                        <Link
                            sx={{
                                textDecoration: 'none',
                            }}
                        >
                            <Button
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                onClick={handleSignIn}
                            >
                                Sign In
                            </Button>
                        </Link>
                        <Link href="/sign-up">
                            <Button
                                variant="contained"
                                component="h1"
                                fullWidth
                            >
                                Create Account
                            </Button>
                        </Link>
                        <Button
                            fullWidth
                            sx={{ mt: '1rem' }}
                            onClick={() => {
                                setIsOpen(true)
                            }}
                        >
                            Reset Password
                        </Button>
                    </Box>
                </Box>
            </Grid>
        </Grid>
    )
}
