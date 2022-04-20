import React, { useEffect } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router";
import { loginService } from "../services/login.service";

const CheckSession = () => {
    const [cookies, setCookie] = useCookies();
    const navigate = useNavigate();

    const checkSession = async () => {
        console.log("check");
        if (
            !(
                await loginService.checkSession({
                    token: cookies["token"],
                })
            ).data.success
        )
            navigate("/login");
    };

    useEffect(() => {
        checkSession();
    });

    return null;
};

export default CheckSession;
