import './Loading.scss';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';

const Loading = ({ content }) => {
    return (
        <div className="loading-container">
            {content ?
                <div className="loading-text">
                    <div className="loading-box" >
                        <Typography variant="h4">Loading content...</Typography>
                        <LinearProgress sx={{ backgroundColor: 'transparent' }} id='simple-linear-progress-loading' /> 
                    </div>
                </div> 
            : 
                <div className="loading-contentbox">
                    <LinearProgress sx={{ backgroundColor: 'transparent' }} id='simple-linear-progress' /> 
                </div>
            }
        </div>
    )
}

export default Loading;