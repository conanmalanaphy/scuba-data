import ArchiveIcon from '@mui/icons-material/Archive'
import DeleteIcon from '@mui/icons-material/Delete'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import Typography from '@mui/material/Typography'
import Item from './Item'

interface item {
    name: string
    isIncluded: boolean
}
interface campaign {
    user: string
    id: string
    name: string
    state: string
    seniorites: item[]
    keywords: item[]
    companysList: item[]
    jobTitles: item[]
}


interface AccordProps {
    isExpanded: boolean
    handleChange: () => void
    item: campaign
    updateData: (items: campaign) => void
    sendToArchive: () => void;
    onDelete: () => void
}

export default function Accord({
    isExpanded,
    handleChange,
    item,
    updateData,
    sendToArchive,
    onDelete
}: AccordProps) {
    return (
        <Accordion expanded={isExpanded} onChange={handleChange}>
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
                <IconButton
                    edge="start"
                    color="inherit"
                    onClick={sendToArchive}
                    sx={{
                        color: "#1976d2",
                        marginLeft: '1rem',

                    }}
                >
                    <ArchiveIcon />
                </IconButton>
                <IconButton
                    edge="start"
                    color="inherit"
                    onClick={onDelete}
                    sx={{
                        color: "#1976d2",
                        marginLeft: '1rem',
                    }}
                >
                    <DeleteIcon />
                </IconButton>
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
                        updateData={(data: item[]) => {
                            updateData({ ...item, seniorites: data })
                        }}
                        items={item.seniorites}

                    />
                    <Item
                        label="Keywords"
                        updateData={(data: item[]) => {
                            updateData({ ...item, keywords: data })
                        }}
                        items={item.keywords}
                    />
                    <Item
                        label="Job Titles"
                        updateData={(data: item[]) => {
                            updateData({ ...item, jobTitles: data })
                        }}
                        items={item.jobTitles}
                        includeUpload
                    />
                </Box>
                <Box sx={{ flex: '40%', maxwidth: '40%' }}>
                    <Item
                        label="Companies"
                        updateData={(data: item[]) => {
                            updateData({ ...item, companysList: data })
                        }}
                        items={item.companysList}
                        includeUpload
                    />
                </Box>
            </AccordionDetails>
        </Accordion>
    )
}
