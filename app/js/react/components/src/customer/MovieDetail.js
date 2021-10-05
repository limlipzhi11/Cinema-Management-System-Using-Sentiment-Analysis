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

import CinemaNav from './CinemaNav';
import CinemaFooter from './CinemaFooter';
import YoutubeEmbed from './CustYoutubeEmbed';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import * as Icons from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import NavbarCollapse from 'react-bootstrap/esm/NavbarCollapse';

export default class MovieDetail extends Component{

    constructor(){
        super();
        this.state={
            isLogged:false,
            cust_id:-1,

            //modal states
            show_trailerModal:false,

            //content lists
            movie_data:{
                "title":"Movie Title",
                "show_start":"00/00/0000",
                "show_end":"00/00/0000",
                "cast":"John Doe, Bill Gates",
                "director":"John Doe",
                "distributor":"Some Company",
                "synopsis":"Some Text",
                "poster":"/cinema_project/public/img/admin_login_bg.png",
                "trailer":"https://youtu.be/dQw4w9WgXcQ",
                "genres":[{"genre":"genre"},{"genre":"genre"},{"genre":"genre"}],
                "exps":[],
                "showings":[],
            },
        }
        this.logHandler = this.loginHandler.bind(this);
        this.forceLogin = null;
    }

    componentDidMount(){
        this.getMovieDetail();
    }

    render(){
        return(
            <Container fluid className="no-margin-padding bg-light">
                <Row className="no-margin-padding">
                    <CinemaNav loginHandler={this.logHandler} forceLogin={click=>this.forceLogin=click}/>
                </Row>

                <Row className="no-margin-padding cust_content mDetail_margin_padding">
                    <Col className="no-margin-padding moviesList_container">
                        <Row id="mDetailPanel" className="no-margin-padding">
                            <Col id="mDetailContainer" className="no-margin-padding my-auto">
                                <Row>
                                    <Col>
                                        <h1 id="m_title" className="font-weight-bold transition_anim">{this.state.movie_data.title}</h1>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <div>
                                            {this.state.movie_data.genres.map((data,i)=>{
                                                if(i == 0)
                                                    return data.genre 
                                                else
                                                    return ", "+data.genre
                                            })}
                                        </div>
                                    </Col>
                                </Row>
                                <Row id="mDetail_collapse" className="w-100 mt-4 collapse show">
                                    <Col>
                                        <Row className="w-100">
                                            <Col id="mDetail_item">
                                                <Row>
                                                    <Col id="mDetail_header">
                                                        <div className="font-weight-bold">Showing Date</div>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col id="mDetail_text">
                                                        <div>{this.state.movie_data.show_start} - {this.state.movie_data.show_end}</div>
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col id="mDetail_item">
                                                <Row>
                                                    <Col id="mDetail_header">
                                                        <div className="font-weight-bold">Cast</div>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col id="mDetail_text">
                                                        <div>{this.state.movie_data.cast}</div>
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col id="mDetail_item">
                                                <Row>
                                                    <Col id="mDetail_header">
                                                        <div className="font-weight-bold">Director</div>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col id="mDetail_text">
                                                        <div>{this.state.movie_data.director}</div>
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col id="mDetail_item">
                                                <Row>
                                                    <Col id="mDetail_header">
                                                        <div className="font-weight-bold">Distributor</div>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col id="mDetail_text">
                                                        <div>{this.state.movie_data.distributor}</div>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                        <Row className="mt-3">
                                            <Col id="mDetail_item">
                                                <Row>
                                                    <Col id="mDetail_header">
                                                        <div className="font-weight-bold">Synopsis</div>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col id="mDetail_text">
                                                        <div>{this.state.movie_data.synopsis}</div>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row id="mDetail_controls" className="mt-3">
                                    <Col>
                                        <Button
                                            id="collapseBtn" 
                                            variant="muted" 
                                            className="no-margin-padding font-weight-bold text-secondary"
                                            onClick={()=>this.collapseDetails()}
                                        >
                                            Hide Details -
                                        </Button>
                                    </Col>
                                </Row>
                            </Col>
                            <Col id="mPosterContainer" xs={4} md={2} className="no-margin-padding my-auto">
                                <div className="mDetail_imgHoverBg"/>
                                <Image src={this.state.movie_data.poster} className="w-100 h-100 mDetail_poster"/>
                                <div className="mDetail_hoverContainer">
                                    <div className="w-100">
                                        <Row className="my-2 no-margin-padding">
                                            <Button className="img_hover_btn solid" size="sm" variant="light" onClick={()=>this.showTrailerModal()}>
                                                <FontAwesomeIcon className="btnIcon" icon={Icons.faEye}/>
                                                View Trailer
                                            </Button>
                                        </Row>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <hr className="shadow"/>
                        <Row id="showing_panel" className="no-margin-padding">
                            <Table className="text-center mt-3" responsive bordered striped hover>
                                <thead className="bg-warning">
                                    <th className="text-left">Name</th>
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>Book</th>
                                </thead>
                                <tbody>
                                    {this.printShowings()}
                                </tbody>
                            </Table>
                        </Row>
                    </Col>
                </Row>

                <Row className="no-margin-padding">
                    <CinemaFooter/>
                </Row>
                
                {this.trailerModal()}
            </Container>
        )
    }

