import AddIcon from '@mui/icons-material/Add'
import { Box, Button, TextField, ButtonGroup } from '@mui/material'
import { useState } from 'react'
import { useCSVReader } from 'react-papaparse'
import List from './List'

interface ItemProps {
    items: CampaignItem[]
    label: string
    updateData: (items: CampaignItem[]) => void
    includeUpload?: boolean
    isDisabled: boolean
}

export default function Item({
    label,
    updateData,
    items,
    includeUpload = false,
    isDisabled,
}: ItemProps) {
    const [senority, setSenority] = useState('')
    const { CSVReader } = useCSVReader()

    const setState = (data: CampaignItem[]) => {
        updateData(data)
    }

    return (
        <Box
            sx={{
                display: 'flex',
                gap: '1rem',
                flexDirection: 'column',
                mt: '1rem',
            }}
        >
            <div style={{ display: 'flex' }}>
                <TextField
                    label={label}
                    id="standard-basic"
                    variant="standard"
                    disabled={isDisabled}
                    value={senority}
                    onChange={(event) => {
                        setSenority(event.target.value)
                    }}
                    onKeyPress={(ev) => {
                        if (ev.key === 'Enter' && senority.length > 0) {
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
                <ButtonGroup sx={{ ml: 2, height: '3rem' }}>
                    <Button
                        disabled={isDisabled || senority.length === 0}
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
                            onUploadAccepted={(results: {
                                data: string[][]
                            }) => {
                                const newData = results.data.slice(1)
                                const newItems = newData.reduce(
                                    (memo: CampaignItem[], b: string[]) => {
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
                                    disabled={isDisabled}
                                    {...getRootProps()}
                                >
                                    <AddIcon />
                                    Upload
                                </Button>
                            )}
                        </CSVReader>
                    )}
                </ButtonGroup>
            </div>
            <div
                style={{
                    display: 'flex',
                    gap: '1rem',
                    flexWrap: 'wrap',
                }}
            >
                {items
                    .filter(
                        (campaignItem: CampaignItem) => campaignItem.isIncluded
                    )
                    .map((campaignItem: CampaignItem) => (
                        <List
                            key={campaignItem.name}
                            isDisabled={isDisabled}
                            campaignItem={campaignItem}
                            items={items}
                            filterProp="isIncluded"
                            newState={true}
                            setState={setState}
                            colour="green"
                        />
                    ))}

                {items
                    .filter(
                        (campaignItem: CampaignItem) => !campaignItem.isIncluded
                    )
                    .map((campaignItem: CampaignItem) => (
                        <List
                            key={campaignItem.name}
                            isDisabled={isDisabled}
                            campaignItem={campaignItem}
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
