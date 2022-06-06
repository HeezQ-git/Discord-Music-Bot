import React, { useState, useEffect } from 'react';
import './SongManager.scss';
import { songsService } from '../../../services/songs.service';
import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    IconButton,
    Pagination,
    Tooltip,
} from '@mui/material';
import {
    MdClose,
    MdDelete,
    MdDone,
    MdEdit,
    MdErrorOutline,
    MdOutlineAdd,
    MdOutlineDelete,
    MdOutlineFilterList,
    MdRefresh,
} from 'react-icons/md';
import { FaRegEdit } from 'react-icons/fa';
import { FcSearch } from 'react-icons/fc';
import Input from '../../Input';
import { paginate, getPage } from '../../../utils/pagination';
import { delay, newNotification } from '../../../utils/functions';
import { useNavigate } from 'react-router';
import { Store } from 'react-notifications-component';
import SongInfo from './../SongInfo/SongInfo';

const SongManager = () => {
    const [allSongs, setAllSongs] = useState();
    const [songsDisplay, setSongsDisplay] = useState();
    const [paginated, setPaginated] = useState();
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [loadingChanges, setLoadingChanges] = useState(false);
    const [classes, setClasses] = useState(true);
    const [confirmDelete, setConfirmDelete] = useState();
    const [songInfo, setSongInfo] = useState();

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
                song.artist.join(' ').toLowerCase().includes(val)
        );

        if (foundSongs) {
            const _ = paginate(foundSongs, amountPerPage);
            setPaginated(_);
            setSongsDisplay(getPage(_, 1));
        }
    };

    const checkForErrors = async () => {
        const result = await songsService.getSongs();
        const allSongs = result.data.songs;

        setLoadingChanges({ step: 1, count: 0, max: allSongs.length });

        const songs = [];

        for await (const song of allSongs) {
            song.errorCount = await checkForError(song);
            songs.push(song);
            setLoadingChanges({
                step: 1,
                count: songs.length,
                max: allSongs.length,
            });
        }

        setLoadingChanges({ step: 2 });

        try {
            const res = await songsService.updateSongs({ songs });

            if (res.data.success) {
                setLoadingChanges({
                    step: 3,
                    succeed: res.data.succeed,
                    max: allSongs.length,
                });
                newNotification(
                    'success',
                    'Success',
                    'All songs have been checked'
                );
            } else {
                setLoadingChanges({
                    step: 3,
                    succeed: -1,
                });
                newNotification(
                    'danger',
                    'Error!',
                    'Something went wrong while checking songs'
                );
            }
        } catch (e) {}
    };

    const checkForError = async (song) => {
        let error = 0;

        [
            !song.artist.length,
            !song.cover,
            !song.dancemode,
            !song.duration,
            !song.effort,
            !song.game,
            !song.name,
            !song.version,
            !song.xboxbrokenlevel,
        ].forEach((_) => _ && error++);

        (song?.type == 'link' || !song.type) &&
            !(await fetch(song.cover)).ok &&
            error++;

        return error;
    };

    const handleDeleteSong = async (songId) => {
        const result = await songsService.deleteSong({ songId });

        if (result.data.success) {
            getSongs();
            Store.addNotification({
                title: 'Success!',
                message: 'Song deleted successfully!',
                type: 'success',
                insert: 'top',
                container: 'top-right',
                animationIn: ['animated', 'fadeIn'],
                animationOut: ['animated', 'fadeOut'],
                dismiss: {
                    duration: 5000,
                    onScreen: true,
                    showIcon: true,
                    pauseOnHover: true,
                },
            });
        }
    };

    const openFilters = () => {};

    useEffect(() => {
        getSongs();
    }, []);

    return (
        <div className="songmanager_main">
            <div className="songmanager_container drop-shadow-xl">
                <h2 className="text-xl opacity-90 text-center">Song Manager</h2>
                <Divider className="my-[15px]" />
                <div className="head flex items-center gap-[10px] mb-6">
                    <Input
                        size="small"
                        label="🔎 Search..."
                        className="opacity-70"
                        onChange={(e) => searchSong(e.target.value)}
                    />
                    <div className="flex items-center">
                        <Tooltip title="Reload">
                            <IconButton
                                onClick={() =>
                                    !loading && !loadingChanges && getSongs()
                                }
                            >
                                <MdRefresh />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Check for errors">
                            <IconButton
                                onClick={() =>
                                    !loading &&
                                    !loadingChanges &&
                                    checkForErrors()
                                }
                            >
                                <MdErrorOutline />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Filter">
                            <IconButton onClick={() => openFilters()}>
                                <MdOutlineFilterList />
                            </IconButton>
                        </Tooltip>
                    </div>
                </div>
                {!loading && loadingChanges && (
                    <Dialog open={!!loadingChanges}>
                        <DialogContent>
                            <div className="flex items-center gap-[25px] mt-[15px]">
                                {loadingChanges?.step != 3 && (
                                    <CircularProgress />
                                )}
                                {loadingChanges?.step == 3 ? (
                                    loadingChanges?.succeed != -1 ? (
                                        <MdDone size={35} color="green" />
                                    ) : (
                                        <MdClose size={35} color="red" />
                                    )
                                ) : null}
                                {loadingChanges?.step == 1 && (
                                    <span className="text-lg">
                                        Making changes [{loadingChanges?.count}/
                                        {loadingChanges?.max}]
                                    </span>
                                )}
                                {loadingChanges?.step == 2 && (
                                    <span className="text-lg">
                                        Uploading changes, it might take up to 2
                                        minutes.
                                    </span>
                                )}
                                {loadingChanges?.step == 3 &&
                                    loadingChanges?.succeed > 0 && (
                                        <span className="text-lg">
                                            Changes updated! Updated{' '}
                                            {loadingChanges?.succeed} out of{' '}
                                            {loadingChanges?.max} songs
                                        </span>
                                    )}
                                {loadingChanges?.step == 3 &&
                                    loadingChanges?.succeed == -1 && (
                                        <span className="text-lg">
                                            Failed to update songs, please try
                                            again
                                        </span>
                                    )}
                            </div>
                        </DialogContent>
                        <DialogActions>
                            {loadingChanges?.step === 3 ? (
                                <Button
                                    onClick={() => setLoadingChanges(false)}
                                >
                                    Close
                                </Button>
                            ) : (
                                <Button
                                    disabled={loadingChanges?.step != 1}
                                    onClick={() =>
                                        window.location.reload(false)
                                    }
                                >
                                    Cancel
                                </Button>
                            )}
                        </DialogActions>
                    </Dialog>
                )}
                <Dialog
                    open={!!confirmDelete}
                    onClose={() => setConfirmDelete()}
                >
                    <DialogTitle>Confirm the action</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to delete this song?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setConfirmDelete()}>
                            Cancel
                        </Button>
                        <Button
                            onClick={() => {
                                handleDeleteSong(confirmDelete);
                                setConfirmDelete();
                            }}
                            startIcon={<MdDelete />}
                            variant="contained"
                            autoFocus
                        >
                            Confirm
                        </Button>
                    </DialogActions>
                </Dialog>
                <Dialog open={!!songInfo} onClose={() => setSongInfo(false)}>
                    <DialogContent>
                        <div className="p-7 bg-slate-200 dark:bg-zinc-800 rounded-md">
                            {songInfo && <SongInfo song={songInfo} />}
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() =>
                                navigate(`edit-song/${songInfo._id}`)
                            }
                            startIcon={<MdEdit />}
                            variant="outlined"
                        >
                            Edit
                        </Button>
                    </DialogActions>
                </Dialog>
                {loading && !loadingChanges && (
                    <div className="flex items-center gap-[25px] mt-[15px]">
                        <CircularProgress />{' '}
                        <span className="text-lg">Loading songs...</span>
                    </div>
                )}
                {songsDisplay &&
                    !loadingChanges &&
                    songsDisplay.map((song, index) => {
                        return (
                            <div
                                key={index}
                                className={`song_outer hover:drop-shadow-md ${
                                    classes ? 'animate' : ''
                                }`}
                                style={{ animationDelay: `0.${index}s` }}
                            >
                                {song?.errorCount > 0 && (
                                    <div className="badge_error">
                                        {song.errorCount}
                                    </div>
                                )}
                                <div
                                    className={`song ${
                                        song?.errorCount > 0 ? 'song_error' : ''
                                    }`}
                                >
                                    <div
                                        className="items_left cursor-pointer"
                                        onClick={() => setSongInfo(song)}
                                    >
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
                                                {song.artist.join(' & ')}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="items_right">
                                        <Tooltip title="Edit">
                                            <IconButton
                                                onClick={() =>
                                                    navigate(
                                                        `edit-song/${song._id}`
                                                    )
                                                }
                                            >
                                                <FaRegEdit />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete">
                                            <IconButton
                                                onClick={() =>
                                                    setConfirmDelete(song)
                                                }
                                            >
                                                <MdOutlineDelete />
                                            </IconButton>
                                        </Tooltip>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                {paginated && songsDisplay && !loadingChanges && (
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
                {!songsDisplay && !loading && !loadingChanges && (
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
                            !loading &&
                            !loadingChanges &&
                            navigate('/dashboard/song-manager/add-song')
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
