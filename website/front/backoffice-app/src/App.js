import './App.scss';
import Home from './components/Home';
import Header from './components/Header';
import SongList from './components/SongList';
import Login from './components/Login';
import Account from './components/Account';
import { Routes, Route } from 'react-router-dom';

function App() {
    return (
        <div className="App">
            <Header></Header>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/songlist" element={<SongList/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/login/:email" element={<Login/>}/>
                <Route path="/account/*" element={<Account/>}/>
            </Routes>
        </div>
    );
}

export default App;
