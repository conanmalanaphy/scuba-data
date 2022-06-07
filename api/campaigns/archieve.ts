import { NextApiHandler } from 'next'
import { supabase } from '../../libs/initSupabase'

const user: NextApiHandler = async (req, res) => {
    if (req.method === 'POST') {
        // probs do some validation on this??

        const idToArchive = req.body
        const { data, error } = await supabase
            .from('campaigns')
            .update({ state: 'ARCHIVED' })
            .eq('id', idToArchive)
        if (!error) {
            res.status(200).json(data)
        } else {
            res.status(404).end()
        }
        return
    }
}

export default user
