import { render, screen } from '@testing-library/react'
import Table from './index'
import '@testing-library/jest-dom'

const data = [
    {
        id: 1,
        user_id: 1,
        name: 'first',
        row_count: 1,
        file: '',
        campaigns: ['1'],
        comp_high: 1,
        comp_medium: 1,
        comp_low: 1,
        job_title_high: 1,
        job_title_medium: 1,
        job_title_low: 1,
        job_title_unique_count: 1,
        comp_unique_count: 1,
        created_at: '2022/05/02',
        paid_for: false,
        is_processing: false,
        expected_completion_time: '2022/05/02',
        error: '',
    },
]
const handleClickExportOpen = (id, cost, fileUrl, paid_for) => {}

const onDelete = (id) => {}
describe('Table', () => {
    it('renders a Table', () => {
        render(
            <Table
                handleClickExportOpen={handleClickExportOpen}
                onDelete={onDelete}
                data={data}
            />
        )

        const heading = screen.getByRole('button', {
            name: 'Unique Rows',
        })

        expect(heading).toBeInTheDocument()
    })
})
