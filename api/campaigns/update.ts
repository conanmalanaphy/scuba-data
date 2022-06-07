import { NextApiHandler } from 'next'
import { supabase } from '../../libs/initSupabase'

const user: NextApiHandler = async (req, res) => {
    if (req.method === 'POST') {
        // probs do some validation on this??

        const updates = {
            seniorites: JSON.stringify(req.body.seniorites),
            keywords: JSON.stringify(req.body.keywords),
            companys_list: JSON.stringify(req.body.companysList),
            job_titles: JSON.stringify(req.body.jobTitles),
        }
        const { data, error } = await supabase
            .from('campaigns')
            .update(updates)
            .eq('id', req.body.id)
        if (!error) {
            res.status(200).json(data)
        } else {
            res.status(404).end()
        }
        return
    }
}

export default user
