import DeleteIcon from '@mui/icons-material/Delete'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import ExportModal from './ExportModal'

interface AccordianProps {
    formPost: formPost
    onDelete: () => void
}

interface formPost {
    id?: number
    user?: string
    name: string
    row_count: number
    file: string
    campaigns: string[]
    comp_high: number
    comp_medium: number
    comp_low: number
    job_title_high: number
    job_title_medium: number
    job_title_low: number
    job_title_unique_count: number
    comp_unique_count: number
    created_at: string
}

export default function LineStepper({ formPost, onDelete }: AccordianProps) {
    const {
        name,
        row_count,
        created_at,
        id,
        file,
        campaigns,
        comp_high,
        comp_medium,
        comp_low,
        job_title_high,
        job_title_medium,
        job_title_low,
        job_title_unique_count,
        comp_unique_count,
    } = formPost

    const [exportModal, setexportModal] = useState<any>({
        isOpen: false,
        exportId: null,
        cost: null,
        file: null,
    })
    const [expanded, setExpanded] = useState(false)

    const handleClickExportOpen = (
        id: number | undefined,
        cost: number,
        file: any
    ) => {
        setexportModal({
            isOpen: true,
            exportId: id,
            file: file,
            cost: cost,
        })
    }
    const handleExportClose = () => {
        setexportModal({
            isOpen: false,
            exportId: null,
            cost: null,
            file: null,
        })
    }
    return (
        <>
            <ExportModal
                isExportOpen={exportModal.isOpen}
                cost={exportModal.cost}
                exportId={exportModal.exportId}
                handleClose={handleExportClose}
                file={exportModal.file}
            />
            <Accordion
                sx={{ marginBottom: '1rem' }}
                key={id}
                expanded={expanded}
                onChange={() => setExpanded((prevState) => !prevState)}
            >
                <AccordionSummary
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"
                >
                    <Typography
                        sx={{
                            width: '20%',
                            flexShrink: 0,
                            margin: 'auto',
                            marginLeft: '1rem',
                        }}
                    >
                        {name}
                    </Typography>
                    <Typography
                        sx={{
                            width: '20%',
                            flexShrink: 0,
                            margin: 'auto',
                            marginLeft: '1rem',
                        }}
                    >
                        {row_count}
                    </Typography>
                    <Typography
                        sx={{
                            width: '20%',
                            flexShrink: 0,
                            margin: 'auto',
                            marginLeft: '1rem',
                        }}
                    >
                        {new Date(created_at).toLocaleDateString('en-UK', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}
                    </Typography>
                    <Box>
                        {' '}
                        <Button
                            variant="outlined"
                            sx={{
                                marginLeft: '1rem',
                                color: '#1565c0',
                                flex: '1 1 0px',
                            }}
                            onClick={(event: React.MouseEvent<HTMLElement>) => {
                                event.preventDefault()
                                event.stopPropagation()
                                handleClickExportOpen(id, row_count, file)
                            }}
                        >
                            Export
                        </Button>
                    </Box>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={onDelete}
                        sx={{
                            color: '#1976d2',
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
                            flex: '50%',
                            display: 'flex',
                            flexDirection: 'column',
                            color: 'grey',
                        }}
                    >
                        <Typography
                            sx={{
                                fontWeight: 700,
                                flexShrink: 0,
                                fontSize: '125%',
                                margin: 'auto',
                                marginLeft: '1rem',
                                color: 'black',
                            }}
                        >
                            Companies
                        </Typography>
                        <Typography
                            sx={{
                                flexShrink: 0,
                                margin: 'auto',
                                marginLeft: '1rem',
                            }}
                        >
                            High:{comp_high}
                        </Typography>
                        <Typography
                            sx={{
                                flexShrink: 0,
                                margin: 'auto',
                                marginLeft: '1rem',
                            }}
                        >
                            Medium:{comp_medium}
                        </Typography>
                        <Typography
                            sx={{
                                flexShrink: 0,
                                margin: 'auto',
                                marginLeft: '1rem',
                            }}
                        >
                            Low:{comp_low}
                        </Typography>
                        <Typography
                            sx={{
                                flexShrink: 0,
                                margin: 'auto',
                                marginLeft: '1rem',
                            }}
                        >
                            Unique:
                            {comp_unique_count}
                        </Typography>
                    </Box>
                    <Box sx={{ flex: '50%' }}>
                        <Typography
                            sx={{
                                fontWeight: 700,
                                flexShrink: 0,
                                fontSize: '125%',
                                margin: 'auto',
                                marginLeft: '1rem',
                            }}
                        >
                            Job titles
                        </Typography>
                        <Typography
                            sx={{
                                flexShrink: 0,
                                margin: 'auto',
                                marginLeft: '1rem',
                            }}
                        >
                            High:{job_title_high}
                        </Typography>
                        <Typography
                            sx={{
                                flexShrink: 0,
                                margin: 'auto',
                                marginLeft: '1rem',
                            }}
                        >
                            Medium:
                            {job_title_medium}
                        </Typography>
                        <Typography
                            sx={{
                                flexShrink: 0,
                                margin: 'auto',
                                marginLeft: '1rem',
                            }}
                        >
                            Low:{job_title_low}
                        </Typography>
                        <Typography
                            sx={{
                                flexShrink: 0,
                                margin: 'auto',
                                marginLeft: '1rem',
                            }}
                        >
                            Unique:
                            {job_title_unique_count}
                        </Typography>
                    </Box>
                </AccordionDetails>
            </Accordion>
        </>
    )
}
