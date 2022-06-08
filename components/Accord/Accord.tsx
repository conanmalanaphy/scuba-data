import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import DeleteIcon from '@mui/icons-material/Delete'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import ArchiveIcon from '@mui/icons-material/Archive';
import Chip from '@mui/material/Chip'
import TextField from '@mui/material/TextField'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import Typography from '@mui/material/Typography'
import AddIcon from '@mui/icons-material/Add'
import { useState } from 'react'
import { useCSVReader } from 'react-papaparse'

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

interface ListProps {
    items: item[]
    a: item
    filterProp: string
    newState: boolean
    setState: (items: item[]) => void
    colour: string
}

function List({ items, a, filterProp, newState, setState, colour }: ListProps) {
    return (
        <Chip
            key={a.name}
            sx={{
                bgcolor: `${colour}`,
                color: 'white',
            }}
            label={a.name}
            onClick={() => {
                const newItems = items.map((item: item) => {
                    if (a.name === item.name) {
                        return {
                            ...item,
                            [filterProp]: !newState,
                        }
                    }
                    return item
                })
                setState(newItems)
            }}
            onDelete={() => {
                const newItems = items.filter((item: item) => {
                    return a.name !== item.name
                })
                setState(newItems)
            }}
        />
    )
}

interface ItemProps {
    items: item[]
    label: string
    updateData: (items: item[]) => void
    includeUpload?: boolean
}

function Item({ label, updateData, items, includeUpload = false }: ItemProps) {
    const [senority, setSenority] = useState<string>('')
    const { CSVReader } = useCSVReader()

    const setState = (data: item[]) => {
        updateData(data)
    }
    return (
        <Box
            sx={{
                display: 'flex',
                gap: '1rem',
                flexDirection: 'column',
            }}
        >
            <div style={{ display: 'flex' }}>
                <TextField
                    label={label}
                    id="standard-basic"
                    variant="standard"
                    value={senority}
                    onChange={(event) => {
                        setSenority(event.target.value)
                    }}
                    onKeyPress={(ev) => {
                        if (ev.key === 'Enter') {
                            ev.preventDefault()
                            updateData([
                                ...items,
                                {
                                    name: senority,
                                    isIncluded: true,
                                },
                            ])
                            setSenority('')
                        }
                    }}
                />
                <Button
                    onClick={() => {
                        updateData([
                            ...items,
                            {
                                name: senority,
                                isIncluded: true,
                            },
                        ])
                        setSenority('')
                    }}
                >
                    Add
                </Button>
                {includeUpload && (
                    <CSVReader
                        onUploadAccepted={(results: { data: string[][] }) => {
                            const newData = results.data.slice(1)
                            const newItems = newData.reduce(
                                (memo: item[], b: string[]) => {
                                    if (b.length == 2) {
                                        memo.push({
                                            name: b[0],
                                            isIncluded: b[1] === 'TRUE',
                                        })
                                    }

                                    return memo
                                },
                                []
                            )

                            updateData([...items, ...newItems])
                        }}
                    >
                        {({ getRootProps }: any) => (
                            <Button
                                variant="contained"
                                component="span"
                                {...getRootProps()}
                            >
                                <AddIcon />
                                Upload
                            </Button>
                        )}
                    </CSVReader>
                )}
            </div>
            <div
                style={{
                    display: 'flex',
                    gap: '1rem',
                    flexWrap: 'wrap',
                }}
            >
                {items
                    .filter((a: item) => a.isIncluded)
                    .map((a: item) => (
                        <List
                            key={a.name}
                            a={a}
                            items={items}
                            filterProp="isIncluded"
                            newState={true}
                            setState={setState}
                            colour="green"
                        />
                    ))}

                {items
                    .filter((a: item) => !a.isIncluded)
                    .map((a: item) => (
                        <List
                            key={a.name}
                            a={a}
                            items={items}
                            filterProp="isIncluded"
                            newState={false}
                            setState={setState}
                            colour="crimson"
                        />
                    ))}
            </div>
        </Box>
    )
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
