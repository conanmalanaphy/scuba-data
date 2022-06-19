import { NextApiHandler } from 'next'
import { supabase } from '../../libs/initSupabase'
import jwt_decode from 'jwt-decode'

const Campaigns: NextApiHandler = async (req, res) => {
    const token: string = req.headers.token as string
    const jwt = jwt_decode(token)

    supabase.auth.setAuth(token)

    if (req.method === 'GET') {
        return getCampaigns(res, jwt)
    } else if (req.method === 'POST') {
        return newCampaign(res, req.body, jwt)
    } else if (req.method === 'DELETE') {
        return deleteCampaign(res, req.body, jwt)
    }

    return res.status(404).json({ error: 'API method not found' })
}

const deleteCampaign = async (res: any, body: any, jwt: any) => {
    const { data, error } = await supabase
        .from('campaigns')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', body.id)

    if (error) {
        return res.status(500).json({ error: error.message })
    } else if (data) {
        return getCampaigns(res, jwt)
    }

    return res.status(500).json({ error: 'Something bad happened' })
}

const getCampaigns = async (res: any, jwt: any) => {
    const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('user', jwt.sub)
        .is('deleted_at', null)

    if (error) {
        return res.status(500).json({ error: error.message })
    } else if (data) {
        const formattedData = data
            .filter((a: any) => a.state !== 'ARCHIVED')
            .map((campaign: any) => {
                return {
                    id: campaign.id,
                    name: campaign.name,
                    state: campaign.state,
                    seniorites: JSON.parse(campaign.seniorites),
                    keywords: JSON.parse(campaign.keywords),
                    companysList: JSON.parse(campaign.companys_list),
                    jobTitles: JSON.parse(campaign.job_titles),
                    user: campaign.user,
                }
            })
        return res.status(200).json(formattedData)
    }

    return res.status(500).json({ error: 'Something bad happened' })
}

const newCampaign: any = async (res: any, body: any, jwt: any) => {
    const updates = {
        user: jwt.sub,
        name: body.name,
        state: body.state,
        seniorites: JSON.stringify(body.seniorites),
        keywords: JSON.stringify(body.keywords),
        companys_list: JSON.stringify(body.companysList),
        job_titles: JSON.stringify(body.jobTitles),
    }

    const { data, error } = await supabase.from('campaigns').upsert(updates)

    if (error) {
        return res.status(500).json({ error: error.message })
    } else if (data) {
        return getCampaigns(res, jwt)
    }

    return res.status(500).json({ error: 'Something bad happened' })
}

export default Campaigns
