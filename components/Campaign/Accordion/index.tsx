import {
    Archive as ArchiveIcon,
    Delete as DeleteIcon,
} from '@mui/icons-material'
import {
    Accordion as MUIAccordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    IconButton,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
} from '@mui/material'
import Item from './Item'

interface AccordProps {
    isExpanded: boolean
    isDisabled: boolean
    handleChange: () => void
    item: Campaign
    updateData: (items: Campaign) => void
    sendToArchive?: () => void
    onDelete?: () => void
}

export default function Accord({
    isExpanded,
    isDisabled,
    handleChange,
    item,
    updateData,
    sendToArchive,
    onDelete,
}: AccordProps) {
    return (
        <MUIAccordion expanded={isExpanded} onChange={handleChange}>
            <AccordionSummary
                aria-controls="panel1bh-content"
                id="panel1bh-header"
            >
                <Typography
                    sx={{
                        fontWeight: 700,
                        width: '33%',
                        flexShrink: 0,
                        fontSize: '125%',
                        margin: 'auto',
                        marginLeft: '1rem',
                    }}
                >
                    {item.name}
                </Typography>
                {sendToArchive ? (
                    <ToggleButtonGroup
                        color="primary"
                        value={item.state}
                        exclusive
                        onChange={(
                            event: React.MouseEvent<HTMLElement>,
                            newAlignment: string
                        ) => {
                            event.preventDefault()
                            event.stopPropagation()
                            updateData({ ...item, state: newAlignment })
                        }}
                    >
                        <ToggleButton value="LIVE">LIVE</ToggleButton>
                        <ToggleButton value="INACTIVE">INACTIVE</ToggleButton>
                    </ToggleButtonGroup>
                ) : null}
                {sendToArchive ? (
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={sendToArchive}
                        sx={{
                            marginLeft: '1rem',
                        }}
                    >
                        <ArchiveIcon />
                    </IconButton>
                ) : null}
                {onDelete ? (
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={onDelete}
                        sx={{
                            marginLeft: '1rem',
                        }}
                    >
                        <DeleteIcon />
                    </IconButton>
                ) : null}
            </AccordionSummary>
            <AccordionDetails
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    borderTop: 'lightgray solid 1px',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        flex: '60%',
                        maxWidth: '60%',
                        paddingLeft: '1rem',
                        paddingRight: '1rem',
                        justifyContent: 'space-between',
                    }}
                >
                    <Item
                        label="Seniorites"
                        updateData={(data: CampaignItem[]) => {
                            updateData({ ...item, seniorites: data })
                        }}
                        items={item.seniorites}
                        isDisabled={isDisabled}
                    />
                    <Item
                        label="Keywords"
                        updateData={(data: CampaignItem[]) => {
                            updateData({ ...item, keywords: data })
                        }}
                        items={item.keywords}
                        isDisabled={isDisabled}
                    />
                    <Item
                        label="Job Titles"
                        updateData={(data: CampaignItem[]) => {
                            updateData({ ...item, jobTitles: data })
                        }}
                        items={item.jobTitles}
                        includeUpload
                        isDisabled={isDisabled}
                    />
                </Box>
                <Box sx={{ flex: '40%', maxwidth: '40%' }}>
                    <Item
                        label="Companies"
                        updateData={(data: CampaignItem[]) => {
                            updateData({ ...item, companysList: data })
                        }}
                        items={item.companysList}
                        includeUpload
                        isDisabled={isDisabled}
                    />
                </Box>
            </AccordionDetails>
        </MUIAccordion>
    )
}
