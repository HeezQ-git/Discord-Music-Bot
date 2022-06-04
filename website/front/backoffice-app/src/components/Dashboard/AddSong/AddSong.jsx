import {
    Autocomplete,
    Container,
    Stepper,
    Step,
    StepLabel,
    Button,
    IconButton,
    Tooltip,
    Rating,
    Checkbox,
    FormControlLabel,
    Dialog,
    DialogTitle,
    DialogActions,
    DialogContent,
    ToggleButtonGroup,
    ToggleButton,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import React, { useState } from "react";
import { useEffect } from "react";
import { songsService } from "../../../services/songs.service";
import {
    alphabeticalOrder,
    formatTime,
    unformatTime,
} from "../../../utils/functions";
import {
    versions,
    games,
    dancemodes,
    difficulties,
    efforts,
    times,
    genres,
    tags,
    brokenLevelLabels,
} from "../../../utils/enums";
import { useNavigate, useParams } from "react-router";
import Input from "../../Input";
import "./AddSong.scss";
import {
    MdCheckCircleOutline,
    MdDone,
    MdHighlightOff,
    MdLink,
    MdOutlineAccessTime,
    MdOutlineArticle,
    MdOutlineErrorOutline,
    MdSave,
    MdUploadFile,
} from "react-icons/md";
import ReactImageBase64 from "react-image-base64";
import { Store } from "react-notifications-component";

const AddSong = ({ editMode }) => {
    //? STEP 1
    const [songName, setSongName] = useState("");
    const [allArtists, setAllArtists] = useState([]);
    const [artist, setArtist] = useState([]);

    //? STEP 2
    const [version, setVersion] = useState("");
    const [game, setGame] = useState("");
    const [dancemode, setDancemode] = useState("");
    const [difficulty, setDifficulty] = useState("");
    const [effort, setEffort] = useState("");
    const [time, setTime] = useState("");

    //? STEP 3
    const [genre, setGenre] = useState([]);
    const [tag, setTag] = useState([]);
    const [songCover, setSongCover] = useState("");
    const [images, setImages] = useState();
    const [open, setOpen] = useState(false);
    const [type, setType] = useState("file");

    const handleClose = () => {
        setImages();
        setError();
        setOpen(false);
    };

    const fixFileSize = (size) => {
        if (size < 1000000)
            return `${(images?.ofileSize / 1000).toFixed(1)} kB`;
        else return `${(images?.ofileSize / 1000000).toFixed(2)} MB`;
    };

    const throwError = (data) => {
        if (data.messages[0].toLowerCase().includes("mb"))
            setError([
                "image",
                "File size of the image file exceeds the maximum value (4 MB).",
            ]);
    };

    const saveImage = () => {
        if (!!images) {
            setSongCover(images.ofileData);
            setOpen(false);
            setImages();
        } else setError(["image", "Please select an image"]);
    };

    //? STEP 4
    const [duration, setDuration] = useState("");
    const [brokenLevel, setBrokenLevel] = useState(-1);
    const [hover, setHover] = useState(-1);
    const [released, setReleased] = useState(true);
    const [excluded, setExcluded] = useState(false);

    //? SUMMARY
    const [summary, setSummary] = useState(false);
    const [summaryLoading, setSummaryLoading] = useState(false);

    const [error, setError] = useState([]);
    const navigate = useNavigate();

    //? STEPS SECTION
    const steps = ["Basic info", "Fill-in", "Genre & Images", "Finish off"];
    const [activeStep, setActiveStep] = useState(0);

    //? OTHER
    const { songId } = useParams();

    const handleNext = () => {
        if (activeStep + 1 < steps.length) {
            switch (activeStep) {
                case 0:
                    if (!songName)
                        return setError(["songName", "", activeStep]);
                    else if (!artist || artist.length == 0)
                        return setError(["artist", "", activeStep]);
                    else setError([]);
                    break;
                case 1:
                    if (!version) return setError(["version", "", activeStep]);
                    else if (!game) return setError(["game", "", activeStep]);
                    else if (!dancemode)
                        return setError(["dancemode", "", activeStep]);
                    else if (!difficulty)
                        return setError(["difficulty", "", activeStep]);
                    else if (!effort)
                        return setError(["effort", "", activeStep]);
                    break;
                case 2:
                    if (!songCover)
                        return setError(["songCover", "", activeStep]);
                    else if (songCover && error?.[0] == "songCoverLink")
                        return setError([...error, activeStep]);
                    break;
            }
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        } else if (brokenLevel == -1 || !brokenLevel)
            return setError(["brokenLevel", "", activeStep]);
        else setSummary(true);
    };

    const handleBack = () =>
        setActiveStep((prevActiveStep) => prevActiveStep - 1);

    //* OTHER SECTION
    const getSongs = async () => {
        const response = await songsService.getSongs();

        if (!response.data.success) return;

        const _ = [];
        response.data.songs.map((song) =>
            song.artist.map(
                (artist) => !_.includes(artist.trim()) && _.push(artist.trim())
            )
        );
        setAllArtists(alphabeticalOrder(_));
    };

    const findValue = (id, array) =>
        array.find((item) => item.id == id) || undefined;

    const submitSong = async () => {
        setSummaryLoading(true);

        const data = {
            songName,
            artist,
            version: version.id,
            game,
            dancemode: dancemode.id,
            difficulty: difficulty.id,
            effort: effort.id,
            time,
            genre: genre.map((_) => _.id),
            tag: tag.map((_) => _.id),
            type,
            songCover,
            brokenLevel,
            duration: !duration.includes(":") ? formatTime(duration) : duration,
            released,
            excluded,
        };

        let response;

        if (editMode)
            response = await songsService.editSong({ songId, ...data });
        else response = await songsService.addSong(data);

        if (response.data.success) {
            Store.addNotification({
                title: "Success!",
                message: `Song ${editMode ? "edited" : "added"} successfully!`,
                type: "success",
                showIcon: true,
                insert: "top",
                container: "top-right",
                animationIn: ["animated", "fadeIn"],
                animationOut: ["animated", "fadeOut"],
                dismiss: {
                    duration: 5000,
                    onScreen: true,
                },
            });

            navigate(-1);
        }

        setSummaryLoading(false);
    };

    const filloutForm = async () => {
        const res = await songsService.filloutData();
        console.log(res);
    };

    useEffect(() => {
        getSongs();

        (async () => {
            if (!editMode) return;

            {
                const { ...song } = (await songsService.getSong({ songId }))
                    .data.song;

                console.log(song);

                if (!song) return;
                else {
                    setSongName(song.name);
                    setArtist(song.artist);
                    setVersion(findValue(song.version, versions));
                    setGame(song.game);
                    setDancemode(findValue(song.dancemode, dancemodes));
                    setDifficulty(findValue(song.difficulty, difficulties));
                    setEffort(findValue(song.effort, efforts));
                    setTime(song.times);
                    setGenre(song.genre.map((_) => findValue(_, genres)));
                    setTag(song.tags.map((_) => findValue(_, tags)));
                    setSongCover(song.cover);
                    setDuration(song.duration);
                    setBrokenLevel(song.xboxbrokenlevel);
                    setReleased(song.released);
                    setExcluded(song.excluded);
                }
            }
        })();
    }, []);

    useEffect(() => {
        if (type == "file") return;

        if (!songCover.includes("https://static.wikia.nocookie.net"))
            setError(["songCoverLink", "Invalid link provided"]);
        else setError([]);

        if (songCover.includes("/revision/"))
            setSongCover(songCover.split("/revision/")[0]);
    }, [songCover]);

    return (
        <Container className="songmanager_addsong_main" maxWidth="sm">
            <div className="songmanager_addsong_container drop-shadow-xl">
                {!summary && activeStep == 0 && (
                    <Tooltip title="Fillout form">
                        <IconButton
                            className="absolute opacity-80"
                            onClick={() => filloutForm()}
                        >
                            <MdOutlineArticle />{" "}
                        </IconButton>
                    </Tooltip>
                )}
                <div className="flex items-center justify-center gap-[15px]">
                    <h2 className="text-lg text-center font-semibold">
                        {!summary ? "Add a new song" : "Summary"}
                    </h2>
                    <a
                        target="_blank"
                        href={
                            songName
                                ? `https://justdance.fandom.com/wiki/${songName.replace(
                                      /\s/g,
                                      "_"
                                  )}`
                                : null
                        }
                    >
                        <Tooltip title="Open fandom">
                            <span>
                                <IconButton disabled={!songName}>
                                    <MdLink />
                                </IconButton>
                            </span>
                        </Tooltip>
                    </a>
                </div>
                {!summary ? (
                    <div>
                        <Stepper activeStep={activeStep} className="mt-[10px]">
                            {steps.map((label, index) => {
                                const stepProps = {};
                                const labelProps = {};
                                if (error?.[2] === index) {
                                    labelProps.optional = (
                                        <div className="text-red-500">
                                            Incomplete step
                                        </div>
                                    );
                                    labelProps.error = true;
                                }
                                return (
                                    <Step key={label} {...stepProps}>
                                        <StepLabel {...labelProps}>
                                            {label}
                                        </StepLabel>
                                    </Step>
                                );
                            })}
                        </Stepper>
                        <div className="flex w-full">
                            {activeStep === 0 && (
                                <div className="inputs w-full flex flex-col gap-[20px]">
                                    <div className="w-full flex items-center justify-between gap-[10px]">
                                        <Input
                                            label="🎵 Song name"
                                            placeholder="🎵 Song name"
                                            error={error?.[0] == "songName"}
                                            value={songName}
                                            onChange={(e) => {
                                                setSongName(e.target.value);
                                                setError([]);
                                            }}
                                            className={!!songName ? "done" : ""}
                                            fullWidth
                                            required
                                        />
                                    </div>
                                    <Autocomplete
                                        disablePortal
                                        freeSolo
                                        multiple
                                        autoComplete
                                        value={artist}
                                        options={allArtists}
                                        onChange={(e, newValue) => {
                                            setArtist(newValue);
                                            setError([]);
                                        }}
                                        className={
                                            artist.length > 0 ? "done" : ""
                                        }
                                        renderInput={(params) => (
                                            <Input
                                                {...params}
                                                error={error?.[0] == "artist"}
                                                required
                                                fullWidth
                                                label="🎤 Artist"
                                            />
                                        )}
                                    />
                                </div>
                            )}
                            {activeStep === 1 && (
                                <div className="inputs w-full flex flex-col gap-[20px]">
                                    <div className="flex flex-col gap-[15px]">
                                        <div className="flex gap-[15px]">
                                            <div className="w-2/3">
                                                <Autocomplete
                                                    disablePortal
                                                    autoHighlight
                                                    isOptionEqualToValue={(
                                                        option,
                                                        value
                                                    ) => option.id === value.id}
                                                    className={
                                                        !!version ? "done" : ""
                                                    }
                                                    value={version}
                                                    options={versions}
                                                    onChange={(e, newValue) => {
                                                        setVersion(newValue);
                                                        setError([]);
                                                    }}
                                                    renderInput={(params) => (
                                                        <Input
                                                            {...params}
                                                            error={
                                                                error?.[0] ==
                                                                "version"
                                                            }
                                                            required
                                                            fullWidth
                                                            label="✨ Version"
                                                        />
                                                    )}
                                                />
                                            </div>
                                            <div className="w-2/3">
                                                <Autocomplete
                                                    disablePortal
                                                    isOptionEqualToValue={(
                                                        option,
                                                        value
                                                    ) => option.id === value.id}
                                                    className={
                                                        !!game ? "done" : ""
                                                    }
                                                    value={game}
                                                    options={games}
                                                    onChange={(e, newValue) => {
                                                        setGame(newValue);
                                                        setError([]);
                                                    }}
                                                    renderInput={(params) => (
                                                        <Input
                                                            {...params}
                                                            error={
                                                                error?.[0] ==
                                                                "game"
                                                            }
                                                            required
                                                            fullWidth
                                                            label="🎮 Game"
                                                        />
                                                    )}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex gap-[15px]">
                                            <div className="w-2/3">
                                                <Autocomplete
                                                    disablePortal
                                                    isOptionEqualToValue={(
                                                        option,
                                                        value
                                                    ) => option.id === value.id}
                                                    className={
                                                        !!dancemode
                                                            ? "done"
                                                            : ""
                                                    }
                                                    value={dancemode}
                                                    options={dancemodes}
                                                    onChange={(e, newValue) => {
                                                        setDancemode(newValue);
                                                        setError([]);
                                                    }}
                                                    renderInput={(params) => (
                                                        <Input
                                                            {...params}
                                                            error={
                                                                error?.[0] ==
                                                                "dancemode"
                                                            }
                                                            required
                                                            fullWidth
                                                            label="💃 Dance mode"
                                                        />
                                                    )}
                                                />
                                            </div>
                                            <div className="w-2/3">
                                                <Autocomplete
                                                    disablePortal
                                                    isOptionEqualToValue={(
                                                        option,
                                                        value
                                                    ) => option.id === value.id}
                                                    className={
                                                        !!difficulty
                                                            ? "done"
                                                            : ""
                                                    }
                                                    value={difficulty}
                                                    options={difficulties}
                                                    onChange={(e, newValue) => {
                                                        setDifficulty(newValue);
                                                        setError([]);
                                                    }}
                                                    renderInput={(params) => (
                                                        <Input
                                                            {...params}
                                                            error={
                                                                error?.[0] ==
                                                                "difficulty"
                                                            }
                                                            required
                                                            fullWidth
                                                            label="🕺 Difficulty"
                                                        />
                                                    )}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex gap-[15px]">
                                            <div className="w-2/3">
                                                <Autocomplete
                                                    disablePortal
                                                    isOptionEqualToValue={(
                                                        option,
                                                        value
                                                    ) => option.id === value.id}
                                                    className={
                                                        !!effort ? "done" : ""
                                                    }
                                                    value={effort}
                                                    options={efforts}
                                                    onChange={(e, newValue) => {
                                                        setEffort(newValue);
                                                        setError([]);
                                                    }}
                                                    renderInput={(params) => (
                                                        <Input
                                                            {...params}
                                                            error={
                                                                error?.[0] ==
                                                                "effort"
                                                            }
                                                            required
                                                            fullWidth
                                                            label="💦 Effort"
                                                        />
                                                    )}
                                                />
                                            </div>
                                            <div className="w-2/3">
                                                <Autocomplete
                                                    disablePortal
                                                    isOptionEqualToValue={(
                                                        option,
                                                        value
                                                    ) => option.id === value.id}
                                                    className={
                                                        !!time ? "done" : ""
                                                    }
                                                    value={time}
                                                    options={times}
                                                    onChange={(e, newValue) => {
                                                        setTime(newValue);
                                                        setError([]);
                                                    }}
                                                    renderInput={(params) => (
                                                        <Input
                                                            {...params}
                                                            fullWidth
                                                            label="📆 Times"
                                                        />
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {activeStep === 2 && (
                                <div className="inputs w-full flex flex-col gap-[20px]">
                                    <Autocomplete
                                        disablePortal
                                        multiple
                                        className={
                                            genre.length > 0 ? "done" : ""
                                        }
                                        value={genre}
                                        options={genres}
                                        onChange={(e, newValue) =>
                                            setGenre(newValue)
                                        }
                                        renderInput={(params) => (
                                            <Input
                                                {...params}
                                                fullWidth
                                                label="🎹 Genre"
                                            />
                                        )}
                                    />
                                    <Autocomplete
                                        disablePortal
                                        multiple
                                        className={tag.length > 0 ? "done" : ""}
                                        value={tag}
                                        options={tags}
                                        getOptionLabel={(_) =>
                                            `${_.emoji} ${_.label}`
                                        }
                                        onChange={(e, newValue) =>
                                            setTag(newValue)
                                        }
                                        renderInput={(params) => (
                                            <Input
                                                {...params}
                                                fullWidth
                                                label="🎉 Tags"
                                            />
                                        )}
                                    />
                                    <div className="flex gap-[15px] items-center">
                                        <div className="song_cover bg-neutral-700 drop-shadow-lg hover:drop-shadow-xl">
                                            {songCover && (
                                                <img
                                                    className="image"
                                                    src={songCover}
                                                />
                                            )}
                                        </div>
                                        <div className="w-full flex flex-col gap-[10px]">
                                            <ToggleButtonGroup
                                                exclusive
                                                value={type}
                                                onChange={(e, newValue) => {
                                                    if (!newValue) return;
                                                    setType(newValue);
                                                    setSongCover("");
                                                }}
                                            >
                                                <ToggleButton value="file">
                                                    <MdUploadFile size={20} />
                                                </ToggleButton>

                                                <ToggleButton value="link">
                                                    <MdLink size={20} />
                                                </ToggleButton>
                                            </ToggleButtonGroup>
                                            {type == "link" && (
                                                <div className="w-full">
                                                    <Input
                                                        label="🎨 Song cover"
                                                        placeholder="https://static.wikia.nocookie.net/..."
                                                        error={
                                                            (songCover &&
                                                            error?.[0] ==
                                                                "songCoverLink"
                                                                ? true
                                                                : false) ||
                                                            error?.[0] ==
                                                                "songCover"
                                                        }
                                                        value={songCover}
                                                        onChange={(e) => {
                                                            setSongCover(
                                                                e.target.value
                                                            );
                                                            setError([]);
                                                        }}
                                                        className={
                                                            !!songCover &&
                                                            !error?.[0]
                                                                ? "done"
                                                                : ""
                                                        }
                                                        size="small"
                                                        fullWidth
                                                        required
                                                    />
                                                    {songCover &&
                                                        error?.[0] ==
                                                            "songCoverLink" && (
                                                            <div className="flex items-center text-red-500 gap-[5px] mt-[4px]">
                                                                <MdOutlineErrorOutline />{" "}
                                                                <span>
                                                                    {error?.[1]}
                                                                </span>
                                                            </div>
                                                        )}
                                                </div>
                                            )}
                                            {type == "file" && (
                                                <div className="flex items-center gap-[15px]">
                                                    <Button
                                                        onClick={() =>
                                                            setOpen(true)
                                                        }
                                                        startIcon={
                                                            <MdUploadFile />
                                                        }
                                                        variant="outlined"
                                                    >
                                                        Upload file
                                                    </Button>
                                                    {error?.[0] ==
                                                        "songCover" && (
                                                        <span className="text-red-500">
                                                            You have to upload
                                                            an image
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <Dialog open={open} onClose={handleClose}>
                                        <div className="image_select_file">
                                            <DialogTitle>
                                                Select cover image
                                            </DialogTitle>
                                            <DialogContent>
                                                <div className="file_input">
                                                    <label
                                                        htmlFor="js-image-base64"
                                                        className="drop_area"
                                                    >
                                                        <ReactImageBase64
                                                            maxFileSize={
                                                                4000000
                                                            }
                                                            thumbnail_size={100}
                                                            drop={true}
                                                            dropText={
                                                                <span className="drop_text">
                                                                    <span className="text">
                                                                        <MdUploadFile
                                                                            size={
                                                                                30
                                                                            }
                                                                        />

                                                                        <span className="title">
                                                                            Select
                                                                            image
                                                                            or
                                                                            drop
                                                                            it
                                                                            here
                                                                        </span>
                                                                    </span>
                                                                    <span className="info">
                                                                        Max file
                                                                        size is
                                                                        4 MB
                                                                    </span>
                                                                </span>
                                                            }
                                                            capture="environment"
                                                            handleChange={(
                                                                data
                                                            ) => {
                                                                if (
                                                                    data.result
                                                                ) {
                                                                    setImages(
                                                                        data
                                                                    );
                                                                    setError(
                                                                        []
                                                                    );
                                                                } else
                                                                    throwError(
                                                                        data
                                                                    );
                                                            }}
                                                        />
                                                    </label>
                                                </div>
                                                {images?.ofileData && (
                                                    <div className="image_info">
                                                        <img
                                                            src={
                                                                images?.ofileData
                                                            }
                                                            className="image"
                                                            onDragStart={(e) =>
                                                                e.preventDefault()
                                                            }
                                                        />
                                                        <div className="text_container">
                                                            <div className="text_container_inside">
                                                                <p>
                                                                    {
                                                                        images?.fileName
                                                                    }
                                                                </p>
                                                                <p>
                                                                    {fixFileSize(
                                                                        images?.ofileSize
                                                                    )}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                                {error?.[0] == "image" && (
                                                    <span className="error">
                                                        <MdOutlineErrorOutline
                                                            size={22}
                                                        />
                                                        {error[1]}
                                                    </span>
                                                )}
                                            </DialogContent>
                                            <DialogActions>
                                                <Button onClick={handleClose}>
                                                    Cancel
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    onClick={saveImage}
                                                    startIcon={<MdSave />}
                                                >
                                                    Save
                                                </Button>
                                            </DialogActions>
                                        </div>
                                    </Dialog>
                                </div>
                            )}
                            {activeStep === 3 && (
                                <div className="inputs w-full flex flex-col gap-[20px]">
                                    <div className="w-full flex flex-wrap items-center gap-[10px]">
                                        <Input
                                            label="🕑 Duration"
                                            placeholder="0:00 or 000 (seconds)"
                                            size="small"
                                            value={duration}
                                            onChange={(e) => {
                                                if (
                                                    !e.target.value ||
                                                    e.target.value
                                                        .match(/(\d|:)/g)
                                                        .join("") ==
                                                        e.target.value
                                                )
                                                    setDuration(e.target.value);
                                            }}
                                        />
                                        {duration && (
                                            <span className="select-none opacity-60">
                                                given in{" "}
                                                {duration &&
                                                duration.includes(":")
                                                    ? `time (${unformatTime(
                                                          duration
                                                      )} seconds)`
                                                    : `seconds (${formatTime(
                                                          duration
                                                      )} time)`}
                                            </span>
                                        )}
                                    </div>
                                    <label className="flex flex-col gap-[4px]">
                                        <span
                                            className={`opacity-60 ${
                                                error?.[0] == "brokenLevel" &&
                                                "text-red-500"
                                            }`}
                                        >
                                            Select broken level
                                        </span>
                                        <div className="flex flex-wrap items-center gap-[15px]">
                                            <Rating
                                                value={brokenLevel}
                                                onChange={(e, newValue) => {
                                                    setBrokenLevel(newValue);
                                                    setError([]);
                                                }}
                                                onChangeActive={(
                                                    event,
                                                    newHover
                                                ) => {
                                                    setHover(newHover);
                                                }}
                                                getLabelText={() =>
                                                    brokenLevelLabels[
                                                        brokenLevel
                                                    ]
                                                }
                                                max={10}
                                            />
                                            <span>
                                                {
                                                    brokenLevelLabels[
                                                        hover != -1
                                                            ? hover
                                                            : brokenLevel
                                                    ]
                                                }
                                            </span>
                                        </div>
                                    </label>
                                    <div className="checkboxes flex flex-col gap-[5px]">
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={released}
                                                    onChange={(e, newValue) =>
                                                        setReleased(newValue)
                                                    }
                                                />
                                            }
                                            label="Released"
                                        />
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={excluded}
                                                    onChange={(e, newValue) =>
                                                        setExcluded(newValue)
                                                    }
                                                />
                                            }
                                            label="Excluded from WDF"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="w-full flex justify-between mt-[15px]">
                            <Button
                                onClick={() =>
                                    activeStep === 0
                                        ? navigate("/dashboard/song-manager")
                                        : handleBack()
                                }
                                sx={{ mr: 1 }}
                            >
                                {activeStep === 0 ? "Cancel" : "Back"}
                            </Button>
                            <Button onClick={() => handleNext()}>
                                {activeStep === steps.length - 1
                                    ? "Finish"
                                    : "Next"}
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="summary w-full flex flex-col">
                        <span className="text-center opacity-60">
                            Please confirm that this data is correct
                        </span>
                        <div className="summary_panel w-full drop-shadow-md">
                            <img
                                className="image drop-shadow-lg"
                                src={songCover}
                            />
                            <div className="items">
                                <div className="summary_container">
                                    <span>Title</span>
                                    <h2>{songName}</h2>
                                </div>
                                <div className="summary_container">
                                    <span>Version</span>
                                    <h2>{version.label}</h2>
                                </div>
                                <div className="summary_container">
                                    <span>Game</span>
                                    <h2>{game}</h2>
                                </div>
                                <div className="summary_container">
                                    <span>Dancemode</span>
                                    <h2>{dancemode.label}</h2>
                                </div>
                                <div className="summary_container">
                                    <span>Difficulty</span>
                                    <h2>{difficulty.label}</h2>
                                </div>
                                <div className="summary_container">
                                    <span>Effort</span>
                                    <h2>{effort.label}</h2>
                                </div>
                                <div className="summary_container">
                                    <span>Times</span>
                                    <h2>{time}</h2>
                                </div>
                                <div className="flex flex-col gap-[10px]">
                                    <div className="summary_list">
                                        <span>
                                            Artist{artist.length > 1 && "s"}
                                        </span>
                                        <div className="summary_items">
                                            {artist.map((art, index) => (
                                                <div
                                                    key={index}
                                                    className={`summary_item drop-shadow-sm bg-indigo-500/50 ${
                                                        !allArtists.includes(
                                                            art
                                                        ) && "new_mark"
                                                    }`}
                                                >
                                                    {art}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    {genre.length > 0 && (
                                        <div className="summary_list">
                                            <span>
                                                Genre{genre.length > 1 && "s"}
                                            </span>
                                            <div className="summary_items">
                                                {genre.map((gen, index) => (
                                                    <div
                                                        key={index}
                                                        className="summary_item drop-shadow-sm bg-emerald-400/50"
                                                    >
                                                        {gen.label}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {tag.length > 0 && (
                                        <div className="summary_list">
                                            <span>
                                                Tag{tag.length > 1 && "s"}
                                            </span>
                                            <div className="summary_items">
                                                {tag.map((_tag, index) => (
                                                    <div
                                                        key={index}
                                                        className="summary_item drop-shadow-sm bg-sky-400/50"
                                                    >
                                                        {_tag.emoji}{" "}
                                                        {_tag.label}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    <div className="summary_container">
                                        <div className="flex items-center gap-[5px]">
                                            <MdOutlineAccessTime size={20} />
                                            <span>Duration: {duration}</span>
                                        </div>
                                    </div>
                                    <div className="summary_container">
                                        <span>
                                            {brokenLevelLabels[brokenLevel]}
                                        </span>
                                        <Rating
                                            value={brokenLevel}
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
                                                {released ? (
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
                                                {released
                                                    ? "Released"
                                                    : "Not released"}
                                            </div>
                                        </div>
                                        <div className="summary_container">
                                            <div className="flex items-center gap-[5px] font-semibold">
                                                {excluded ? (
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
                                                {excluded
                                                    ? "Excluded from WDF"
                                                    : "Not excluded from WDF"}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="w-full flex justify-between">
                            <Button
                                onClick={() => {
                                    setSummary(false);
                                }}
                            >
                                Back
                            </Button>
                            <LoadingButton
                                onClick={() => submitSong()}
                                variant="contained"
                                startIcon={<MdDone />}
                            >
                                Confirm
                            </LoadingButton>
                        </div>
                    </div>
                )}
            </div>
        </Container>
    );
};

export default AddSong;
