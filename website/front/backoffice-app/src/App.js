import './App.scss';
import Home from './components/Home';
import Header from './components/Header';
import SongList from './components/SongList';
import Login from './components/Login';
import Account from './components/Account';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { blue, red } from '@mui/material/colors';

function App() {

    const theme = createTheme({
        palette: {
          primary: {
              main: blue['A400'],
              dark: blue[700]
          },
          secondary: red,
        },
    });

    return (
        <div className="App">
            <ThemeProvider theme={theme}>
                <Header></Header>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/songlist" element={<SongList/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/login/:email" element={<Login/>}/>
                    <Route path="/account/*" element={<Account/>}/>
                </Routes>
            </ThemeProvider>
        </div>
    );
}

export default App;
