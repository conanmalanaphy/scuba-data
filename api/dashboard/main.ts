import { NextApiHandler } from 'next'
import { supabase } from '../../libs/initSupabase'
import jwt_decode, { JwtPayload } from 'jwt-decode'
import type { NextApiResponse } from 'next'

interface FormPost {
    id?: number | undefined
    user_id?: string
    name: string
    row_count: number
    file: string
    campaigns: string[]
    comp_high: number
    comp_medium: number
    comp_low: number
    job_title_high: number
    job_title_medium: number
    job_title_low: number
    job_title_unique_count: number
    comp_unique_count: number
    created_at: string
    paid_for?: boolean | undefined
    is_processing: boolean
    expected_completion_time: string
    error: string
}

const Results: NextApiHandler = async (req, res) => {
    const token: string = req.headers.token as string
    const jwt: JwtPayload = jwt_decode(token)

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

const deleteResult = async (
    res: NextApiResponse,
    body: FormPost,
    jwt: JwtPayload
) => {
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

const getResults = async (res: NextApiResponse, jwt: JwtPayload) => {
    const { data, error } = await supabase
        .from('results')
        .select('*')
        .eq('user_id', jwt.sub)
        .is('deleted_at', null)

    if (error) {
        return res.status(500).json({ error: error.message })
    } else if (data) {
        return res.status(200).json(data)
    }

    return res.status(500).json({ error: 'Something bad happened' })
}

const newResult = async (
    res: NextApiResponse,
    body: FormPost,
    jwt: JwtPayload
) => {
    const { data, error } = await supabase
        .from('results')
        .upsert({ ...body, user_id: jwt.sub?.toString() })

    if (error) {
        return res.status(500).json({ error: error.message })
    } else if (data) {
        return getResults(res, jwt)
    }

    return res.status(500).json({ error: 'Something bad happened' })
}

export default Results
