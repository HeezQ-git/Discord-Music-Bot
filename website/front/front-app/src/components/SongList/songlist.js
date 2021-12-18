import './songlist.scss';
import Header from './../Header';
import { songsService } from './../../services/songs.service';
import React, { useState, useEffect } from 'react';

const SongList = () => {
    
    const [songs, setSongs] = useState([]);
    
    const _getSongs = () => {
        songsService.getSongs()
        .then(res => {
            let _songs = res.data.songs;
            _songs = [..._songs, _songs[1], _songs[1], _songs[1], _songs[1], _songs[1]]
            setSongs(_songs);
        });
    }

    useEffect(() => _getSongs(), [songsService])
    
    return (
        <div className="Songlist-content">
            <Header></Header>
            <div className="inside-content">
                <div className="songlist">
                    {songs ? songs.map((song, index) => {
                        return (
                            <div className="song">
                                <div className="left-side">
                                    <img src={`${song.cover}`}></img>
                                    <div className="text">
                                        <h1>{song.name}</h1>
                                        <h2>{song.artist.join(' & ')}</h2>
                                    </div>
                                </div>
                                <div className="right-side">
                                    <div className="border">
                                        <div className="bars">
                                            <div className={`bar bar1`}></div>
                                            <div className={`bar bar2--${song.difficulty.toLowerCase()}`}></div>
                                            <div className={`bar bar3--${song.difficulty.toLowerCase()}`}></div>
                                            <div className={`bar bar4--${song.difficulty.toLowerCase()}`}></div>
                                        </div>
                                        <p className="difficulty">{song.difficulty}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    }) : <p>No songs found!</p>}
                </div>
                <div className="details">
    
                </div>
            </div>
        </div>
    )
}

export default SongList;