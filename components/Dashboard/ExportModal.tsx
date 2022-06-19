import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import useSWR from 'swr'
import { supabase } from '../../libs/initSupabase'

interface ModalProps {
    isExportOpen: boolean
    cost: number
    fileUrl: string
    handleClose: () => void
}

export default function Modal({
    isExportOpen,
    handleClose,
    fileUrl,
    cost,
}: ModalProps) {
    const { data } = useSWR(`/api/credit-management/add-credits`)

    return (
        <Dialog
            open={isExportOpen}
            onClose={handleClose}
            fullWidth={true}
            maxWidth={'sm'}
        >
            <DialogTitle>Download file</DialogTitle>
            <DialogContent
                sx={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
            >
                Would you like to download the file it will cost {cost} credits?
                <Button
                    variant="contained"
                    disabled={data?.credit_count < cost}
                    onClick={async () => {
                        const { data, error } = await supabase.storage
                            .from('reports')
                            .getPublicUrl(fileUrl)

                        if (data) {
                            var link = document.createElement('a')
                            link.download = 'employees.json'
                            link.href = data.publicURL
                            document.body.appendChild(link)
                            link.click()
                            document.body.removeChild(link)
                        }
                    }}
                >
                    Download
                </Button>
            </DialogContent>
        </Dialog>
    )
}
