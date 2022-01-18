import './Password.scss';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import React, { useState } from 'react';

const Password = (props) => {

    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword(!showPassword);

    return (
        <FormControl className={props.formClasses} variant="outlined">
            <InputLabel required={props.required} htmlFor={props.id}>{props.placeholder ? props.placeholder : 'Password'}</InputLabel>
            <OutlinedInput
                className={props.className ? props.className : null} 
                id={props.id}
                inputProps={props.inputProps ? props.inputProps : null}
                type={showPassword ? 'text' : 'password'}
                value={props.value || `${props.value}` != 'undefined' ? props.value : null}
                onChange={(event) => props.onChange ? props.onChange(event) : null}
                onBlur={(event) => props.onBlur ? props.onBlur(event) : null}
                error={props.error ? props.error : false}
                onKeyDown={props.onKeyDown ? props.onKeyDown : null}
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} edge="end" >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                }
                label={props.placeholder ? props.placeholder : 'Password'}
            />
        </FormControl>
    )
}

export default Password;