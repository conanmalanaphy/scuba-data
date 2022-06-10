import * as React from 'react'
import Box from '@mui/material/Box'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { useCSVReader } from 'react-papaparse'
import MultiSelect from '../MultiSelect/MultiSelect'
import useSWR, { useSWRConfig } from 'swr'
import { supabase } from '../../libs/initSupabase'
import CSVUploader from './CSVUploader'

const fetcher = async (url: string) => {
    const res = await fetch(url)
    if (!res.ok) {
        throw Error("Yo that's NOT OK!!!")
    }
    const data = await res.json()
    return data
}

const steps = ['Upload file', 'Choose Campaign']

interface StepperProps {
    onClose: (data: string[][], campaigns: string[], filename: string) => void
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
    const profile = supabase.auth.user()

    const { CSVReader } = useCSVReader()
    const { data } = useSWR(`/api/campaigns/${profile?.id}`, fetcher)

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

                            onClose(state, campaignData, filename)
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
                <Typography sx={{ mt: 2, mb: 1 }}>
                    <Stepper />
                </Typography>
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
    } else {
        stepContent = (
            <>
                <Typography sx={{ mt: 2, mb: 1 }}>
                    Choose the Campaign to run on
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', pt: 2 }}>
                    <Box sx={{ flex: '1 1 auto', pb: '1rem' }}>
                        <MultiSelect
                            items={data.map(({ id, name }: item) => {
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
                height: '30vh',
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
