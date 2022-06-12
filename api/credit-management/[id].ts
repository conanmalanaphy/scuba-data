import { NextApiHandler } from 'next'
import { supabase } from '../../libs/initSupabase'

const user: NextApiHandler = async (req, res) => {
    const { id } = req.query

    if (req.method === 'POST') {
        const credit_count = req.body.credit_count
        const row_id = req.body.row_id

        console.log(credit_count)
        console.log(row_id)
        // probs do some validation on this??
        const { data, error } = await supabase.from('users').upsert({
            id: row_id,
            credit_count: credit_count,
            user_id: id,
        })

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
                .from('users')
                .select('*')
                .eq('user_id', id)

            if (!error) {
                res.status(200).json(data[0])
            } else {
                console.log(error)
                res.status(404).end()
            }
        }
        res.status(404).end()
    }
}

export default user
