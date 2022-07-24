import { Dialog, DialogContent, DialogTitle } from '@mui/material'

import Stepper from './Stepper'

interface ModalProps {
    isOpen: boolean
    handleClose: () => void
    processfile: (
        data: string[][],
        campaigns: Campaign,
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
