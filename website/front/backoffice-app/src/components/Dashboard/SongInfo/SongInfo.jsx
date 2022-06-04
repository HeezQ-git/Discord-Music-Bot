import { Button, Rating } from "@mui/material";
import {
    MdCheckCircleOutline,
    MdHighlightOff,
    MdOutlineAccessTime,
} from "react-icons/md";
import { useNavigate } from "react-router";
import { brokenLevelLabels } from "../../../utils/enums";
import "./SongInfo.scss";

const SongInfo = ({ song }) => {
    const navigate = useNavigate();

    return (
        <div className="summary w-full flex flex-col">
            <div className="summary_panel w-full drop-shadow-md">
                <img className="image drop-shadow-lg" src={song.cover} />
                <div className="items">
                    <div className="summary_container">
                        <span>Title</span>
                        <h2>{song.name}</h2>
                    </div>
                    <div className="summary_container">
                        <span>Version</span>
                        <h2>{song.version.label}</h2>
                    </div>
                    <div className="summary_container">
                        <span>Game</span>
                        <h2>{song.game}</h2>
                    </div>
                    <div className="summary_container">
                        <span>Dancemode</span>
                        <h2>{song.dancemode.label}</h2>
                    </div>
                    <div className="summary_container">
                        <span>Difficulty</span>
                        <h2>{song.difficulty.label}</h2>
                    </div>
                    <div className="summary_container">
                        <span>Effort</span>
                        <h2>{song.effort.label}</h2>
                    </div>
                    <div className="summary_container">
                        <span>Times</span>
                        <h2>{song.times}</h2>
                    </div>
                    <div className="flex flex-col gap-[10px]">
                        <div className="summary_list">
                            <span>Artist{song.artist.length > 1 && "s"}</span>
                            <div className="summary_items">
                                {song.artist.map((art, index) => (
                                    <div
                                        key={index}
                                        className={`summary_item drop-shadow-sm bg-indigo-500/50`}
                                    >
                                        {art}
                                    </div>
                                ))}
                            </div>
                        </div>
                        {song.genre.length > 0 && (
                            <div className="summary_list">
                                <span>Genre{song.genre.length > 1 && "s"}</span>
                                <div className="summary_items">
                                    {song.genre.map((gen, index) => (
                                        <div
                                            key={index}
                                            className="summary_item drop-shadow-sm bg-emerald-400/50"
                                        >
                                            {gen}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {song.tags.length > 0 && (
                            <div className="summary_list">
                                <span>Tag{song.tags.length > 1 && "s"}</span>
                                <div className="summary_items">
                                    {song.tags.map((_tag, index) => (
                                        <div
                                            key={index}
                                            className="summary_item drop-shadow-sm bg-sky-400/50"
                                        >
                                            {_tag.emoji} {_tag.label}
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
                                        ? "Released"
                                        : "Not released"}
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
                                        ? "Excluded from WDF"
                                        : "Not excluded from WDF"}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full flex justify-end">
                <Button
                    variant="outlined"
                    onClick={() => navigate(`edit-song/${song._id}`)}
                >
                    Edit
                </Button>
            </div>
        </div>
    );
};

export default SongInfo;
