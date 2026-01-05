import React from 'react'
import { Badge, Box } from '@adminjs/design-system'

const PriorityBadge = (props) => {
    const { record, property } = props
    const value = record.params[property.name]

    if (!value) {
        return null
    }

    let variant = 'default'
    switch (value) {
        case 'HIGH':
            variant = 'danger' // Red
            break
        case 'MEDIUM':
            variant = 'warning' // Orange/Yellow
            break
        case 'COURTESY':
        case 'MESSAGE':
            variant = 'info' // Blue/Info
            break
        default:
            variant = 'light'
    }

    return (
        <Box>
            <Badge variant={variant}>{value}</Badge>
        </Box>
    )
}

export default PriorityBadge
