import { Button, Divider, Rating } from '@mui/material';
import {
    MdCheckCircleOutline,
    MdHighlightOff,
    MdOutlineAccessTime,
} from 'react-icons/md';
import { useNavigate } from 'react-router';
import {
    brokenLevelLabels,
    dancemodes,
    difficulties,
    efforts,
    genres,
    tags,
    versions,
} from '../../../utils/enums';
import './SongInfo.scss';

const SongInfo = ({ song, allArtists }) => {
    const findValue = (id, array) =>
        array.find((item) => item.id == id) || undefined;

    return (
        <div className="summary w-full flex flex-col">
            <div className="summary_panel w-full drop-shadow-md">
                <img className="image drop-shadow-lg" src={song.cover} />
                <div className="flex flex-col gap-4">
                    <div className="items">
                        <div className="summary_container">
                            <span>Title</span>
                            <h2>{song.name}</h2>
                        </div>
                        <div className="summary_container">
                            <span>Version</span>
                            <h2>{findValue(song.version, versions).label}</h2>
                        </div>
                        <div className="summary_container">
                            <span>Game</span>
                            <h2>{song.game}</h2>
                        </div>
                        <div className="summary_container">
                            <span>Dancemode</span>
                            <h2>
                                {findValue(song.dancemode, dancemodes).label}
                            </h2>
                        </div>
                        <div className="summary_container">
                            <span>Difficulty</span>
                            <h2>
                                {findValue(song.difficulty, difficulties).label}
                            </h2>
                        </div>
                        <div className="summary_container">
                            <span>Effort</span>
                            <h2>{findValue(song.effort, efforts).label}</h2>
                        </div>
                        <div className="summary_container">
                            <span>Times</span>
                            <h2>{song.times}</h2>
                        </div>
                    </div>
                    <Divider />
                    <div className="flex flex-col gap-[10px]">
                        <div className="summary_list">
                            <span>Artist{song.artist.length > 1 && 's'}</span>
                            <div className="summary_items">
                                {song.artist.map((_artist, index) => (
                                    <div
                                        key={index}
                                        className={`summary_item drop-shadow-sm bg-indigo-500/50 ${
                                            allArtists &&
                                            !allArtists.includes(_artist) &&
                                            'new_mark'
                                        }`}
                                    >
                                        {_artist}
                                    </div>
                                ))}
                            </div>
                        </div>
                        {song.genre.length > 0 && (
                            <div className="summary_list">
                                <span>Genre{song.genre.length > 1 && 's'}</span>
                                <div className="summary_items">
                                    {song.genre.map((_genre, index) => (
                                        <div
                                            key={index}
                                            className="summary_item drop-shadow-sm bg-emerald-400/50"
                                        >
                                            {findValue(_genre, genres).label}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {!!song.tags.length && (
                            <div className="summary_list">
                                <span>Tag{song.tags.length > 1 && 's'}</span>
                                <div className="summary_items">
                                    {song.tags.map((_tag, index) => (
                                        <div
                                            key={index}
                                            className="summary_item drop-shadow-sm bg-sky-400/50"
                                        >
                                            {findValue(_tag, tags).emoji}{' '}
                                            {findValue(_tag, tags).label}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        <div className="summary_container">
                            <div className="flex items-center gap-[5px]">
                                <MdOutlineAccessTime size={20} />
                                <span>Duration: {song.duration}</span>
                            </div>
                        </div>
                        <div className="summary_container">
                            <span>
                                {brokenLevelLabels[song.xboxbrokenlevel]}
                            </span>
                            <Rating
                                value={song.xboxbrokenlevel}
                                max={10}
                                disabled
                            />
                            <span className="font-semibold mt-[5px]">
                                Broken level
                            </span>
                        </div>
                        <div className="mt-[5px]">
                            <div className="summary_container">
                                <div className="flex items-center gap-[5px] font-semibold">
                                    {song.released ? (
                                        <MdCheckCircleOutline
                                            size={25}
                                            className="text-green-500"
                                        />
                                    ) : (
                                        <MdHighlightOff
                                            size={25}
                                            className="text-red-500"
                                        />
                                    )}
                                    {song.released
                                        ? 'Released'
                                        : 'Not released'}
                                </div>
                            </div>
                            <div className="summary_container">
                                <div className="flex items-center gap-[5px] font-semibold">
                                    {song.excluded ? (
                                        <MdCheckCircleOutline
                                            size={25}
                                            className="text-green-500"
                                        />
                                    ) : (
                                        <MdHighlightOff
                                            size={25}
                                            className="text-red-500"
                                        />
                                    )}
                                    {song.excluded
                                        ? 'Excluded from WDF'
                                        : 'Not excluded from WDF'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SongInfo;
