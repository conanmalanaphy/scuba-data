import React from 'react'
import { Avatar, Grid, Typography } from '@mui/material'

interface Props {
    title: string
    content: JSX.Element
    icon?: JSX.Element
}

export default function FeatureBlock({ title, content, icon }: Props) {
    return (
        <Grid item xs={12} sm={6} md={4} sx={{ mb: 4 }}>
            {icon ? (
                <Avatar
                    variant="rounded"
                    sx={{ backgroundColor: '#e0e0e0', mb: 2 }}
                >
                    {React.cloneElement(icon, { color: 'primary' })}
                </Avatar>
            ) : null}
            <Typography variant="h3" sx={{ mb: 1 }}>
                {title}
            </Typography>
            <Typography variant="body2">{content}</Typography>
        </Grid>
    )
}
