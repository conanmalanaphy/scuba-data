import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import CodeIcon from '@mui/icons-material/Code'
import StarIcon from '@mui/icons-material/Star'
import PeopleIcon from '@mui/icons-material/People'
import Page from '../components/Homepage/layout/Page'
import HeroSection from '../components/Homepage/HeroSection'
import React from 'react'
import FeatureContainer from '../components/Homepage/FeatureContainer'
import FeatureBlocksContainer from '../components/Homepage/FeatureBlocksContainer'
import FeatureBlock from '../components/Homepage/FeatureBlock'
import BigSection from '../components/Homepage/BigSection'
import Image from 'next/image'
import ContactSection from '../components/Homepage/ContactSection'
import Layout from '../components/Homepage/layout/Layout'
import Link from '@mui/material/Link'

export default function HomePage(): JSX.Element {
    return (
        <Layout>
            <Page maxWidth={false}>
                <HeroSection
                    title="ScubaData"
                    subtitle="Quick, Efficent, Accurate"
                    image="/diver.svg"
                >
                    <Link href="/sign-up">
                        <Button
                            variant="contained"
                            disableElevation
                            sx={{ mr: 2, mt: 2 }}
                        >
                            Sign up
                        </Button>
                    </Link>
                    <Link href="#contact-us">
                        <Button disableElevation sx={{ mr: 2, mt: 2 }}>
                            Contact us
                        </Button>
                    </Link>
                </HeroSection>
                <FeatureContainer>
                    <FeatureBlocksContainer>
                        <FeatureBlock
                            title="Quick"
                            icon={<PeopleIcon />}
                            content={
                                <>
                                    Consequat id porta nibh venenatis cras sed
                                    felis eget velit. Ac felis donec et odio
                                    pellentesque diam volutpat commodo.
                                </>
                            }
                        />
                        <FeatureBlock
                            title="Efficent"
                            icon={<StarIcon />}
                            content={
                                <>
                                    Ultricies leo integer malesuada nunc vel.
                                    Egestas pretium aenean pharetra magna ac
                                    placerat vestibulum.
                                </>
                            }
                        />
                        <FeatureBlock
                            title="Accurate"
                            icon={<CodeIcon />}
                            content={
                                <>
                                    Vitae turpis massa sed elementum tempus
                                    egestas. Commodo sed egestas egestas
                                    fringilla phasellus faucibus.
                                </>
                            }
                        />
                    </FeatureBlocksContainer>
                </FeatureContainer>
                <Box sx={{ mb: 4 }}>
                    <ContactSection />
                </Box>
            </Page>
        </Layout>
    )
}