    loginHandler(log,id){
        this.setState({
            isLogged:log,
            cust_id:id,
        });
    }

    getMovieDetail(){
        const movie_id = this.props.match.params.id;
        const url = "/cinema_project/api/getMovieDetail/" + movie_id;

        axios.get(url)
        .then(response => {
            this.setState({
                movie_data:response.data.data
            },()=>{console.log(this.state.movie_data)})
        })
        .catch(error => {
            alert("Error :" + error);
        })
    }

    collapseDetails(){
        var collapse = document.getElementById('mDetail_collapse');
        collapse.classList.toggle('show')

        var title = document.getElementById('m_title');
        title.classList.toggle("jumboText")

        var btn = document.getElementById('collapseBtn');
        if(collapse.classList.contains('show')){
            btn.innerHTML = "Hide Details -"
        }
        else{
            btn.innerHTML = "More Info +"
        }
    }

    trailerModal(){
        return(
            <Modal
                show={this.state.show_trailerModal}
                onHide={()=>this.hideTrailerModal()}
                backdrop="static"
                keyboard={false}
                centered
                size="lg"
            >
                <Modal.Header className="modalHeader" closeButton>
                    Movie Trailer
                </Modal.Header>
                <Modal.Body>
                    <YoutubeEmbed embedId={this.state.movie_data.trailer.replace('https://youtu.be/','')}/>
                </Modal.Body>
            </Modal>
        )
    }

    showTrailerModal(){
        this.setState({
            show_trailerModal:true
        })
    }

    hideTrailerModal(){
        this.setState({
            show_trailerModal:false
        })
    }

    printShowings(){
        var showings = this.state.movie_data.showings;
        if(showings.length != 0){
            return showings.map((data)=>{
                return(
                    <tr>
                        <td className="text-left">{data.name}</td>
                        <td>{data.show_date}</td>
                        <td>{data.start_time.slice(0,-3) + " - " + data.end_time.slice(0,-3)}</td>
                        <td>
                            <Button
                                variant="info"
                                size="sm"
                                className="font-weight-bold"
                                onClick={()=>this.goToBooking(data.showing_id)}
                            >
                                <FontAwesomeIcon className="btnIcon" icon={Icons.faBook}/>
                                Book Now
                            </Button>
                        </td>
                    </tr>
                )
            })
        }
        else{
            return(
                <tr>
                    <td colSpan={4}>Sorry, there are no showtimes available for this movie.</td>
                </tr>
            )
        }
    }

    goToBooking(id){
        if(this.state.isLogged){
            window.location.href = "/cinema_project/booking/" + id;
        }
        else{
            this.forceLogin();
        }
    }
}