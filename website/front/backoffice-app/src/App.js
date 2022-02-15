import './App.scss';
import Home from './components/Home';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import SongList from './components/SongList';
import Login from './components/Login';
import Account from './components/Account';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { blue, red, grey } from '@mui/material/colors';
import { useState } from 'react';
import { Box } from '@mui/material';

const themeLight = createTheme({
    palette: {
        mode: 'light',
        text: {
            primary: grey[700],
            secondary: grey[800],
        },
        primary: {
            main: blue['A400'],
            dark: blue[800],
        },
        secondary: red,
    },
});

const themeDark = createTheme({
    palette: {
        mode: 'dark',
        text: {
            primary: grey[200],
            secondary: grey[300],
        },
        primary: {
            main: blue['A200'],
            dark: blue['A400'],
        },
        secondary: red,
    },
});

function App() {

    const [theme, setTheme] = useState(true);

    return (
        <div className={`App${theme ? ' dark_theme' : ''}`}>
            <ThemeProvider theme={theme ? themeDark : themeLight}>
                <Header theme={theme} setTheme={setTheme} />
                {/* <Header theme={theme}></Header> */}
                <Box className="limitWidth">
                    <Routes>
                        <Route path="/" element={<Home/>}/>
                        <Route path="/songlist" element={<SongList/>}/>
                        <Route path="/login" element={<Login theme={theme} />}/>
                        <Route path="/account/*" element={<Account theme={theme}/>}/>
                    </Routes>
                </Box>
            </ThemeProvider>
        </div>
    );
}

export default App;
