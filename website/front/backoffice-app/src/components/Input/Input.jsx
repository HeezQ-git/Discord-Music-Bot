import { TextField, IconButton, InputAdornment } from "@mui/material";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { useState } from "react";

const Input = (props) => {
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword(!showPassword);

    let inputProps = null;
    if (props.font) inputProps = { style: { fontSize: props.font } };

    return props.val == "password" ? (
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
    ) : (
        <TextField
            InputLabelProps={inputProps}
            InputProps={inputProps}
            maxLength="24"
            {...props}
        />
    );
};

export default Input;
