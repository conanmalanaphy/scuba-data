export function sortData(data: FormPost[], sortBy: SortBy) {
    switch (sortBy.sortBy) {
        case 'name':
            return [...data].sort((i, j) => {
                return sortBy.sortDirection === 'asc'
                    ? ('' + i.name).localeCompare(j.name)
                    : ('' + i.name).localeCompare(j.name) * -1
            })
        case 'createdDate':
            return [...data].sort((i, j) => {
                if (i.created_at < j.created_at) {
                    return sortBy.sortDirection === 'asc' ? -1 : 1
                } else {
                    if (i.created_at > j.created_at) {
                        return sortBy.sortDirection === 'asc' ? 1 : -1
                    } else {
                        return 0
                    }
                }
            })
        case 'uniqueRows':
            return [...data].sort((i, j) => {
                return sortBy.sortDirection === 'asc'
                    ? i.row_count - j.row_count
                    : j.row_count - i.row_count
            })
        default:
            return data
            break
    }
}

export function filterlist(list: FormPost[], name: string) {
    return list.filter(function (s: FormPost) {
        return s.name.match(name)
    })
}
