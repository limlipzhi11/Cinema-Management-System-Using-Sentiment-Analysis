import React,{Component} from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Button from 'react-bootstrap/Button';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import * as Icons from '@fortawesome/free-solid-svg-icons';

import {Link} from 'react-router-dom';

import axios from 'axios';
import Collapse from 'react-bootstrap/esm/Collapse';

class SideNav extends Component{

    constructor(){
        super();
        this.state = {
            isOpen:true,
            admin_name:"",
        }
    }

    render(){
        let basePath = "/cinema_project/admin/"
        const selected = this.props.selected;
        return(
            <Nav id="sidebar" activeKey={selected}>
                <nav>
                    <div class="sidebar-header">
                        <Button 
                            id="sidebarCollapse"
                            className="my-auto mx-auto"
                            onClick={()=>this.collapse()}
                            variant="link"
                        >
                            <img src="/cinema_project/public/img/logo_black.png" class="sidebarLogo"/>
                            <img src="/cinema_project/public/img/logo_small.png" class="sidebarLogo_small"/>
                        </Button>
                    </div>

                    <ul class="list-unstyled components">
                        <li>
                            <Nav.Link eventKey="/cinema_project/admin/dashboard" href="/cinema_project/admin/dashboard"><FontAwesomeIcon className="mx-auto" icon={Icons.faHome}/><b className="navText">Dashboard</b></Nav.Link>
                        </li>
                        <li>
                            <Nav.Link eventKey="/cinema_project/admin/movies" href="/cinema_project/admin/movies"><FontAwesomeIcon className="mx-auto" icon={Icons.faFilm}/><b className="navText">Movies</b></Nav.Link>
                        </li>
                        <li>
                            <Nav.Link eventKey="/cinema_project/admin/experiences" href="/cinema_project/admin/experiences"><FontAwesomeIcon className="mx-auto" icon={Icons.faCoffee}/><b className="navText">Experiences</b></Nav.Link>
                        </li>
                        <li>
                            <Nav.Link eventKey="/cinema_project/admin/movieHall" href="/cinema_project/admin/movieHall"><FontAwesomeIcon className="mx-auto" icon={Icons.faMapMarker}/><b className="navText">Halls</b></Nav.Link>
                        </li>
                        <li>
                            <Nav.Link eventKey="/cinema_project/admin/snacks" href="/cinema_project/admin/snacks"><FontAwesomeIcon className="mx-auto" icon={Icons.faUtensils}/><b className="navText">Snacks</b></Nav.Link>
                        </li>
                        <li>
                            <Nav.Link eventKey="/cinema_project/admin/banners" href="/cinema_project/admin/banners"><FontAwesomeIcon className="mx-auto" icon={Icons.faImages}/><b className="navText">Banners</b></Nav.Link>
                        </li>
                    </ul>

                    <div class="sidebar-footer">
                        <ul class="list-unstyled">
                            <li>
                                <Nav.Link eventKey="logout" href="/cinema_project/admin"><FontAwesomeIcon className="mx-auto" icon={Icons.faSignOutAlt}/> <b className="navText">Logout</b></Nav.Link>
                            </li>
                        </ul>
                    </div>
                </nav>
            </Nav>
        )
    }

    collapse(){
        var sidebar = document.getElementById("sidebar");
        sidebar.classList.toggle("active");
    }
}

export default SideNav;