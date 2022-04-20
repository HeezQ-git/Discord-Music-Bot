import { TextField, IconButton, InputAdornment } from "@mui/material";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { useState } from "react";

const Input = (props) => {
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword(!showPassword);

    let inputProps = null;
    if (props.font) inputProps = { style: { fontSize: props.font } };

    if (props.val == "password" && !props.adornment)
        return (
            <TextField
                type={showPassword ? "text" : "password"}
                InputLabelProps={inputProps}
                InputProps={{
                    ...inputProps,
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                onClick={handleClickShowPassword}
                                edge="end"
                            >
                                {showPassword ? (
                                    <MdVisibilityOff size={22.5} />
                                ) : (
                                    <MdVisibility size={22.5} />
                                )}
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
                {...props}
            />
        );
    else if (props.starticon)
        return (
            <TextField
                InputLabelProps={inputProps}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            {props.starticon}
                        </InputAdornment>
                    ),
                }}
                {...props}
            />
        );
    else
        return (
            <TextField
                InputLabelProps={inputProps}
                InputProps={inputProps}
                {...props}
            />
        );
};

export default Input;
