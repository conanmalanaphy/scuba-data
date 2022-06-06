import { createTheme, ThemeProvider } from '@mui/material/styles'
import type { AppProps } from 'next/app'
import '../styles/globals.css'

const mdTheme = createTheme()

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <ThemeProvider theme={mdTheme}>
            <Component {...pageProps} />
        </ThemeProvider>
    )
}

export default MyApp

/*
2) search box 
3) delete after 30 days 
4) modal on export saying how many credits
5) credit management saying how much you have
6) delete button
7) stage in upload for columns setting


8) change to make them accordians (little text next to it)
    - name 
    - campaign 
    - how many rows
    - export button/ colour if paid for already

        2 sides jobs titles/ companies
        - unique job titles - the 3 circles
        - unique companies - the 3 circles


9) campaign deletiong
10) starts as inactive 
11) can't edit an active campaign
12) disable archive campaigns
13) copy campaign next to copy button
1) update email and password page

*/
