import { Container, Typography } from '@mui/material'
import Head from 'next/head'
import { ConditionalWrapper } from '@/libs/helperFunctions'

type PageProps = {
    title?: string
    seoTitle?: string
    maxWidth?: false | 'md' | 'xs' | 'sm' | 'lg' | 'xl' | undefined
    children?: React.ReactNode
}

export default function Page({
    title,
    seoTitle,
    maxWidth = 'md',
    children,
}: PageProps) {
    return (
        <PageWrapper title={seoTitle ?? title} maxWidth={maxWidth}>
            {title ? (
                <Typography variant="h1" sx={{ mb: 2 }}>
                    {title}
                </Typography>
            ) : null}
            {children}
        </PageWrapper>
    )
}

function PageWrapper({ children = null, title, maxWidth = 'md' }: PageProps) {
    let titleString = 'ScubaData'

    if (title) {
        titleString = 'ScubaData | ' + title
    }

    return (
        <ConditionalWrapper
            condition={maxWidth === false}
            wrapper={(children) => (
                <Container maxWidth={maxWidth} sx={{ pt: 2 }}>
                    {children}
                </Container>
            )}
        >
            <>
                <Head>
                    <title>{titleString}</title>
                    <meta
                        name="viewport"
                        content="initial-scale=1, width=device-width"
                    />
                </Head>
                {children}
            </>
        </ConditionalWrapper>
    )
}
