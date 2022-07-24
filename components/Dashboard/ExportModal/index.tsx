import { Button, Dialog, DialogContent, DialogTitle } from '@mui/material'
import useSWR, { useSWRConfig } from 'swr'
import { downloadFile } from './ExportModal.HELPER'
import { supabase } from '@/libs/initSupabase'

interface ModalProps {
    isExportOpen: boolean
    cost: number
    fileUrl: string
    id: string
    paid_for: boolean | undefined
    handleClose: () => void
}

export default function Modal({
    isExportOpen,
    handleClose,
    fileUrl,
    id,
    paid_for,
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
                {paid_for
                    ? 'This is already paid for'
                    : `Would you like to download the file it will cost ${cost} credits?`}
                <Button
                    variant="contained"
                    disabled={!paid_for && data < cost}
                    onClick={async () => {
                        const { data: file, error } = await supabase.storage
                            .from('reports')
                            .download(fileUrl)

                        const fileName = fileUrl.split('/')

                        if (file) {
                            downloadFile(
                                file,
                                fileName[fileName.length - 1],
                                'text/csv'
                            )
                        }

                        handleClose()

                        if (fetcher) {
                            await mutate(
                                `/api/dashboard/main`,
                                fetcher(`/api/dashboard/main`, {
                                    id: id,
                                    paid_for: true,
                                })
                            )
                        }

                        if (fetcher && !paid_for) {
                            await mutate(
                                `/api/credit-management/add-credits`,
                                fetcher(`/api/credit-management/add-credits`, {
                                    credit_count: data - cost,
                                }),
                                {
                                    optimisticData: data - cost,
                                    rollbackOnError: true,
                                }
                            )
                        }
                    }}
                >
                    Download
                </Button>
            </DialogContent>
        </Dialog>
    )
}
