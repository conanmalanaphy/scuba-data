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

    if (req.method === 'DELETE') {
        // probs do some validation on this??
        const { id } = req.query
        console.log(id)

        const { data, error } = await supabase
            .from('campaigns')
            .update({ deleted_at: (new Date()).toISOString() })
            .eq('id', id)

        if (!error) {
            res.status(200).json(data)
        } else {
            console.log(error)
            res.status(404).end()
        }

        return
    }

    if (req.method === 'GET') {
        if (id) {
            const { data, error } = await supabase
                .from('campaigns')
                .select('*')
                .eq('user', id)
                .is('deleted_at', null)
    
            if (!error) {
                const formattedData = data.map((campaign: any) => {
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

                res.status(200).json(formattedData)
            } else {
                res.status(404).end()
            }
        }
        res.status(404).end()
        return
    }

   
}

export default user
