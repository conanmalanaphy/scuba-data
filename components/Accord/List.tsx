import Chip from '@mui/material/Chip'

interface item {
    name: string
    isIncluded: boolean
}

interface ListProps {
    items: item[]
    a: item
    filterProp: string
    newState: boolean
    setState: (items: item[]) => void
    colour: string
}

export default function List({ items, a, filterProp, newState, setState, colour }: ListProps) {
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

