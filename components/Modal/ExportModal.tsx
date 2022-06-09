import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import useSWR from 'swr'
import { supabase } from '../../libs/initSupabase'

const fetcher = async (url: string) => {
    const res = await fetch(url)
    if (!res.ok) {
        throw Error("Yo that's NOT OK!!!")
    }
    const data = await res.json()
    return data
}

interface ModalProps {
    isExportOpen: boolean;
    exportId: number;
    cost: number;
    file: any;
    handleClose: () => void;
}


export default function Modal({
    isExportOpen,
    handleClose,
    file,
    cost,
    exportId,
}: ModalProps) {
    const profile = supabase.auth.user()

    const { data } = useSWR(`/api/credit-management/${profile?.id}`, fetcher)

    return (
        <Dialog
            open={isExportOpen}
            onClose={handleClose}
            fullWidth={true}
            maxWidth={'sm'}
        >
            <DialogTitle>Download file</DialogTitle>
            <DialogContent sx={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                Would you like to download the file it will cost {cost} credits?
                <Button variant="contained" disabled={data?.credit_count < cost} onClick={() => {
                    var csvData = new Blob(
                        [file],
                        {
                            type: 'text/csv;charset=utf-8;',
                        }
                    )
                    var csvURL =
                        window.URL.createObjectURL(
                            csvData
                        )

                    var tempLink =
                        document.createElement(
                            'a'
                        )
                    tempLink.href = csvURL
                    tempLink.setAttribute(
                        'download',
                        'download.csv'
                    )
                    tempLink.click()
                    handleClose()
                }}>
                    Download
                </Button>
            </DialogContent>
        </Dialog>
    )
}
