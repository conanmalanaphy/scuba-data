import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Stepper from './Stepper'

interface ModalProps {
    isOpen: boolean
    handleClose: () => void
    processfile: (
        data: string[][],
        campaigns: string[],
        jobTitleCoumn: number,
        companyCoumn: number,
        fileName: string
    ) => void
}

export default function Modal({
    isOpen,
    handleClose,
    processfile,
}: ModalProps) {
    return (
        <Dialog
            open={isOpen}
            onClose={handleClose}
            fullWidth={true}
            maxWidth={'sm'}
        >
            <DialogTitle>Upload</DialogTitle>
            <DialogContent>
                <Stepper onClose={processfile} />
            </DialogContent>
        </Dialog>
    )
}
