import {list, check, envelope, home} from "./icons";

const menu = [
    {
        id: 0,
        title: " Hold kampe",
        icon: home,
        link: "/",
        alt: " Hold kampe",
        target: "_self"
    },
    {
        id: 1,
        title: "Liga Damer",
        icon: check,
        link: "/pages/team",
        alt: "Liga Damer",
        target: "_self"
    },
    {
        id: 2,
        title: "Øst 4-Damer",
        icon: check,
        link: "/pages/team",
        alt: "Øst 4-Damer",
        target: "_self"
    },
    {
        id: 3,
        title: "Række Damer",
        icon: check,
        link: "/pages/team",
        alt: "Række Damer",
        target: "_self"
    },
    {
        id: 4,
        title: "Den fri",
        icon: check,
        link: "/pages/team",
        alt: "Den fri",
        target: "_self"
    },
    {
        id: 5,
        title: "Spillere",
        icon: list,
        link: "/pages/players",
        alt: "Spillere",
        target: "_self"
    },
    {
        id: 6,
        title: "Email",
        icon: envelope,
        link: "https://dashboard.emailjs.com/sign-in",
        alt: "teamsasadmin@gmail.com / ..Sas98712",
        target: "_blank"
    },
]

export default menu;