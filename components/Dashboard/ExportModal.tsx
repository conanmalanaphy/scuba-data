import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import useSWR, { useSWRConfig } from 'swr'

import { supabase } from '../../libs/initSupabase'

function downloadFile(data:any, filename:string, mime:string) {
    // It is necessary to create a new blob object with mime-type explicitly set
    // otherwise only Chrome works like it should
    const blob = new Blob([data], {type: mime || 'application/octet-stream'});
    
    // Other browsers
    // Create a link pointing to the ObjectURL containing the blob
    const blobURL = window.URL.createObjectURL(blob);
    const tempLink = document.createElement('a');
    tempLink.style.display = 'none';
    tempLink.href = blobURL;
    tempLink.setAttribute('download', filename);
    // Safari thinks _blank anchor are pop ups. We only want to set _blank
    // target if the browser does not support the HTML5 download attribute.
    // This allows you to download files in desktop safari if pop up blocking
    // is enabled.
    if (typeof tempLink.download === 'undefined') {
      tempLink.setAttribute('target', '_blank');
    }
    document.body.appendChild(tempLink);
    tempLink.click();
    document.body.removeChild(tempLink);
    setTimeout(() => {
      // For Firefox it is necessary to delay revoking the ObjectURL
      window.URL.revokeObjectURL(blobURL);
    }, 100);
  }

interface ModalProps {
    isExportOpen: boolean
    cost: number
    fileUrl: string
    id:string;
    paid_for:boolean;
    handleClose: () => void
}

export default function Modal({
    isExportOpen,
    handleClose,
    fileUrl,
    id,
    paid_for,
    cost
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
                {paid_for ? "This is already paid for": `Would you like to download the file it will cost ${cost} credits?`}
                <Button
                    variant="contained"
                    disabled={!paid_for && data < cost }
                    onClick={async () => {
                        
                        const { data:file, error } = await supabase.storage.from('reports').download(fileUrl)
                        
                        const fileName = fileUrl.split('/');

                        downloadFile(file,fileName[fileName.length-1],"text/csv")

                        handleClose()
                        
                        if (fetcher) {
                            await mutate(
                                `/api/dashboard/main`,
                                fetcher(`/api/dashboard/main`, {
                                    id:id,
                                    paid_for:true
                                })
                            )
                        }                        

                        if (fetcher && !paid_for) {
                            await mutate(
                                `/api/credit-management/add-credits`,
                                fetcher(`/api/credit-management/add-credits`, {
                                    credit_count: data -cost ,
                                }),
                                { optimisticData: data - cost, rollbackOnError: true }
                            )}
                        }}
                 >
                    Download
                </Button>
            </DialogContent>
        </Dialog>
    )
}
