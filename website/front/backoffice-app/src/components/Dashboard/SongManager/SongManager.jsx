import React, { useState, useEffect } from "react";
import "./SongManager.scss";
import { songsService } from "../../../services/songs.service";
import {
    Button,
    CircularProgress,
    IconButton,
    Pagination,
    Tooltip,
} from "@mui/material";
import { MdOutlineAdd, MdOutlineDelete, MdRefresh } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { FcSearch } from "react-icons/fc";
import Input from "../../Input";
import { paginate, getPage } from "../../../utils/pagination";
import { delay } from "../../../utils/functions";
import { useNavigate } from "react-router";

const SongManager = () => {
    const [allSongs, setAllSongs] = useState();
    const [songsDisplay, setSongsDisplay] = useState();
    const [paginated, setPaginated] = useState();
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [classes, setClasses] = useState(true);

    const navigate = useNavigate();
    const amountPerPage = 5;

    const getSongs = async () => {
        setLoading(true);
        setSongsDisplay();

        const result = await songsService.getSongs();
        const songs = result.data.songs;

        if (result.data.success && songs) {
            setAllSongs(songs);
            const _tmp = paginate(songs, amountPerPage);
            setPaginated(_tmp);
            setSongsDisplay(getPage(_tmp, page));
        }

        setLoading(false);
    };

    const changePage = async (num) => {
        if (num === page || num <= 0 || num > paginated.length) return;

        setClasses(false);
        await delay(1);
        setClasses(true);

        setSongsDisplay(getPage(paginated, num));
        setPage(num);
    };

    const searchSong = (value) => {
        let val = value.toLowerCase();

        const foundSongs = allSongs.filter(
            (song) =>
                song.name.toLowerCase().includes(val) ||
                song.artist.join(" ").toLowerCase().includes(val)
        );

        if (foundSongs) {
            const _ = paginate(foundSongs, amountPerPage);
            setPaginated(_);
            setSongsDisplay(getPage(_, 1));
        }
    };

    useEffect(() => {
        getSongs();
    }, []);

    return (
        <div className="songmanager_main">
            <div className="songmanager_container drop-shadow-xl">
                <div className="head flex items-center gap-[10px]">
                    <h2 className="text-xl opacity-90">Song Manager</h2>
                    <Tooltip title="Reload">
                        <IconButton onClick={() => getSongs()}>
                            <MdRefresh />
                        </IconButton>
                    </Tooltip>
                    <Input
                        size="small"
                        label="🔎 Search..."
                        className="opacity-70"
                        onChange={(e) => searchSong(e.target.value)}
                    />
                </div>
                {loading && (
                    <div className="flex items-center gap-[25px] mt-[15px]">
                        <CircularProgress />{" "}
                        <span className="text-lg">Loading songs...</span>
                    </div>
                )}
                {songsDisplay &&
                    songsDisplay.map((song, index) => {
                        return (
                            <div
                                key={index}
                                className="song_outer hover:drop-shadow-md"
                            >
                                <div
                                    className={`song ${
                                        classes ? "animate" : ""
                                    }`}
                                    style={{ animationDelay: `0.${index}s` }}
                                >
                                    <div className="items_left">
                                        <img
                                            loading="lazy"
                                            className="song_img drop-shadow-xl"
                                            src={song.cover}
                                        />
                                        <div className="song_info">
                                            <h2 className="title text-base">
                                                {song.name}
                                            </h2>
                                            <span className="artist text-sm">
                                                {song.artist.join(" & ")}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="items_right">
                                        <Tooltip title="Edit">
                                            <IconButton>
                                                <FaRegEdit />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete">
                                            <IconButton>
                                                <MdOutlineDelete />
                                            </IconButton>
                                        </Tooltip>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                {paginated && songsDisplay && (
                    <div className="pagination_buttons">
                        <Pagination
                            count={paginated.length}
                            page={page}
                            size="large"
                            onChange={(e, p) => {
                                setPage(p);
                                changePage(p);
                            }}
                        />
                    </div>
                )}
                {!songsDisplay && !loading && (
                    <div className="nothing_found flex items-center justify-center gap-[5px] my-[50px]">
                        <FcSearch size={25} />
                        <span>No results were found</span>
                    </div>
                )}
                <div className="w-full flex items-end justify-end">
                    <Button
                        variant="contained"
                        startIcon={<MdOutlineAdd />}
                        onClick={() =>
                            navigate("/dashboard/song-manager/add-song")
                        }
                    >
                        Add song
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default SongManager;
