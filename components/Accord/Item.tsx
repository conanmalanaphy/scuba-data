import AddIcon from '@mui/icons-material/Add'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import { useState } from 'react'
import { useCSVReader } from 'react-papaparse'
import List from './List'

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

interface ItemProps {
    items: item[]
    label: string
    updateData: (items: item[]) => void
    includeUpload?: boolean
}

export default function Item({ label, updateData, items, includeUpload = false }: ItemProps) {
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


