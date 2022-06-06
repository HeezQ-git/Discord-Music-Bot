/* eslint no-eval: 0 */

import { Store } from 'react-notifications-component';

export const delay = async (_) =>
    await new Promise((resolve) => setTimeout(resolve, _));

export const alphabeticalOrder = (arr) =>
    arr.sort((a, b) => (a.toLowerCase() < b.toLowerCase() ? -1 : 1));

export const countOccurrences = (arr, val) =>
    arr.reduce((a, v) => (v === val ? a + 1 : a), 0);

//* formatting time isn't dangerous here,
//* we're checking for proper time formatting
export const formatTime = (time) => {
    time = parseInt(time);
    if (time < 0) return null;
    if (time === 0) return '00:00';

    let final = '',
        _hrs = 0;
    if (time >= 3600) {
        _hrs = eval(parseInt(time / 3600));
        time -= _hrs * 3600;
        if (_hrs > 9) final += `${_hrs}:`;
        else if (_hrs < 10) final += `0${_hrs}:`;
    }

    const _mins = eval(parseInt(time / 60));
    const _secs = eval(parseInt(time - _mins * 60));

    if (_mins > 0 && _mins > 9) final += `${_mins}:`;
    else if (_mins > 0 && _mins < 10) final += `0${_mins}:`;
    else final += `00:`;

    if (_secs > 0 && _secs > 9) final += `${_secs}`;
    else if (_secs > 0 && _secs < 10) final += `0${_secs}`;
    else final += `00`;

    return final;
};

export const unformatTime = (time) => {
    const timeSplit = time
        .toString()
        .replace(new RegExp('`', 'g'), '')
        .split(':');
    if (timeSplit.length >= 3)
        return (
            eval(parseInt(timeSplit[0]) * 3600) +
            eval(parseInt(timeSplit[1]) * 60) +
            parseInt(timeSplit[2])
        );
    else return eval(parseInt(timeSplit[0]) * 60) + parseInt(timeSplit[1]);
};

export const newNotification = (title, message, type) =>
    Store.addNotification({
        title,
        message,
        type,
        showIcon: true,
        insert: 'top',
        container: 'top-right',
        animationIn: ['animated', 'fadeIn'],
        animationOut: ['animated', 'fadeOut'],
        dismiss: {
            duration: 5000,
            onScreen: true,
        },
    });

export const convertDataToSong = (data) => {
    return {
        name: data.songName,
        artist: data.artist,
        version: data.version.id,
        game: data.game,
        dancemode: data.dancemode.id,
        xboxbrokenlevel: data.brokenLevel,
        difficulty: data.difficulty.id,
        effort: data.effort.id,
        times: data.time,
        genre: data.genre.map((tag) => tag.id),
        tags: data.tag.map((tag) => tag.id),
        duration: data.duration,
        type: data.type,
        cover: data.songCover,
        released: data.released,
        excluded: data.excluded,
    };
};
