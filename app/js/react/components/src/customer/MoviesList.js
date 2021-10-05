import React,{Component} from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Card from 'react-bootstrap/Card';
import styles from './css/common.css';
import Button from 'react-bootstrap/esm/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import Carousel from 'react-bootstrap/Carousel';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Image from 'react-bootstrap/Image';
import Nav from 'react-bootstrap/Nav';

import CinemaNav from './CinemaNav';
import CinemaFooter from './CinemaFooter';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import * as Icons from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import NavbarCollapse from 'react-bootstrap/esm/NavbarCollapse';

export default class MoviesList extends Component{

    constructor(){
        super();
        this.state={
            isLogged:false,
            cust_id:-1,

            //content lists
            showing_list:[],
            upcoming_list:[],
        }
        this.logHandler = this.loginHandler.bind(this);
    }

    componentDidMount(){
        this.getShowing();
        this.getUpcoming();
    }

    render(){
        return(
            <Container fluid className="no-margin-padding">
                <Row className="no-margin-padding">
                    <CinemaNav loginHandler={this.logHandler}/>
                </Row>

                <Row className="no-margin-padding cust_content page_margin_padding">
                    <Col className="no-margin-padding moviesList_container">
                        <Row className="no-margin-padding mb-3">
                            <Col className="cust_page_title">
                                Movies
                            </Col>
                        </Row>
                        <Row className="moviesList_container h-75">
                            <Col className="h-100 home_content moviesList_content_padding mlist_tab_content">
                                <Tabs
                                    id="home_movie_tabs"
                                    defaultActiveKey="showing"
                                    className="mb-1"
                                >
                                    <Tab eventKey="showing" title="Now Showing" className="w-100">
                                        <Row>
                                            {this.printShowing()}
                                        </Row>
                                    </Tab>
                                    <Tab eventKey="upcoming" title="Coming Soon" className="w-100">
                                        <Row>
                                            {this.printUpcoming()}
                                        </Row>
                                    </Tab>
                                </Tabs>
                            </Col>
                        </Row>
                    </Col>
                </Row>

                <Row className="no-margin-padding">
                    <CinemaFooter/>
                </Row>
            </Container>
        )
    }

    loginHandler(log,id){
        this.setState({
            isLogged:log,
            cust_id:id,
        });
    }

    getShowing(){
        const url = "/cinema_project/api/getShowingMovies"

        axios.get(url)
        .then(response => {
            this.setState({
                showing_list:response.data.data,
            })
        })
        .catch(error => {
            alert("Error: "+error)
        })
    }

    getUpcoming(){
        const url = "/cinema_project/api/getUpcomingMovies";

        axios.get(url)
        .then(response => {
            this.setState({
                upcoming_list:response.data.data
            })
        })
        .catch(error => {
            alert("Error: "+error)
        })
    }

    printShowing(){
        if(this.state.showing_list.length != 0){
            return this.state.showing_list.map((data,i) => {
                return(
                    <Col xs={3} className="justify-content-center d-flex carousel_poster_item mt-4">
                        <div className="img_hover_bg"/>
                        <Image className="content_carousel_img" src={data.poster}/>
                        <div className="img_hover_container">
                            <div className="w-100">
                                <Row className="my-4 no-margin-padding">
                                    <div className="img_hover_text">{data.title}</div>
                                </Row>
                                <Row className="my-2 no-margin-padding">
                                    <Nav.Link href={"/cinema_project/movieDetail/"+data.movie_id} className="w-100 no-margin-padding">
                                        <Button className="img_hover_btn solid" size="sm" variant="light">Book Now</Button>
                                    </Nav.Link>
                                </Row>
                                <Row className="my-2 no-margin-padding">
                                    <Nav.Link href={"/cinema_project/movieDetail/"+data.movie_id} className="w-100  no-margin-padding">
                                        <Button size="sm" className="img_hover_btn outline" variant="outline-light">More Info</Button>
                                    </Nav.Link>
                                </Row>
                            </div>
                        </div>
                    </Col>
                )
            })
        }
        else{
            return (
                <Col className="justify-content-center d-flex carousel_poster_item mt-4">
                    <h3>No Movies Found!</h3>
                </Col>
            )
        }
    }

    printUpcoming(){
        if(this.state.upcoming_list.length != 0){
            return this.state.upcoming_list.map((data,i) => {
                return(
                    <Col xs={3} className="justify-content-center d-flex carousel_poster_item mt-4">
                        <div className="img_hover_bg"/>
                        <Image className="content_carousel_img" src={data.poster}/>
                        <div className="img_hover_container">
                            <div className="w-100">
                                <Row className="my-4 no-margin-padding">
                                    <div className="img_hover_text">{data.title}</div>
                                </Row>
                                <Row className="my-2 no-margin-padding">
                                    <Nav.Link href={"/cinema_project/movieDetail/"+data.movie_id} className="w-100 no-margin-padding">
                                        <Button className="img_hover_btn solid" size="sm" variant="light">Book Now</Button>
                                    </Nav.Link>
                                </Row>
                                <Row className="my-2 no-margin-padding">
                                    <Nav.Link href={"/cinema_project/movieDetail/"+data.movie_id} className="w-100  no-margin-padding">
                                        <Button size="sm" className="img_hover_btn outline" variant="outline-light">More Info</Button>
                                    </Nav.Link>
                                </Row>
                            </div>
                        </div>
                    </Col>
                )
            })
        }
        else{
            return (
                <Col className="justify-content-center d-flex carousel_poster_item mt-4">
                    <h3>No Movies Found!</h3>
                </Col>
            )
        }
    }
}