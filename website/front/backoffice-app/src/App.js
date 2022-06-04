import "./App.scss";
import Sidebar from "./components/Sidebar";
import SongList from "./components/SongList";
import Login from "./components/Login";
import Account from "./components/Account";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { blue, red, grey } from "@mui/material/colors";
import { useState } from "react";
import Dashboard from "./components/Dashboard/Dashboard";
import { ReactNotifications } from "react-notifications-component";
import "react-notifications-component/dist/theme.css";

const themeLight = createTheme({
    palette: {
        mode: "light",
        text: {
            primary: grey[700],
            secondary: grey[800],
        },
        primary: {
            main: blue["A400"],
            dark: blue[800],
        },
        secondary: red,
    },
});

const themeDark = createTheme({
    palette: {
        mode: "dark",
        text: {
            primary: grey[200],
            secondary: grey[300],
        },
        primary: {
            main: blue["A200"],
            dark: blue["A400"],
        },
        secondary: red,
    },
});

function App() {
    const [theme, setTheme] = useState(true);

    return (
        <div className={`App${theme ? " dark_theme" : ""}`}>
            <ReactNotifications />
            <ThemeProvider theme={theme ? themeDark : themeLight}>
                <Sidebar theme={theme} setTheme={setTheme} />
                <div className="limitWidth">
                    <Routes>
                        <Route path="/songlist" element={<SongList />} />
                        <Route
                            path="/login"
                            element={<Login theme={theme} />}
                        />
                        <Route
                            path="/account/*"
                            element={<Account theme={theme} />}
                        />
                        <Route
                            path="/dashboard/*"
                            element={<Dashboard theme={theme} />}
                        />
                    </Routes>
                </div>
            </ThemeProvider>
        </div>
    );
}

export default App;
