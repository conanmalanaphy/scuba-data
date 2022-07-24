import {
    Code as CodeIcon,
    People as PeopleIcon,
    Star as StarIcon,
} from '@mui/icons-material'

import { Box, Button, Link } from '@mui/material'
import ContactSection from '../components/Homepage/ContactSection'
import FeatureBlock from '../components/Homepage/FeatureBlock'
import FeatureBlocksContainer from '../components/Homepage/FeatureBlocksContainer'
import FeatureContainer from '../components/Homepage/FeatureContainer'
import HeroSection from '../components/Homepage/HeroSection'
import Layout from '../components/Homepage/layout/Layout'
import Page from '../components/Homepage/layout/Page'

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
