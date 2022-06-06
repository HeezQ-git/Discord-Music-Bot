import {
    Autocomplete,
    Container,
    Stepper,
    Step,
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
    StepButton,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { songsService } from '../../../services/songs.service';
import {
    alphabeticalOrder,
    convertDataToSong,
    formatTime,
    newNotification,
    unformatTime,
} from '../../../utils/functions';
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
} from '../../../utils/enums';
import { useNavigate, useParams } from 'react-router';
import Input from '../../Input';
import './AddSong.scss';
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
} from 'react-icons/md';
import ReactImageBase64 from 'react-image-base64';
import SongInfo from '../SongInfo/SongInfo';

const AddSong = ({ editMode }) => {
    //? STEP 1
    const [allArtists, setAllArtists] = useState([]);

    //? STEP 3
    const [images, setImages] = useState();
    const [open, setOpen] = useState(false);

    //? STEP 4
    const [hover, setHover] = useState(-1);

    //? SUMMARY
    const [summary, setSummary] = useState(false);
    const [summaryLoading, setSummaryLoading] = useState(false);

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
        if (data.messages[0].toLowerCase().includes('mb'))
            setError([
                'image',
                'File size of the image file exceeds the maximum value (4 MB).',
            ]);
    };

    const saveImage = () => {
        if (!!images) {
            handleClick('songCover', images.ofileData);
            setOpen(false);
            setImages();
        } else setError(['image', 'Please select an image']);
    };

    const [error, setError] = useState([]);
    const navigate = useNavigate();

    //? STEPS SECTION
    const steps = ['Basic info', 'Fill-in', 'Genre & Images', 'Finish off'];
    const [activeStep, setActiveStep] = useState(0);

    //? OTHER
    const { songId } = useParams();

    const [data, setData] = useState({
        songName: '',
        artist: [],
        version: '',
        game: '',
        dancemode: '',
        difficulty: '',
        effort: '',
        time: '',
        genre: [],
        tag: [],
        type: 'file',
        songCover: '',
        brokenLevel: -1,
        duration: '',
        released: true,
        excluded: false,
    });

    // prettier-ignore
    const handleClick = (event, newValue) => {
        if (`${typeof newValue}` != "boolean" && !newValue) setData({ ...data, [event.target.name]: event.target.value });
        else setData({ ...data, [event]: newValue });

        setError([]);
    };

    const handleNext = () => {
        const { songCover, brokenLevel } = { ...data };

        // prettier-ignore
        if (activeStep + 1 < steps.length) {
            switch (activeStep) {
                case 0:
                    for (const key of ['songName', 'artist']) {
                        if (!data[key]) {
                            setError([key, 'This field is required', activeStep])
                            return newNotification('Warning!', `Please fill in ${key} field.`, 'danger');
                        };
                    }
                    break;
                case 1:
                    for (const key of ['version', 'game', 'dancemode', 'difficulty', 'effort']) {
                        if (!data[key]) if (!data[key]) {
                            setError([key, 'This field is required', activeStep])
                            return newNotification('Warning!', `Please fill in ${key} field.`, 'danger');
                        };
                    }
                    break;
                case 2:
                    if (!songCover) {
                        setError(['songCover', '', activeStep]);
                        return newNotification('Warning!', `Please fill in song cover field.`, 'danger')
                    } else if (songCover && error?.[0] == 'songCoverLink') {
                        setError([...error, activeStep]);
                        return newNotification('Warning!', `Please fill in song cover link field.`, 'danger');
                    }
                    break;
            }

            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        } else if (brokenLevel == -1 || !brokenLevel)
            return setError(['brokenLevel', '', activeStep]);
        else {
            for (const key in data) {
                if (!data[key] && !['released', 'excluded', 'time', 'genre', 'tag']?.includes(key)) {
                    return newNotification('Warning!', `Please fill in ${key} field.`, 'danger');
                };
            }
            setSummary(true);
        }
    };

    const handleBack = () =>
        setActiveStep((prevActiveStep) => prevActiveStep - 1);

    const handleStep = (step) => setActiveStep(step);

    //* OTHER SECTION
    const getSongs = async () => {
        const response = await songsService.getSongs();

        if (!response.data.success) return;

        const artistsList = [];

        response.data.songs.map((song) =>
            song.artist.map(
                (artist) =>
                    !artistsList.includes(artist.trim()) &&
                    artistsList.push(artist.trim())
            )
        );
        setAllArtists(alphabeticalOrder(artistsList));
    };

    const findValue = (id, array) =>
        array.find((item) => item.id == id) || undefined;

    const submitSong = async () => {
        setSummaryLoading(true);

        const _data = {
            ...data,
            version: data.version.id,
            dancemode: data.dancemode.id,
            difficulty: data.difficulty.id,
            effort: data.effort.id,
            genre: data.genre.map((_) => _.id),
            tag: data.tag.map((_) => _.id),
            duration: !data.duration.includes(':')
                ? formatTime(data.duration)
                : data.duration,
        };

        let response;

        if (editMode)
            response = await songsService.editSong({ songId, ..._data });
        else response = await songsService.addSong({ ..._data });

        if (response.data.success) {
            newNotification(
                'Success!',
                `Song ${editMode ? 'edited' : 'added'} successfully!`,
                'success'
            );
            navigate(-1);
        }

        setSummaryLoading(false);
    };

    const filloutForm = async () => {
        const res = await songsService.filloutData();
        console.log(res);
    };

    // prettier-ignore
    useEffect(() => {
        getSongs();
        
        let subscribed = true;

        (async () => {
            if (!editMode || !songId) return;

            const goBack = () => {
                navigate('/dashboard/song-manager');
                newNotification('Warning!', 'Invalid song ID!', 'danger');
            }

            if (songId.length < 24) return goBack();

            const response = await songsService.getSong({ songId });

            if (!subscribed) return;
            if (!response.data.success) return goBack();

            const { ...song } = response.data.song;
    
    
            setData({
                songCover: song.cover,
                songName: song.name,
                time: song.times,
                brokenLevel: song.xboxbrokenlevel,
                tag: song.tags?.map((tag) => findValue(tag, tags)),
                genre: song.genre?.map((genre) => findValue(genre, genres)),
                effort: findValue(song.effort, efforts),
                difficulty: findValue(song.difficulty, difficulties),
                dancemode: findValue(song.dancemode, dancemodes),
                version: findValue(song.version, versions),
                game: song.game,
                excluded: song.excluded,
                released: song.released,
                type: song.type,
                duration: song.duration,
                artist: song.artist,
            })

        })();

        return () => {
            subscribed = false;
        };
    }, [])

    useEffect(() => {
        if (data['type'] == 'file') return;

        if (!data['songCover']?.includes('https://static.wikia.nocookie.net'))
            setError(['songCoverLink', 'Invalid link provided']);
        else setError([]);

        if (data['songCover']?.includes('/revision/'))
            handleClick('songCover', data['songCover']?.split('/revision/')[0]);
    }, [data['songCover']]);

    return (
        <Container className="songmanager_addsong_main" maxWidth="sm">
            {!songId || data['songName'] ? (
                <div className="songmanager_addsong_container drop-shadow-xl">
                    {!summary && activeStep == 0 && (
                        <Tooltip title="Fillout form">
                            <IconButton
                                className="absolute opacity-80"
                                onClick={() => filloutForm()}
                            >
                                <MdOutlineArticle />{' '}
                            </IconButton>
                        </Tooltip>
                    )}
                    <div className="flex items-center justify-center gap-[15px]">
                        <h2 className="text-lg text-center font-semibold">
                            {!summary ? 'Add a new song' : 'Summary'}
                        </h2>
                        <a
                            target="_blank"
                            href={
                                data['songName']
                                    ? `https://justdance.fandom.com/wiki/${data[
                                          'songName'
                                      ].replace(/\s/g, '_')}`
                                    : null
                            }
                        >
                            <Tooltip title="Open fandom">
                                <span>
                                    <IconButton disabled={!data['songName']}>
                                        <MdLink />
                                    </IconButton>
                                </span>
                            </Tooltip>
                        </a>
                    </div>
                    {!summary ? (
                        <div>
                            <Stepper
                                nonLinear
                                activeStep={activeStep}
                                className="mt-[10px]"
                            >
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
                                            <StepButton
                                                {...labelProps}
                                                onClick={() =>
                                                    handleStep(index)
                                                }
                                            >
                                                {label}
                                            </StepButton>
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
                                                error={error?.[0] == 'songName'}
                                                value={data['songName']}
                                                name="songName"
                                                onChange={(event) =>
                                                    handleClick(event)
                                                }
                                                className={
                                                    !!data['songName']
                                                        ? 'done'
                                                        : ''
                                                }
                                                fullWidth
                                                required
                                            />
                                        </div>
                                        <Autocomplete
                                            disablePortal
                                            freeSolo
                                            multiple
                                            autoComplete
                                            value={data['artist']}
                                            options={allArtists}
                                            name="artist"
                                            onChange={(event, newValue) => {
                                                handleClick('artist', newValue);
                                            }}
                                            className={
                                                data['artist']?.length > 0
                                                    ? 'done'
                                                    : ''
                                            }
                                            renderInput={(params) => (
                                                <Input
                                                    {...params}
                                                    error={
                                                        error?.[0] == 'artist'
                                                    }
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
                                        {/* prettier-ignore */}
                                        <div className="flex flex-col gap-[15px]">
                                        <div className="flex gap-[15px]">
                                            <div className="w-2/3">
                                                <Autocomplete
                                                    disablePortal
                                                    autoHighlight
                                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                                    className={!!data['version'] ? 'done' : ''}
                                                    value={data['version']}
                                                    options={versions}
                                                    name="version"
                                                    onChange={(event, newValue) => handleClick('version', newValue)}
                                                    renderInput={(params) => (
                                                        <Input
                                                            {...params}
                                                            error={error?.[0] == 'version'}
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
                                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                                    className={!!data['game'] ? 'done' : ''}
                                                    value={data['game']}
                                                    options={games}
                                                    name="game"
                                                    onChange={(e, newValue) => handleClick('game', newValue)}
                                                    renderInput={(params) => (
                                                        <Input
                                                            {...params}
                                                            error={error?.[0] == 'game'}
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
                                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                                    className={!!data['dancemode'] ? 'done' : ''}
                                                    value={data['dancemode']}
                                                    options={dancemodes}
                                                    name="dancemode"
                                                    onChange={(e, newValue) => handleClick('dancemode', newValue)}
                                                    renderInput={(params) => (
                                                        <Input
                                                            {...params}
                                                            error={error?.[0] == 'dancemode'}
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
                                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                                    className={!!data['difficulty'] ? 'done' : ''}
                                                    value={data['difficulty']}
                                                    options={difficulties}
                                                    name="difficulty"
                                                    onChange={(e, newValue) => handleClick('difficulty', newValue)}
                                                    renderInput={(params) => (
                                                        <Input
                                                            {...params}
                                                            error={error?.[0] =='difficulty'}
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
                                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                                    className={!!data['effort'] ? 'done' : ''}
                                                    value={data['effort']}
                                                    options={efforts}
                                                    name="effort"
                                                    onChange={(e, newValue) => handleClick('effort', newValue)}
                                                    renderInput={(params) => (
                                                        <Input
                                                            {...params}
                                                            error={error?.[0] == 'effort'}
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
                                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                                    className={!!data['time'] ? 'done' : ''}
                                                    value={data['time']}
                                                    options={times}
                                                    name="time"
                                                    onChange={(e, newValue) => handleClick('time', newValue)}
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
                                                !!data['genre']?.length
                                                    ? 'done'
                                                    : ''
                                            }
                                            value={data['genre']}
                                            options={genres}
                                            name="genre"
                                            onChange={(e, newValue) =>
                                                handleClick('genre', newValue)
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
                                            className={
                                                !!data['tag']?.length
                                                    ? 'done'
                                                    : ''
                                            }
                                            value={data['tag']}
                                            options={tags}
                                            getOptionLabel={(_) =>
                                                `${_.emoji} ${_.label}`
                                            }
                                            name="tag"
                                            onChange={(e, newValue) =>
                                                handleClick('tag', newValue)
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
                                                {data['songCover'] && (
                                                    <img
                                                        className="image"
                                                        src={data['songCover']}
                                                    />
                                                )}
                                            </div>
                                            <div className="w-full flex flex-col gap-[10px]">
                                                {/* prettier-ignore */}
                                                <ToggleButtonGroup
                                                exclusive
                                                value={data['type']}
                                                onChange={(e, newValue) => {
                                                    if (!newValue) return;

                                                    handleClick('type', newValue);
                                                    handleClick('songCover', '');
                                                }}
                                            >
                                                <ToggleButton value="file">
                                                    <MdUploadFile size={20} />
                                                </ToggleButton>

                                                <ToggleButton value="link">
                                                    <MdLink size={20} />
                                                </ToggleButton>
                                            </ToggleButtonGroup>
                                                {data['type'] == 'link' && (
                                                    <div className="w-full">
                                                        {/* prettier-ignore */}
                                                        <Input
                                                        label="🎨 Song cover"
                                                        placeholder="https://static.wikia.nocookie.net/..."
                                                        error={
                                                            (data['songCover'] && error?.[0] == 'songCoverLink') || error?.[0] == 'songCover'
                                                        }
                                                        value={data['songCover']}
                                                        name="songCover"
                                                        onChange={(e) => handleClick(e)}
                                                        className={!!data['songCover'] && !error?.[0] ? 'done' : ''}
                                                        size="small"
                                                        fullWidth
                                                        required
                                                    />
                                                        {data['songCover'] &&
                                                            error?.[0] ==
                                                                'songCoverLink' && (
                                                                <div className="flex items-center text-red-500 gap-[5px] mt-[4px]">
                                                                    <MdOutlineErrorOutline />{' '}
                                                                    <span>
                                                                        {
                                                                            error?.[1]
                                                                        }
                                                                    </span>
                                                                </div>
                                                            )}
                                                    </div>
                                                )}
                                                {data['type'] == 'file' && (
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
                                                            'songCover' && (
                                                            <span className="text-red-500">
                                                                You have to
                                                                upload an image
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <Dialog
                                            open={open}
                                            onClose={handleClose}
                                        >
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
                                                            {/* prettier-ignore */}
                                                            <ReactImageBase64
                                                            maxFileSize={1000000}
                                                            thumbnail_size={100}
                                                            drop={true}
                                                            dropText={
                                                                <span className="drop_text">
                                                                    <span className="text">
                                                                        <MdUploadFile size={30} />
                                                                        <span className="title"> Select image or drop it here</span>
                                                                    </span>
                                                                    <span className="info">Max file size is 1 MB</span>
                                                                </span>
                                                            }
                                                            capture="environment"
                                                            handleChange={(data) => {
                                                                if (data.result) {
                                                                    setImages(data)
                                                                    setError([])
                                                                } else throwError(data)
                                                            }}
                                                        />
                                                        </label>
                                                    </div>
                                                    {images?.ofileData && (
                                                        <div className="image_info">
                                                            {/* prettier-ignore */}
                                                            <img
                                                            src={images?.ofileData}
                                                            className="image"
                                                            onDragStart={(event) => event.preventDefault()}
                                                        />
                                                            {/* prettier-ignore */}
                                                            <div className="text_container">
                                                            <div className="text_container_inside">
                                                                <p>{images?.fileName}</p>
                                                                <p>{fixFileSize(images?.ofileSize)}</p>
                                                            </div>
                                                        </div>
                                                        </div>
                                                    )}
                                                    {error?.[0] == 'image' && (
                                                        <span className="error">
                                                            <MdOutlineErrorOutline
                                                                size={22}
                                                            />
                                                            {error[1]}
                                                        </span>
                                                    )}
                                                </DialogContent>
                                                <DialogActions>
                                                    <Button
                                                        onClick={handleClose}
                                                    >
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
                                        {/* prettier-ignore */}
                                        <div className="w-full flex flex-wrap items-center gap-[10px]">
                                        <Input
                                            label="🕑 Duration"
                                            placeholder="0:00 or 000 (seconds)"
                                            size="small"
                                            value={data['duration']}
                                            name="duration"
                                            onChange={(e) => {
                                                (!e.target.value || e.target.value.match(/(\d|:)/g).join('') == e.target.value) && handleClick(e)
                                            }}
                                        />
                                        {data['duration'] && (
                                            <span className="select-none opacity-60">
                                                given in{' '}
                                                {data['duration'] && data['duration']?.includes(':')
                                                    ? `time (${unformatTime(data['duration'])} seconds)`
                                                    : `seconds (${formatTime(data['duration'])} time)`}
                                            </span>
                                        )}
                                    </div>
                                        {/* prettier-ignore */}
                                        <label className="flex flex-col gap-[4px]">
                                        <span
                                            className={`opacity-60 ${error?.[0] == 'brokenLevel' && 'text-red-500'}`}
                                        >
                                            Select broken level
                                        </span>
                                        <div className="flex flex-wrap items-center gap-[15px]">
                                            <Rating
                                                value={data['brokenLevel']}
                                                onChange={(e, newValue) => handleClick("brokenLevel", newValue)}
                                                onChangeActive={(event, newHover) => setHover(newHover)}
                                                getLabelText={() => brokenLevelLabels[data['brokenLevel']]}
                                                max={10}
                                            />
                                            <span>
                                                {brokenLevelLabels[hover != -1 ? hover : data['brokenLevel']]}
                                            </span>
                                        </div>
                                    </label>
                                        {/* prettier-ignore */}
                                        <div className="checkboxes flex flex-col gap-[5px]">
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={data['released']}
                                                    onChange={(e, newValue) => handleClick("released", newValue)}
                                                />
                                            }
                                            label="Released"
                                        />
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={data['excluded']}
                                                    onChange={(e, newValue) => handleClick("excluded", newValue)}
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
                                            ? navigate(
                                                  '/dashboard/song-manager'
                                              )
                                            : handleBack()
                                    }
                                    sx={{ mr: 1 }}
                                >
                                    {activeStep === 0 ? 'Cancel' : 'Back'}
                                </Button>
                                <Button onClick={() => handleNext()}>
                                    {activeStep === steps.length - 1
                                        ? 'Finish'
                                        : 'Next'}
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="summary w-full flex flex-col">
                            <span className="text-center opacity-60">
                                Please confirm that this data is correct
                            </span>
                            <SongInfo
                                song={convertDataToSong(data)}
                                allArtists={allArtists}
                            />
                            <div className="w-full flex justify-between">
                                <Button onClick={() => setSummary(false)}>
                                    Back
                                </Button>
                                <LoadingButton
                                    onClick={submitSong}
                                    variant="contained"
                                    startIcon={<MdDone />}
                                >
                                    Confirm
                                </LoadingButton>
                            </div>
                        </div>
                    )}
                </div>
            ) : null}
        </Container>
    );
};

export default AddSong;
