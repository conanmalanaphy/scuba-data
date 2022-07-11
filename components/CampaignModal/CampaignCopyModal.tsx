import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'
import { useState } from 'react'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'

interface item {
    name: string
    isIncluded: boolean
}

interface Campaign {
    user_id: string
    id: string
    name: string
    state: string
    seniorites: item[]
    keywords: item[]
    companysList: item[]
    jobTitles: item[]
}

interface CampaignModalProps {
    isOpen: boolean
    handleClose: () => void
    onSubmit: (campaign: any) => void
    campaigns: Campaign[]
}
export default function CampaignModal({
    isOpen,
    handleClose,
    onSubmit,
    campaigns,
}: CampaignModalProps) {
    const [name, setName] = useState('')
    const [campaign, setCampaign] = useState('')

    const handleChange = (event: SelectChangeEvent) => {
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
