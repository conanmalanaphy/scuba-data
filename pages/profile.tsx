import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import CssBaseline from '@mui/material/CssBaseline'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import * as React from 'react'
import Wrapper from '../components/Wrapper/Wrapper'
import { supabase } from '../libs/initSupabase'
import WithProtection from '../libs/WithProtection'
import { useState } from 'react'

function Profile() {
    const profile = supabase.auth.user()
    const [newPassword1, setNewPassword1] = useState("")
    const [newPassword2, setNewPassword2] = useState("")
    const [email, setEmail] = useState("")

    const handleResetPassword = async(
        event?: React.SyntheticEvent | Event,
        reason?: string
    ) => {
        debugger;

        console.log(profile)
        if(newPassword1 === newPassword2){
            const { user, error } = await supabase.auth.update({password: newPassword1})
            console.log(user)
            console.log(error)
        }
    }


    const handleResetEmail = async(
        event?: React.SyntheticEvent | Event,
        reason?: string
    ) => {
        const { user, error } = await supabase.auth.update({email: email})
    }
    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <Wrapper pageName={'Profile'} />
            <Box
                component="main"
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
                <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                    <Paper
                        sx={{
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            height: '100%',
                            width: '100%',
                            marginTop: 2,
                        }}
                    >
                        <Typography component="h1" variant="h5">
                            Update Email
                        </Typography>
                        <Box
                            component="form"
                            noValidate
                            sx={{ mt: 3 }}
                        >
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        value={profile?.email || ''}
                                        id="email"
                                        label="Current Email Address"
                                        name="email"
                                        autoComplete="email"
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        name="password"
                                        label="New Email Address"
                                        id="password"
                                        autoComplete="new-password"
                                        value={email}
                                        onChange={(e)=>{setEmail(e.currentTarget.value)}}
                                    />
                                </Grid>
                            </Grid>
                            <Button
                                fullWidth
                                variant="contained"
                            onClick={handleResetEmail}

                                sx={{ mt: 3, mb: 2 }}
                            >
                                Confirm
                            </Button>
                        </Box>
                    </Paper>
                    <Paper
                        sx={{
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            height: '100%',
                            width: '100%',
                            marginTop: 2,
                        }}
                    >
                        <Typography component="h1" variant="h5">
                            Update Password
                        </Typography>
                        <Box
                            component="form"
                            noValidate
                            sx={{ mt: 3 }}
                        >
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        name="password"
                                        label="New Password"
                                        type="password"
                                        id="password1"
                                        autoComplete="new-password"
                                        value={newPassword1}
                                        onChange={(e)=>{setNewPassword1(e.currentTarget.value)}}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        name="password"
                                        label="Confirm New Password"
                                        type="password"
                                        id="password2"
                                        autoComplete="new-password"
                                        onChange={(e)=>{setNewPassword2(e.currentTarget.value)}}
                                        value={newPassword2}
                                    />
                                </Grid>
                            </Grid>
                            <Button
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            onClick={handleResetPassword}

                            >
                                Confirm
                            </Button>
                        </Box>
                    </Paper>
                </Container>
            </Box>
        </Box>
    )
}

export default WithProtection(Profile)
