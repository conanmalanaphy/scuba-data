import { NextApiHandler } from 'next'
import { supabase } from '../../libs/initSupabase'

interface item {
    name: string
    isIncluded: boolean
}

interface campaign {
    user: string
    id: string
    name: string
    state: string
    seniorites: item[]
    keywords: item[]
    companysList: item[]
    jobTitles: item[]
}

const user: NextApiHandler = async (req, res) => {
    const { id } = req.query

    if (req.method === 'POST') {
        // probs do some validation on this??

        const updates = {
            user: id,
            name: req.body.name,
            state: req.body.state,
            seniorites: JSON.stringify(req.body.seniorites),
            keywords: JSON.stringify(req.body.keywords),
            companys_list: JSON.stringify(req.body.companysList),
            job_titles: JSON.stringify(req.body.jobTitles),
        }

        const { data, error } = await supabase.from('campaigns').upsert(updates)
        res.status(200).json(data)
        return
    }

    if (id) {
        const { data, error } = await supabase
            .from('campaigns')
            .select('*')
            .eq('user', id)

        if (data) {
            const aa = data.map((campaign: any) => {
                return {
                    id: campaign.id,
                    name: campaign.name,
                    state: campaign.state,
                    seniorites: JSON.parse(campaign.seniorites),
                    keywords: JSON.parse(campaign.keywords),
                    companysList: JSON.parse(campaign.companys_list),
                    jobTitles: JSON.parse(campaign.job_titles),
                    user: id,
                }
            })
            res.status(200).json(aa)
        } else {
            res.status(404).end()
        }
    }
    res.status(404).end()
}

export default user
