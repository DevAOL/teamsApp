"use client"
import React from 'react';
import { useRouter, useSearchParams  } from 'next/navigation'
import { useGlobalState } from "@/app/Providers/globalProvider"
import Image from "next/image"
import Link from 'next/link'
import styled from 'styled-components';
import menu from "@/app/Utils/menu"

function NavBar () {
    const { theme, switchTheme } = useGlobalState();
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = parseInt(searchParams.get('id') as string);

    const itemClass = (itemId:number) => {
        let classes = "nav-item ";
        classes += id === itemId ? "active" : "";
        return classes;
    };

    const getLink = (link: string, id: number, title: string) => {
        return link == "/" || link == "/pages/players" ? link : `${link}?id=${id}&title=${title}`;
    };

    return (
        <NavbarStyle theme={theme}>
            <div className='image'>
                <Image width={70} height={70} src="/sparesandstrikes.png" onClick={switchTheme} alt="profile"/>
            </div>
            <ul className="nav-items">
                {menu.map((item) => {
                return (
                    <li key={item.id} className={itemClass(item.id)} onClick={() => router.push(getLink(item.link, item.id, item.title))}>
                        <Link href="#" title={item.alt} target={item.target}>{item.icon} {item.title}</Link>
                    </li>
                );
                })}
            </ul>
        </NavbarStyle>
    );
}

const NavbarStyle = styled.nav`
    background-color: ${(props) => props.theme.backgroundColor2};
    border: 1px solid ${(props) => props.theme.backgroundColor4};
    box-shadow: 1px 1px ${(props) => props.theme.backgroundColor5};
    color: ${(props) => props.theme.frontColor2};
    border-radius: 1rem;
    position:fixed
    height: 100vh;

    .nav-items li a {
        color: ${(props) => props.theme.frontColor5};
    }

    .nav-items .active a {
        color:${(props) => props.theme.frontColor1};
    }
      
    .nav-items li:hover, .nav-items .active {
        background-color: ${(props) => props.theme.backgroundColor3};
        color: ${(props) => props.theme.frontColor1};
    }

    h1 {
        color: ${(props) => props.theme.frontColor1};
    }
`;
 
export default NavBar;