import './App.scss';
import Home from './components/Home';
import SongList from './components/SongList';
import { Routes, Route } from 'react-router-dom';

function App() {
    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="songlist" element={<SongList/>}/>
            </Routes>
        </div>
    );
}

export default App;
