import { NextApiHandler } from 'next'
import { supabase } from '../../libs/initSupabase'
import jwt_decode from 'jwt-decode'

const Tasks: NextApiHandler = async (req, res) => {
    const token: string = req.headers.token as string
    const jwt = jwt_decode(token)

    supabase.auth.setAuth(token)

    if (req.method === 'GET') {
        return getTasks(res, jwt)
    } else if (req.method === 'POST') {
        return saveTask(res, req.body, jwt)
    }

    return res.status(404).json({ error: 'API method not found' })
}

const getTasks = async (res: any, jwt: any) => {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', jwt.sub)

    if (error) {
        return res.status(500).json({ error: error.message })
    } else if (data) {
        return res.status(200).json(data[0].credit_count)
    }

    return res.status(500).json({ error: 'Something bad happened' })
}

const saveTask: any = async (res: any, body: any, jwt: any) => {
    const { data, error } = await supabase
        .from('users')
        .update({ credit_count: body.credit_count })
        .match({ user_id: jwt.sub })

    if (error) {
        return res.status(500).json({ error: error.message })
    } else if (data) {
        return res.status(200).json(data[0].credit_count)
    }

    return res.status(500).json({ error: 'Something bad happened' })
}

export default Tasks
