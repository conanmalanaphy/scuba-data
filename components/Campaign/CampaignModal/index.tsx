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
    SelectChangeEvent,
} from '@mui/material'
import { useState, KeyboardEvent } from 'react'

interface CampaignModalProps {
    isOpen: boolean
    handleClose: () => void
    onSubmit: (campaign: Partial<Campaign>) => void
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

    const handleChange = (event: SelectChangeEvent<string>) => {
        setCampaign(event.target.value)
    }

    const onKeyPress = (ev: KeyboardEvent<HTMLInputElement>) => {
        if (ev.key === 'Enter') {
            ev.preventDefault()

            const foundCampaign = campaigns?.find((a) => {
                return a.id == campaign
            })
            onSubmit({ ...foundCampaign, id: '', name })
        }
    }

    const onSubmitClicked = () => {
        const foundCampaign = campaigns?.find((a) => {
            return a.id == campaign
        })

        onSubmit({ ...foundCampaign, name, id: '' })
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
                    onKeyPress={onKeyPress}
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
                <Button onClick={onSubmitClicked} disabled={name.length === 0}>
                    Add
                </Button>
            </DialogActions>
        </Dialog>
    )
}
