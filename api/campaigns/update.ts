import { NextApiHandler } from 'next'
import { supabase } from '../../libs/initSupabase'
import jwt_decode, { JwtPayload } from 'jwt-decode'
import type { NextApiResponse } from 'next'

const updates: NextApiHandler = async (req, res) => {
    const token: string = req.headers.token as string
    const jwt: JwtPayload = jwt_decode(token)

    supabase.auth.setAuth(token)

    if (req.method === 'POST') {
        return update(res, req.body, jwt)
    } else if (req.method === 'POST') {
    }
    return res.status(404).json({ error: 'API method not found' })
}

const getCampaigns = async (res: NextApiResponse, jwt: JwtPayload) => {
    const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('user_id', jwt.sub)
        .is('deleted_at', null)

    if (error) {
        return res.status(500).json({ error: error.message })
    } else if (data) {
        const formattedData = data
            .filter((campaign: DB_Campaign) => campaign.state !== 'ARCHIVED')
            .map((campaign: DB_Campaign) => {
                return {
                    id: campaign.id,
                    name: campaign.name,
                    state: campaign.state,
                    seniorites: JSON.parse(campaign.seniorites),
                    keywords: JSON.parse(campaign.keywords),
                    companysList: JSON.parse(campaign.companys_list),
                    jobTitles: JSON.parse(campaign.job_titles),
                    user_id: campaign.user_id,
                }
            })
        return res.status(200).json(formattedData)
    }

    return res.status(500).json({ error: 'Something bad happened' })
}

const update = async (
    res: NextApiResponse,
    body: Campaign,
    jwt: JwtPayload
) => {
    const updates = {
        state: body.state,
        seniorites: JSON.stringify(body.seniorites),
        keywords: JSON.stringify(body.keywords),
        companys_list: JSON.stringify(body.companysList),
        job_titles: JSON.stringify(body.jobTitles),
    }

    const { data, error } = await supabase
        .from('campaigns')
        .update(updates)
        .eq('id', body.id)

    if (error) {
        return res.status(500).json({ error: error.message })
    } else if (data) {
        return getCampaigns(res, jwt)
    }

    return res.status(500).json({ error: 'Something bad happened' })
}

export default updates
