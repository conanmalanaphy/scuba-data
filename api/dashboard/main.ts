import { NextApiHandler } from 'next'
import { supabase } from '../../libs/initSupabase'
import jwt_decode from 'jwt-decode'

const Results: NextApiHandler = async (req, res) => {
    const token: string = req.headers.token as string
    const jwt = jwt_decode(token)

    supabase.auth.setAuth(token)

    if (req.method === 'GET') {
        return getResults(res, jwt)
    } else if (req.method === 'POST') {
        return newResult(res, req.body, jwt)
    } else if (req.method === 'DELETE') {
        return deleteResult(res, req.body, jwt)
    }

    return res.status(404).json({ error: 'API method not found' })
}

const deleteResult = async (res: any, body: any, jwt: any) => {
    const { data, error } = await supabase
        .from('results')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', body.id)

    if (error) {
        return res.status(500).json({ error: error.message })
    } else if (data) {
        return getResults(res, jwt)
    }

    return res.status(500).json({ error: 'Something bad happened' })
}

const getResults = async (res: any, jwt: any) => {
    const { data, error } = await supabase
        .from('results')
        .select('*')
        .eq('user', jwt.sub)
        .is('deleted_at', null)

    if (error) {
        return res.status(500).json({ error: error.message })
    } else if (data) {
        return res.status(200).json(data)
    }

    return res.status(500).json({ error: 'Something bad happened' })
}

const newResult: any = async (res: any, body: any, jwt: any) => {
    const { data, error } = await supabase
        .from('results')
        .upsert({ ...body, user: jwt.sub.toString() })

    if (error) {
        return res.status(500).json({ error: error.message })
    } else if (data) {
        return getResults(res, jwt)
    }

    return res.status(500).json({ error: 'Something bad happened' })
}

export default Results
