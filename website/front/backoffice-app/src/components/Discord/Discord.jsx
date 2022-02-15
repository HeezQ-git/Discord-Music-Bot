import { FaDiscord } from 'react-icons/fa';
import { Button } from '@mui/material';

const Discord = (props) => {

    return (
        <a style={{ textDecoration: 'none' }} target='_blank' href='https://discord.gg/RxeuKWFZbH'><Button startIcon={<FaDiscord/>} {...props}>Discord</Button></a>
    )
}

export default Discord;