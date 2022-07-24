interface CampaignItem {
    name: string
    isIncluded: boolean
}

interface Campaign {
    user_id: string
    id: string
    name: string
    state: string
    seniorites: CampaignItem[]
    keywords: CampaignItem[]
    companysList: CampaignItem[]
    jobTitles: CampaignItem[]
}

interface formPost {
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
    paid_for?: any
    is_processing: boolean
    expected_completion_time: string
    error: string
}