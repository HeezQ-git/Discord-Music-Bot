import './UserAvatar.scss';

import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography } from '@mui/material';

const UserAvatar = (props) => {

    const width = props.width ? props.width.toString() : '50px';
    const height = props.height ? props.height.toString() : '50px';
    const margin = props.margin ? props.margin.toString() : '0';

    const backgrounds = [
        '#fc761c', '#31bd97', '#3187bd',
        '#325fad', '#6532ad', '#8c32ad',
        '#ad327c', '#ad3240', '#32ba94',
        '#ba7832', '#a87f54', '#a85854',
        '#9454a8', '#a85489', '#9c4343',
        '#439c4d', '#278791', '#279132'
    ]
    const [color, setColor] = useState('');

    useEffect(() => setColor(backgrounds[Math.floor(Math.random() * backgrounds.length)]), []);

    return (
        <div className="userAvatar">
            {props.avatar && props.avatar.length > 0 ?
            <div style={{ background: `url('${props.avatar}')`, backgroundSize: 'cover', backgroundPosition: 'center', width: width, height: height, margin: margin, borderRadius: `${props.rounded ? props.rounded + 'px' : '0'}`, borderImage: 'fill' }}/>
            : <Grid className="random" sx={{ width: width, height: height, margin: margin, background: color, borderRadius: `${props.rounded ? props.rounded + 'px' : '0'}` }}>
                <Typography className="char" sx={{ fontSize: `${parseInt(width.replace('px', '')) / 22.5}rem` }}>{props.username && props.username.charAt(0) || 'U'}</Typography>
            </Grid>}
        </div>
    )
}

export default UserAvatar;