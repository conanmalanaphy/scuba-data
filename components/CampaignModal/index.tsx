import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    MenuItem,
    Select,
    TextField,
    InputLabel,
} from '@mui/material'
import { useState } from 'react'

interface CampaignModalProps {
    isOpen: boolean
    handleClose: () => void
    onSubmit: (name: any) => void
    campaigns?: Campaign[]
}

export default function CampaignModal({
    isOpen,
    handleClose,
    onSubmit,
    campaigns,
}: CampaignModalProps) {
    const [name, setName] = useState('')
    const [campaign, setCampaign] = useState('')

    const handleChange = (event: any) => {
        setCampaign(event.target.value as string)
    }

    return (
        <Dialog open={isOpen} onClose={handleClose}>
            <DialogTitle>Create a Campaign</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Name"
                    type="email"
                    fullWidth
                    variant="standard"
                    value={name}
                    onChange={(event) => {
                        setName(event.target.value)
                    }}
                    onKeyPress={(ev) => {
                        if (ev.key === 'Enter') {
                            ev.preventDefault()

                            const foundCampaign = campaigns?.find((a) => {
                                return a.id == campaign
                            })
                            onSubmit({ ...foundCampaign, id: '', name })
                        }
                    }}
                />
                {campaigns ? (
                    <FormControl fullWidth sx={{ mt: 3 }}>
                        <InputLabel id="demo-simple-select-label">
                            Campaign
                        </InputLabel>
                        <Select
                            value={campaign}
                            label="Select Campaign"
                            onChange={handleChange}
                        >
                            {campaigns?.map((item) => {
                                return (
                                    <MenuItem
                                        key={item.id.toString()}
                                        value={item.id.toString()}
                                    >
                                        {item.name}
                                    </MenuItem>
                                )
                            })}
                        </Select>
                    </FormControl>
                ) : null}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button
                    onClick={() => {
                        const foundCampaign = campaigns?.find((a) => {
                            return a.id == campaign
                        })

                        onSubmit({ ...foundCampaign, name, id: '' })
                    }}
                    disabled={name.length === 0}
                >
                    Add
                </Button>
            </DialogActions>
        </Dialog>
    )
}
