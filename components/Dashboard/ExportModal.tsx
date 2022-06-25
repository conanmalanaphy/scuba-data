import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import useSWR, { useSWRConfig } from 'swr'

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
    const { fetcher, mutate } = useSWRConfig()

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
                    disabled={data < cost}
                    onClick={async () => {
                        const { data:url, error } = await supabase.storage
                            .from('reports')
                            .getPublicUrl(fileUrl)

                        if (url) {
                            window.open(
                                url.publicURL,
                                '_blank',
                                'noopener,noreferrer'
                            )
                        }

                        handleClose()
                        
                        if (fetcher) {
                            await mutate(
                                `/api/credit-management/add-credits`,
                                fetcher(`/api/credit-management/add-credits`, {
                                    credit_count: data -cost ,
                                }),
                                { optimisticData: data -cost, rollbackOnError: true }
                            )}
                        }}
                >
                    Download
                </Button>
            </DialogContent>
        </Dialog>
    )
}
