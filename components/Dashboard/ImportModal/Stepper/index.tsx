import {
    Box,
    Divider,
    Button,
    Step,
    StepLabel,
    Stepper,
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableRow,
    TextField,
    Typography,
} from '@mui/material'
import { useState, ChangeEvent } from 'react'
import { steps } from './Stepper.CONSTANTS'
import useSWR from 'swr'
import MultiSelect from '@/components/MultiSelect'
import CSVUploader from '@/core/CSVFileUploader'

interface StepperProps {
    onClose: (
        data: string[][],
        campaign: Campaign,
        jobTitleCoumn: number,
        companyCoumn: number,
        filename: string
    ) => void
}

export default function LineStepper({ onClose }: StepperProps) {
    const [activeStep, setActiveStep] = useState<number>(0)
    const [state, setState] = useState<string[][]>([])
    const [filename, setFilename] = useState<string>('')
    const [campaigns, setCampaigns] = useState<string[]>([])
    const [jobTitleCoumn, setJobTitleCoumn] = useState(1)
    const [companyCoumn, setCompanyCoumn] = useState(2)

    const handleJobTitleCoumnChange = (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setJobTitleCoumn(Number(event.target.value))
    }

    const handleCompanyCoumnChange = (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setCompanyCoumn(Number(event.target.value))
    }

    const { data, error } = useSWR<Campaign[]>(`/api/campaigns/main`)

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1)
    }

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1)
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
            <Box
                sx={{
                    display: activeStep === steps.length ? 'flex' : 'none',
                    flexDirection: 'column',
                    height: '100%',
                    justifyContent: 'space-between',
                    marginTop: '5rem',
                }}
            >
                <Typography sx={{ mt: 2, mb: 1 }}>
                    All steps completed - you&apos;re finished
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                    <Box sx={{ flex: '1 1 auto' }} />
                    <Button
                        onClick={() => {
                            const campaignData = data?.find((cam) => {
                                return cam.id?.toString() === campaigns[0]
                            })

                            if (campaignData) {
                                onClose(
                                    state,
                                    campaignData,
                                    jobTitleCoumn - 1,
                                    companyCoumn - 1,
                                    filename
                                )
                            }
                        }}
                    >
                        Calculate
                    </Button>
                </Box>
            </Box>
            <Box sx={{ display: activeStep === 0 ? 'block' : 'none' }}>
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
            <Box sx={{ display: activeStep === 1 ? 'block' : 'none' }}>
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
                                    {state?.slice(0, 3).map((row, index) => {
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
            <Box
                sx={{
                    display: activeStep === 2 ? 'flex' : 'none',
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
                    {data && (
                        <MultiSelect
                            items={data
                                .filter((c) => c.state === 'LIVE')
                                .map(({ id, name }) => {
                                    return { id, name }
                                })}
                            campaigns={campaigns}
                            setCampaigns={(val: string[]) => {
                                setCampaigns(val)
                            }}
                        />
                    )}
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
        </Box>
    )
}
