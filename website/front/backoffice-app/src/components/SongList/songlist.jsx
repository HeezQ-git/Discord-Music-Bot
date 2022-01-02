import './songlist.scss';
import { songsService } from '../../services/songs.service';
import React, { useState, useEffect } from 'react';
import loader from './../../img/loader.svg';

const SongList = () => {
    
    const [songs, setSongs] = useState([]);
    const [songInfo, setSongInfo] = useState();

    // const tags = [
    //     {emoji:"💃", name:"Sassy", id:"1"},
    //     {emoji:"👒", name:"Latin", id:"2"},
    //     {emoji:"💋", name:"K-Pop", id:"3"},
    //     {emoji:"🌺", name:"BOP", id:"4"},
    //     {emoji:"🎉", name:"Party", id:"5"},
    //     {emoji:"🧪", name:"Not released", id:"6"},
    //     {emoji:"🤡", name:"Troll", id:"7"},
    //     {emoji:"❌", name:"Excluded", id:"8"},
    //     {emoji:"🎤", name:"Cover", id:"9"},
    //     {emoji:"💦", name:"Sweat", id:"10"},
    //     {emoji:"🐼", name:"Panda", id:"11"},
    //     {emoji:"📺", name:"Cartoon", id:"12"},
    //     {emoji:"🌹", name:"Romantic", id:"13"},
    //     {emoji:"🐢", name:"Animal", id:"14"},
    //     {emoji:"⚔", name:"Battle", id:"15"},
    //     {emoji:"🤖", name:"Robot", id:"16"},
    //     {emoji:"🦇", name:"Halloween", id:"17"},
    //     {emoji:"🎄", name:"Christmas", id:"18"},
    //     {emoji:"😱", name:"Drama", id:"19"},
    //     {emoji:"👪", name:"Family", id:"20"},
    //     {emoji:"🥴", name:"Wacky", id:"21"},
    //     {emoji:"🌞", name:"Summer", id:"22"},
    //     {emoji:"⚽", name:"Brasilian", id:"23"},
    //     {emoji:"🤠", name:"Western", id:"24"}
    // ];

    // const findTag = (tagId) => {
    //     tags.map(tag => {
    //         if (tag.id == `${tagId}`) return tag.name;
    //     })
    // }

    const delay = async ms => new Promise(res => setTimeout(res, ms));
    
    const _getSongs = () => {
        songsService.getSongs()
        .then(res => {
            let _songs = res.data.songs;
            setSongs(_songs);
        });
    }

    const changeSong = async (song) => {
        // console.log(song);
        if (songInfo ? song.name === songInfo.name : false) return;
        if (song.loading) return;
        song.loading = true;
        setSongInfo(song);       

        await delay(Math.floor(Math.random() * (1500 - 250 + 1)));

        song.loading = false;
        const newSong = {...song};
        setSongInfo(newSong);
        // console.log('after');
    }

    // console.log(songInfo.tags.map(tag => findTag(tag)));

    useEffect(() => _getSongs(), [songsService])
    
    return (
        <div className="Songlist-content">
            <div className="inside-content">
                <div className="songlist">
                    {songs.length > 0 ? songs.map((song, index) => {
                        return (
                            <div key={index} onClick={() => changeSong(song)} className="song">
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
                    }) : 
                    <div className="loading">
                        <img src={loader}></img>
                        <h1>Loading songs, please wait...</h1>
                    </div>}
                </div>
                <div className="details">
                    {songInfo ? 
                        !(songInfo.loading) ? 
                        <div className="content">
                            <div className="header">
                                <div className="left-side">
                                    <p className="title">{songInfo.name}</p>
                                    <p className="artist">{songInfo.artist.join(' & ')}</p>
                                </div>
                                <div className="right-side">
                                    <div className="border">
                                        <div className="bars">
                                            <div className={`bar bar1`}></div>
                                            <div className={`bar bar2--${songInfo.difficulty.toLowerCase()}`}></div>
                                            <div className={`bar bar3--${songInfo.difficulty.toLowerCase()}`}></div>
                                            <div className={`bar bar4--${songInfo.difficulty.toLowerCase()}`}></div>
                                        </div>
                                        <p className="difficulty">{songInfo.difficulty}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="video">
                                <iframe src={songInfo ? `${songInfo.preview}${!songInfo.preview.includes('?') ? '?' : '&'}modestbranding=1&autohide=1&showinfo=0&rel=0&loop=1` : ''} frameBorder={"0"} allow={"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; modestbranding"} allowFullScreen></iframe>
                            </div>
                            <div className="songinfo">
                                <h1>Song info</h1>
                                <div className="col--xxl">
                                    <div className="sub-col">
                                        <div className="info">
                                            <h1>🎮 Game</h1>
                                            <h2>Just Dance {songInfo.game}</h2>
                                        </div>
                                        <div className="info">
                                            <h1>💃 Dance Mode</h1>
                                            <h2>{songInfo.dancemode}</h2>
                                        </div>
                                        <div className="info">
                                            <h1>🕐 Duration</h1>
                                            <h2>{songInfo.duration}</h2>
                                        </div>
                                    </div>
                                    <div className="sub-col">
                                        <div className="info">
                                            <h1>🍂 Difficulty</h1>
                                            <h2>{songInfo.difficulty}</h2>
                                        </div>
                                        <div className="info">
                                            <h1>💦 Effort</h1>
                                            <h2>{songInfo.effort}</h2>
                                        </div>
                                    </div>
                                </div>
                                <div className="col--xl">
                                    <div className="sub-col">
                                        <div className="info">
                                            <h1>🎮 Game</h1>
                                            <h2>Just Dance {songInfo.game}</h2>
                                        </div>
                                        <div className="info">
                                            <h1>💃 Dance Mode</h1>
                                            <h2>{songInfo.dancemode}</h2>
                                        </div>
                                        
                                    </div>
                                    <div className="sub-col">
                                        <div className="info">
                                            <h1>🕐 Duration</h1>
                                            <h2>{songInfo.duration}</h2>
                                        </div>
                                        <div className="info">
                                            <h1>🍂 Difficulty</h1>
                                            <h2>{songInfo.difficulty}</h2>
                                        </div>
                                    </div>
                                    <div className="sub-col">
                                        <div className="info">
                                            <h1>💦 Effort</h1>
                                            <h2>{songInfo.effort}</h2>
                                        </div>
                                    </div>
                                </div>
                                <div className="col--m">
                                    <div className="sub-col">
                                        <div className="info">
                                            <h1>🎮 Game</h1>
                                            <h2>Just Dance {songInfo.game}</h2>
                                        </div>
                                    </div>
                                    <div className="sub-col">
                                        <div className="info">
                                            <h1>💃 Dance Mode</h1>
                                            <h2>{songInfo.dancemode}</h2>
                                        </div>
                                    </div>
                                    <div className="sub-col">
                                    <div className="info">
                                            <h1>🕐 Duration</h1>
                                            <h2>{songInfo.duration}</h2>
                                        </div>
                                    </div>
                                    <div className="sub-col">
                                    <div className="info">
                                            <h1>🍂 Difficulty</h1>
                                            <h2>{songInfo.difficulty}</h2>
                                        </div>
                                    </div>
                                    <div className="sub-col">
                                    <div className="info">
                                            <h1>💦 Effort</h1>
                                            <h2>{songInfo.effort}</h2>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div> 
                        : 
                            <div className="loading">
                                <img src={loader}></img>
                                <h1>Loading content...</h1>
                            </div> 
                        : 
                        <div className="select">
                            <h1>Select song to continue</h1>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default SongList;