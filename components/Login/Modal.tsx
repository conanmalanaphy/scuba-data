import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Stepper from '../Dashboard/Stepper'
import { supabase } from '../../libs/initSupabase'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { useState } from 'react'

interface ModalProps {
    isOpen: boolean
    handleClose: () => void
}

export default function Modal({ isOpen, handleClose }: ModalProps) {
    const [email, setEmail] = useState('')

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault()

        const { data, error } = await supabase.auth.api.resetPasswordForEmail(
            email.trim()
        )

        if (error) {
            alert(JSON.stringify(error))
        } else {
            setEmail('')
            handleClose()
        }
    }

    return (
        <Dialog
            open={isOpen}
            onClose={handleClose}
            fullWidth={true}
            maxWidth={'sm'}
        >
            <DialogTitle>Reset Password</DialogTitle>
            <DialogContent>
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
                <Button
                    variant="contained"
                    component="h1"
                    disabled={email.length === 0}
                    fullWidth
                    onClick={handleSignIn}
                >
                    Reset Password
                </Button>
            </DialogContent>
        </Dialog>
    )
}
