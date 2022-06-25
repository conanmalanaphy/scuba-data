import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Stepper from '@mui/material/Stepper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableFooter from '@mui/material/TableFooter'
import TableRow from '@mui/material/TableRow'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import * as React from 'react'
import useSWR from 'swr'
import MultiSelect from '../MultiSelect/MultiSelect'
import CSVUploader from './CSVUploader'

const steps = ['Upload file', 'File Mapping', 'Choose Campaign']

interface StepperProps {
    onClose: (
        data: string[][],
        campaigns: string[],
        jobTitleCoumn: number,
        companyCoumn: number,
        filename: string
    ) => void
}

interface item {
    name: string
    id: string
}

export default function LineStepper({ onClose }: StepperProps) {
    const [activeStep, setActiveStep] = React.useState<number>(0)
    const [state, setState] = React.useState<string[][]>([])
    const [filename, setFilename] = React.useState<string>('')
    const [campaigns, setCampaigns] = React.useState<string[]>([])
    const [jobTitleCoumn, setJobTitleCoumn] = React.useState(1)
    const [companyCoumn, setCompanyCoumn] = React.useState(2)

    const handleJobTitleCoumnChange = (event: any) => {
        setJobTitleCoumn(event.target.value)
    }

    const handleCompanyCoumnChange = (event: any) => {
        setCompanyCoumn(event.target.value)
    }

    const { data, error } = useSWR(`/api/campaigns/main`)

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1)
    }

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1)
    }

    let stepContent = null

    if (activeStep === steps.length) {
        stepContent = (
            <>
                <Typography sx={{ mt: 2, mb: 1 }}>
                    All steps completed - you&apos;re finished
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                    <Box sx={{ flex: '1 1 auto' }} />
                    <Button
                        onClick={() => {
                            const campaignData = data.find((cam: any) => {
                                return cam.id === campaigns[0]
                            })

                            onClose(
                                state,
                                campaignData,
                                jobTitleCoumn - 1,
                                companyCoumn - 1,
                                filename
                            )
                        }}
                    >
                        Calculate
                    </Button>
                </Box>
            </>
        )
    } else if (activeStep == 0) {
        stepContent = (
            <Box>
                <Box sx={{ mt: 2, mb: 1 }}>
                    <Stepper />
                </Box>
                <Box>
                    <CSVUploader
                        onUploadAccepted={(data: string[][]) => {
                            const fileName =
                                document
                                    .getElementById('filename')
                                    ?.innerText.split('.')[0] || ''
                            setFilename(fileName)
                            setState(data)
                        }}
                    />
                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 4 }}>
                        {activeStep !== 0 && (
                            <Button
                                color="inherit"
                                onClick={handleBack}
                                sx={{ mr: 1 }}
                            >
                                Back
                            </Button>
                        )}
                        <Box sx={{ flex: '1 1 auto' }} />
                        <Button
                            onClick={handleNext}
                            disabled={state.length === 0}
                        >
                            Next
                        </Button>
                    </Box>
                </Box>
            </Box>
        )
    } else if (activeStep == 1) {
        stepContent = (
            <Box>
                <Box>
                    <Stepper />
                </Box>
                <Box>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '4rem',
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                gap: '2rem',
                            }}
                        >
                            <TextField
                                id="filled-number"
                                label="Job Title column"
                                type="number"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                variant="filled"
                                value={jobTitleCoumn}
                                onChange={handleJobTitleCoumnChange}
                            />
                            <TextField
                                id="filled-number"
                                label="Company column"
                                type="number"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                variant="filled"
                                value={companyCoumn}
                                onChange={handleCompanyCoumnChange}
                            />
                        </Box>

                        <Box>
                            Example of upload
                            <Divider />
                            <Table size="small">
                                <TableBody>
                                    {state.slice(0, 3).map((row, index) => {
                                        return (
                                            <TableRow key={index}>
                                                {row.map((a, index) => {
                                                    return (
                                                        <TableCell
                                                            key={index}
                                                            sx={{
                                                                width: '7rem',
                                                                whiteSpace:
                                                                    'nowrap',
                                                                overflow:
                                                                    'hidden',
                                                                textOverflow:
                                                                    'ellipsis',
                                                            }}
                                                        >
                                                            {' '}
                                                            {a}
                                                        </TableCell>
                                                    )
                                                })}
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                                <TableFooter />
                            </Table>
                            <Divider />
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 4 }}>
                        <Button
                            color="inherit"
                            onClick={handleBack}
                            sx={{ mr: 1 }}
                        >
                            Back
                        </Button>
                        <Box sx={{ flex: '1 1 auto' }} />
                        <Button
                            onClick={handleNext}
                            disabled={state.length === 0}
                        >
                            Next
                        </Button>
                    </Box>
                </Box>
            </Box>
        )
    } else {
        stepContent = (
            <>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        pt: 2,
                        height: '100%',
                    }}
                >
                    <Box
                        sx={{
                            flex: '1 1 auto',
                            pb: '1rem',
                            height: '100%',
                            flexDirection: 'column',
                            justifyContent: 'space-around',
                            display: 'flex',
                        }}
                    >
                        <MultiSelect
                            items={data
                                .filter((c: any) => c.state === 'LIVE')
                                .map(({ id, name }: item) => {
                                    return { id, name }
                                })}
                            campaigns={campaigns}
                            setCampaigns={(val: string[]) => {
                                setCampaigns(val)
                            }}
                        />
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                        <Button
                            color="inherit"
                            disabled={activeStep === 0}
                            onClick={handleBack}
                            sx={{ mr: 1 }}
                        >
                            Back
                        </Button>
                        <Box sx={{ flex: '1 1 auto' }} />
                        <Button
                            onClick={handleNext}
                            disabled={campaigns.length == 0}
                        >
                            Next
                        </Button>
                    </Box>
                </Box>
            </>
        )
    }

    return (
        <Box
            sx={{
                width: '100%',
                height: '40vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
            }}
        >
            <Stepper activeStep={activeStep}>
                {steps.map((label) => {
                    const stepProps: { completed?: boolean } = {}
                    return (
                        <Step key={label} {...stepProps}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    )
                })}
            </Stepper>
            {stepContent}
        </Box>
    )
}
