import React, { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import { MdMusicNote, MdOutlineWarningAmber } from "react-icons/md";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { HiCursorClick } from "react-icons/hi";
import "./Dashboard.scss";
import { Route, Routes } from "react-router";
import SongManager from "./SongManager/SongManager";
import { songsService } from "../../services/songs.service";
import AddSong from "./AddSong/AddSong";
import CheckSession from "../CheckSession";
import { Skeleton } from "@mui/material";

const Dashboard = () => {
    const [songs, setSongs] = useState([]);
    const [reports, setReports] = useState(0);

    useEffect(() => {
        (async () => setSongs((await songsService.getSongs()).data.songs))();
    }, []);

    useEffect(() => {
        let c = 0;
        songs.forEach((_) => _.errorCount > 0 && c++);
        setReports(c);
    }, [songs]);

    return (
        <div className="dashboard_main">
            <CheckSession />

            <div className="dashboard_top-feed">
                <div
                    className="dashboard_plate_animation dashboard_plate drop-shadow-xl"
                    style={{ animationDelay: `0.1s` }}
                >
                    <div
                        className={`icon bg-indigo-300 text-indigo-500 opacity-80`}
                    >
                        <div>
                            <FaUser size={25} />
                        </div>
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold">23</h2>
                        <h2 className="text-md opacity-30">Total Users</h2>
                    </div>
                </div>
                <div
                    className="dashboard_plate_animation drop-shadow-xl"
                    style={{ animationDelay: `0.2s` }}
                >
                    {!!songs.length ? (
                        <div className="dashboard_plate">
                            <div
                                className={`icon bg-fuchsia-300 text-fuchsia-500 opacity-80`}
                            >
                                <div>
                                    <MdMusicNote size={25} />
                                </div>
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold">
                                    {songs?.length}
                                </h2>
                                <h2 className="text-md opacity-30">
                                    Total Songs
                                </h2>
                            </div>
                        </div>
                    ) : (
                        <PlateSkeleton />
                    )}
                </div>
                <div
                    className="dashboard_plate_animation dashboard_plate drop-shadow-xl"
                    style={{ animationDelay: `0.3s` }}
                >
                    <div
                        className={`icon bg-emerald-300 text-emerald-600 opacity-80`}
                    >
                        <div>
                            <HiCursorClick size={25} />
                        </div>
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold">293</h2>
                        <h2 className="text-md opacity-30">Actions</h2>
                    </div>
                </div>
                <div
                    className="dashboard_plate_animation drop-shadow-xl"
                    style={{ animationDelay: `0.4s` }}
                >
                    {!!reports ? (
                        <div className="dashboard_plate">
                            <div
                                className={`icon bg-red-300 text-red-600 opacity-80`}
                            >
                                <div>
                                    <MdOutlineWarningAmber size={25} />
                                </div>
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold">
                                    {reports}
                                </h2>
                                <h2 className="text-md opacity-30">Reports</h2>
                            </div>
                            <BiDotsHorizontalRounded
                                className="dots-top"
                                size={28}
                            />
                        </div>
                    ) : (
                        <PlateSkeleton />
                    )}
                </div>
            </div>

            <Routes>
                <Route path="/song-manager/" element={<SongManager />} />
                <Route path="/song-manager/add-song" element={<AddSong />} />
                <Route
                    path="/song-manager/edit-song/:songId"
                    element={<AddSong editMode />}
                />
            </Routes>
        </div>
    );
};

const PlateSkeleton = () => {
    return (
        <div className="dashboard_plate">
            <Skeleton
                variant="circular"
                width={50}
                height={50}
                animation="wave"
            />
            <div className="w-2/4">
                <Skeleton animation="wave" width="50%" height="20px" />
                <Skeleton animation="wave" height="25px" />
            </div>
        </div>
    );
};

export default Dashboard;
