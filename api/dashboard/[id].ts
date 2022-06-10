import { NextApiHandler } from 'next'
import { supabase } from '../../libs/initSupabase'

const user: NextApiHandler = async (req, res) => {
    const { id } = req.query

    if (req.method === 'POST') {
        // probs do some validation on this??
        const { data, error } = await supabase.from('results').upsert(req.body);
        
        res.status(200).json(data)
        return
    }

    if (req.method === 'DELETE') {
        // probs do some validation on this??
        const { id } = req.query
        console.log(id)

        const { data, error } = await supabase
            .from('results')
            .update({ deleted_at: new Date().toISOString() })
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
                .from('results')
                .select('*')
                .eq('user', id)
                .is('deleted_at', null)

            if (data) {
                res.status(200).json(data)
            } else {
                res.status(404).end()
            }
        }
        res.status(404).end()
    }
}

export default user
