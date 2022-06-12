import { NextApiHandler } from 'next'
import { supabase } from '../../libs/initSupabase'

const user: NextApiHandler = async (req, res) => {
    if (req.method === 'POST') {
        // probs do some validation on this??
        const { user, error } = await supabase.auth.update({ email: req.body })

        if (!error) {
            res.status(200).json(user)
        } else {
            console.log(error)
            res.status(404).end()
        }
        return
    }
}

export default user
