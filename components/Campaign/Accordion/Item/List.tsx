import Chip from '@mui/material/Chip'

interface ListProps {
    items: CampaignItem[]
    campaignItem: CampaignItem
    filterProp: string
    newState: boolean
    setState: (items: CampaignItem[]) => void
    colour: string
    isDisabled: boolean
}

export default function List({
    items,
    campaignItem,
    filterProp,
    newState,
    setState,
    colour,
    isDisabled,
}: ListProps) {
    const onClickHandler = () => {
        const newItems = items.map((item) => {
            if (campaignItem.name === item.name) {
                return {
                    ...item,
                    [filterProp]: !newState,
                }
            }
            return item
        })
        setState(newItems)
    }

    const onDeleteHandler = () => {
        const newItems = items.filter((item) => {
            return campaignItem.name !== item.name
        })
        setState(newItems)
    }

    return (
        <Chip
            disabled={isDisabled}
            key={campaignItem.name}
            sx={{
                bgcolor: `${colour}`,
                color: 'white',
            }}
            label={campaignItem.name}
            onClick={onClickHandler}
            onDelete={onDeleteHandler}
        />
    )
}
