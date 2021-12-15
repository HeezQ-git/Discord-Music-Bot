module.exports = client => {}

module.exports.formatTime = (time) => {
    time = parseInt(time);
    if (time < 0) return null;
    if (time === 0) return '00:00';

    let final = '', _hrs = 0;
    if (time >= 3600) {
        _hrs = eval(parseInt(time / 3600));
        time -= (_hrs*3600)
        if (_hrs > 9) final += `${_hrs}:`
        else if (_hrs < 10) final += `0${_hrs}:`
    }
    
    const _mins = eval(parseInt(time / 60));
    const _secs = eval(parseInt(time - (_mins*60)));

    if (_mins > 0 && _mins > 9) final += `${_mins}:`
    else if (_mins > 0 && _mins < 10) final += `0${_mins}:`
    else final += `00:`

    if (_secs > 0 && _secs > 9) final += `${_secs}`
    else if (_secs > 0 && _secs < 10) final += `0${_secs}`
    else final += `00`

    return final;
}

module.exports.unformatTime = (time) => {
    const timeSplit = time.toString().replace(new RegExp('`', 'g'), '').split(':');
    if (timeSplit.length >= 3) return eval(parseInt(timeSplit[0])*3600) + eval(parseInt(timeSplit[1])*60) + parseInt(timeSplit[2])
    else return eval(parseInt(timeSplit[0])*60) + parseInt(timeSplit[1]);
}

module.exports.validURL = (str) => {
    var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
    if (!regex.test(str)) return false;
    return true;
}