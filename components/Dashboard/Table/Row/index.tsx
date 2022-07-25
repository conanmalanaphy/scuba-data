import { useState } from 'react'
import ProcessedRow from './ProcessedRow'
import UnprocessedRow from './UnprocessedRow'

interface RowProps {
    row: FormPost
    handleClickExportOpen: (
        id: number | undefined,
        row_count: number,
        file: string,
        paid_for: boolean | undefined
    ) => void
    onDelete: (id: number) => void
}

export default function Row({
    row,
    handleClickExportOpen,
    onDelete,
}: RowProps) {
    const [open, setOpen] = useState(false)

    const { name, is_processing, expected_completion_time, error } = row

    return is_processing || error ? (
        <UnprocessedRow
            setOpen={setOpen}
            open={open}
            is_processing={is_processing}
            name={name}
            expected_completion_time={expected_completion_time}
            error={error}
        />
    ) : (
        <ProcessedRow
            setOpen={setOpen}
            open={open}
            row={row}
            handleClickExportOpen={handleClickExportOpen}
            onDelete={onDelete}
        />
    )
}
