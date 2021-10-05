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
import QuickBook from './QuickBook';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import * as Icons from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import NavbarCollapse from 'react-bootstrap/esm/NavbarCollapse';

export default class Home extends Component{

    constructor(){
        super();
        this.state={
            isLogged:false,
            cust_id:-1,

            //content lists
            banner_list:[],
            showing_list:[],
            upcoming_list:[],
            popular_list:[],
        }
        this.logHandler = this.loginHandler.bind(this);
        this.forceLogin = null;
        this.syncLogged = null;
    }

    componentDidMount(){
        this.getBanners();
        this.getShowing();
        this.getUpcoming();
        this.getPopular();
    }

    render(){
        return(
            <Container fluid className="no-margin-padding">
                <Row className="no-margin-padding">
                    <CinemaNav loginHandler={this.logHandler} forceLogin={click=>this.forceLogin=click} syncLogged={this.syncLogged}/>
                </Row>

                <Row className="no-margin-padding cust_content">
                    <Col className="no-margin-padding">
                        <Row className="no-margin-padding">
                            <Col className="no-margin-padding">
                                <Carousel id="home-carousel">
                                    {this.printBanners()}
                                </Carousel>
                            </Col>
                        </Row>
                        <Row className="no-margin-padding">
                            <Col className="no-margin-padding">
                                <div className="large_container home_content align-middle">
                                    <div className="w-100">
                                        <Tabs
                                            id="home_movie_tabs"
                                            defaultActiveKey="showing"
                                            className="mb-5"
                                        >
                                            <Tab eventKey="showing" title="Now Showing" className="h-100 w-100">
                                                <Carousel interval={null} indicators={false} className="h-100 w-100 content_carousel">
                                                    {this.printShowing()}
                                                </Carousel>
                                            </Tab>
                                            <Tab eventKey="upcoming" title="Coming Soon" className="h-100 w-100">
                                                <Carousel interval={null} indicators={false} className="h-100 w-100 content_carousel">
                                                    {this.printUpcoming()}
                                                </Carousel>
                                            </Tab>
                                        </Tabs>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <hr className="shadow"/>
                        <Row className="no-margin-padding">
                            <Col className="no-margin-padding">
                                <div className="large_container home_content align-middle">
                                    <div className="w-100">
                                        <Row className="no-margin-padding">
                                            <Col className="no-margin-padding cust_content_header mb-5">Popular Movies</Col>
                                        </Row>
                                        <Row className="no-margin-padding h-100 w-100">
                                            <Col className="no-margin-padding h-100 w-100">
                                                <Carousel interval={null} indicators={false} className="h-100 w-100 content_carousel">
                                                    {this.printPopular()}
                                                </Carousel>
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </Row>

                <Row className="no-margin-padding">
                    <CinemaFooter/>
                </Row>

                <QuickBook forceLogin={()=>{this.forceLogin()}} syncLogged={(click)=>{this.syncLogged=click}}/>
            </Container>
        )
    }

    loginHandler(log,id){
        this.setState({
            isLogged:log,
            cust_id:id,
        });
    }

    getBanners(){
        const url = "/cinema_project/api/getEnabledBanners"

        axios.get(url)
        .then(response => {
            this.setState({
                banner_list:response.data.data
            })
        })
        .catch(error => {
            alert("Error: "+error);
        })
    }

    printBanners(){
        if(this.state.banner_list.length != 0){
            return this.state.banner_list.map((data) => {
                return(
                    <Carousel.Item>
                        <a href = {data.link}>
                            <img
                                className="d-block carousel_img"
                                src={data.img}
                            />
                        </a>
                    </Carousel.Item>
                )
            })
        }
        else{
            return(
                <Carousel.Item>
                    <div className="d-flex carousel_img text-center justify-content-center align-items-center bg-secondary">
                        <h3>No Banners Found!</h3>
                    </div>
                </Carousel.Item>
            )
        }
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

    printShowing(){
        if(this.state.showing_list.length != 0){
            var showing=[];
            var elements=[];

            this.state.showing_list.map((data,i) => {
                elements.push(
                    <Col xs={4} className="justify-content-center d-flex my-auto carousel_poster_item px-xs-1 px-md-2">
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

            while(elements.length) {
                showing.push(elements.splice(0, 3));
            }
            
            return showing.map((data,i)=>{
                return(
                    <Carousel.Item>
                        <Row className="h-100 w-100">
                            {data.map((d)=>{
                                return d;
                            })}
                        </Row>
                    </Carousel.Item>
                )
            })

        }
        else{
            return (
                <Carousel.Item>
                    <Row className="h-100 w-100">
                        <Col className="d-flex justify-content-center align-items-center">
                            <h3>No Movies Found!</h3>
                        </Col>
                    </Row>
                </Carousel.Item>
            )
        }
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

    printUpcoming(){
        if(this.state.upcoming_list.length != 0){
            var showing=[];
            var elements=[];

            this.state.upcoming_list.map((data,i) => {
                elements.push(
                    <Col xs={4} className="justify-content-center d-flex my-auto carousel_poster_item">
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

            while(elements.length) {
                showing.push(elements.splice(0, 3));
            }
            
            return showing.map((data,i)=>{
                return(
                    <Carousel.Item>
                        <Row className="h-100 w-100">
                            {data.map((d)=>{
                                return d;
                            })}
                        </Row>
                    </Carousel.Item>
                )
            })

        }
        else{
            return (
                <Carousel.Item>
                    <Row className="h-100 w-100">
                        <Col className="d-flex justify-content-center align-items-center">
                            <h3>No Movies Found!</h3>
                        </Col>
                    </Row>
                </Carousel.Item>
            )
        }
    }

    getPopular(){
        const url = "/cinema_project/api/getPopularMovies";

        axios.get(url)
        .then(response => {
            this.setState({
                popular_list:response.data.data
            })
        })
        .catch(error => {
            alert("Error: "+error)
        })
    }

    printPopular(){
        if(this.state.popular_list.length != 0){
            var showing=[];
            var elements=[];

            this.state.popular_list.map((data,i) => {
                elements.push(
                    <Col xs={4} className="justify-content-center d-flex my-auto carousel_poster_item">
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

            while(elements.length) {
                showing.push(elements.splice(0, 3));
            }
            
            return showing.map((data,i)=>{
                return(
                    <Carousel.Item>
                        <Row className="h-100 w-100">
                            {data.map((d)=>{
                                return d;
                            })}
                        </Row>
                    </Carousel.Item>
                )
            })

        }
        else{
            return (
                <Carousel.Item>
                    <Row className="h-100 w-100">
                        <Col className="d-flex justify-content-center align-items-center">
                            <h3>No Movies Found!</h3>
                        </Col>
                    </Row>
                </Carousel.Item>
            )
        }
    }
}