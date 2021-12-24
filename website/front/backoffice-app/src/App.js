import './App.scss';
import Home from './components/Home';
import SongList from './components/SongList';
import Login from './components/Login';
import AccountActivate from './components/AccountActivate';
import { Routes, Route } from 'react-router-dom';

function App() {
    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="songlist" element={<SongList/>}/>
                <Route path="login" element={<Login/>}/>
                <Route path="account/activate/:id" element={<AccountActivate/>}/>
            </Routes>
        </div>
    );
}

export default App;
