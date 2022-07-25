import Header from './Header'
import Footer from './Footer'

interface RowProps {
    setOpen: (isOpen: boolean) => void
    open: boolean
    row: FormPost
    handleClickExportOpen: (
        id: number | undefined,
        row_count: number,
        file: string,
        paid_for: boolean | undefined
    ) => void
    onDelete: (id: number) => void
}

export default function ProcessedRow({
    setOpen,
    open,
    row,
    handleClickExportOpen,
    onDelete,
}: RowProps) {
    return (
        <>
            <Header
                setOpen={setOpen}
                open={open}
                row={row}
                handleClickExportOpen={handleClickExportOpen}
                onDelete={onDelete}
            />
            <Footer open={open} row={row} />
        </>
    )
}
