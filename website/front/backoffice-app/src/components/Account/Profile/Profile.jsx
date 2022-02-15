import './Profile.scss';
import { Container, Paper } from '@mui/material';


const Profile = () => {
    
    return (
        <Container component="main" className='profile' maxWidth='lg'>
            <Paper elevation={8} className='profile_paper'>
                {/* <Grid className="top_bar">

                </Grid> */}
            </Paper>
        </Container>
    )
}

export default Profile;