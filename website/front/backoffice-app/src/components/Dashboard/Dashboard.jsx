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

const Dashboard = () => {
    const [tiles, setTiles] = useState([]);

    useEffect(() => {
        (async () => {
            const result = await songsService.getSongs();

            setTiles([
                {
                    label: "Total Users",
                    count: 23,
                    color: "indigo",
                    icon: <FaUser size={25} />,
                },
                {
                    label: "Total Songs",
                    count: result.data.songs.length,
                    color: "fuchsia",
                    icon: <MdMusicNote size={25} />,
                },
                {
                    label: "Actions",
                    count: 293,
                    color: "emerald",
                    icon: <HiCursorClick size={25} />,
                    stronger: true,
                },
                {
                    label: "Reports",
                    count: 46,
                    color: "red",
                    icon: <MdOutlineWarningAmber size={25} />,
                    dots: true,
                    stronger: true,
                },
            ]);
        })();
    }, []);

    return (
        <div className="dashboard_main">
            <CheckSession />
            <div className="dashboard_top-feed">
                {tiles.map(
                    ({ label, count, color, icon, dots, stronger }, index) => {
                        return (
                            <div
                                key={index}
                                className="dashboard_plate drop-shadow-xl"
                                style={{ animationDelay: `0.${index}s` }}
                            >
                                <div
                                    className={`icon bg-${color}-300 text-${color}-${
                                        stronger ? "600" : "500"
                                    } opacity-80`}
                                >
                                    <div>{icon}</div>
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold">
                                        {count}
                                    </h2>
                                    <h2 className="text-md opacity-30">
                                        {label}
                                    </h2>
                                </div>
                                {dots && (
                                    <BiDotsHorizontalRounded
                                        className="dots-top"
                                        size={28}
                                    />
                                )}
                            </div>
                        );
                    }
                )}
            </div>

            <Routes>
                <Route path="/song-manager/" element={<SongManager />} />
                <Route path="/song-manager/add-song" element={<AddSong />} />
            </Routes>
        </div>
    );
};

export default Dashboard;
