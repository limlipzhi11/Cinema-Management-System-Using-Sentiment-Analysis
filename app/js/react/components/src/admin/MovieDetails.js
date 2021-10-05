import React,{Component} from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/esm/ListGroup';
import Badge from 'react-bootstrap/Badge';
import ProgressBar from 'react-bootstrap/ProgressBar';

import Session from './Session';
import SideNav from './SideNav';
import YoutubeEmbed from './YoutubeEmbed';

import styles from './css/common/common.css';
import Button from 'react-bootstrap/esm/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import * as Icons from '@fortawesome/free-solid-svg-icons';import axios from 'axios';
import NavbarCollapse from 'react-bootstrap/esm/NavbarCollapse';

export default class MovieDetails extends Component{

    constructor(){
        super();
        this.state={
            //session state variables
            isLogged:false,
            id:0,
            admin_group:0,

            movie_data:[],

            show_trailerModal:false,
        }
    }

    componentDidMount(){
        this.getMovie();
    }

    render(){
        return(
            <Container fluid className="no-margin-padding">
                <Row className="wrapper">

                    <SideNav selected={location.pathname}/>
                    
                    <Col id="content">
                        {this.alertMessage()}
                        <Row id="pageHeader">
                            <Col className="no-margin-padding">
                                <div>MOVIE DETAILS</div>
                            </Col>
                        </Row>
                        <Row id="pageContent" className="no-margin-padding">
                            <Col className="no-margin-padding">
                                <Card className="no-margin-padding">
                                    {this.printDetails()}
                                </Card>
                            </Col>
                        </Row>
                    </Col> 

                    <Session/>
                </Row>
            </Container>
        )
    }

    showAlert(isSuccess,msg){
        if(isSuccess){
            this.setState({
                show_alert:true,
                alert_variant:"success",
                alert_heading:"Success!",
                alert_msg:msg
            });
        }
        else{
            this.setState({
                show_alert:true,
                alert_variant:"danger",
                alert_heading:"Snap! Something Went Wrong.",
                alert_msg:msg
            });
        }
    }

    hideAlert(){
        this.setState({
            show_alert:false,
            alert_variant:"",
            alert_heading:"",
            alert_msg:""
        });
    }

    alertMessage(){
        if(this.state.show_alert){
            return (
                <Alert className="alertMessage" variant={this.state.alert_variant} onClose={()=>this.hideAlert()} dismissible>
                    <Alert.Heading>{this.state.alert_heading}</Alert.Heading>
                    <p>
                        {this.state.alert_msg}
                    </p>
                </Alert>
            )
        }
    }

    getMovie(){
        const movie_id = this.props.match.params.id;
        const url = '/cinema_project/api/admin/getMovie/'+movie_id;

        axios.get(url)
        .then(response => {
            this.setState({movie_data: response.data.data});
        })
        .catch(error => {
            alert("Error: "+error);
        });
    }

    printDetails(){
        if(this.state.movie_data.length != 0){
            return(
                <Row className="no-margin-padding">
                    <Col id="detail_img_container" className="d-flex align-items-center no-margin-padding" xs={3}>
                        <Card.Img className="detail_img" src={this.state.movie_data.poster}/>
                        <div className="hoverButton">
                            <Button variant="outline-warning" className="toolbarBtn" size="sm" onClick={()=>this.showTrailerModal()}>
                                <FontAwesomeIcon className="btnIcon" icon={Icons.faEye}/>
                                <b>View Trailer</b>
                            </Button>
                        </div>
                    </Col>
                    <Col className="no-margin-padding">
                        <Card.Body className="movieListBody">
                            <Row className="no-margin-padding">
                                <Card.Title className="no-margin-padding"><h3><b>{this.state.movie_data.title}</b></h3></Card.Title>
                            </Row>
                            <Card.Text>
                                {this.state.movie_data.genre.map((g,j)=>{
                                    if(j == 0)
                                        return (g.genre)
                                    else
                                        return (", " + g.genre)
                                })}
                            </Card.Text>
                            <Card.Text className="detail_subheading">Cast</Card.Text>
                            <Card.Text className="detail_text">{this.state.movie_data.cast}</Card.Text>
                            <Row className="no-margin-padding mt-2">
                                <Col className="no-margin-padding">
                                    <Card.Text className="detail_subheading">Director</Card.Text>
                                    <Card.Text className="detail_text">{this.state.movie_data.director}</Card.Text>
                                </Col>
                                <Col className="no-margin-padding">
                                    <Card.Text className="detail_subheading">Distributor</Card.Text>
                                    <Card.Text className="detail_text">{this.state.movie_data.distributor}</Card.Text>
                                </Col>
                                <Col className="no-margin-padding">
                                    <Card.Text className="detail_subheading">Showing Dates</Card.Text>
                                    <Card.Text className="detail_text">{this.state.movie_data.show_start+" - "+this.state.movie_data.show_end}</Card.Text>
                                </Col>
                            </Row>
                            <Row className="no-margin-padding mt-2">
                                <Col className="no-margin-padding">
                                    <Card.Text className="detail_subheading">Price</Card.Text>
                                    <Card.Text className="detail_text">{"RM "+this.state.movie_data.price}</Card.Text>
                                </Col>
                                <Col className="no-margin-padding">
                                    <Card.Text className="detail_subheading">Movie Duration</Card.Text>
                                    <Card.Text className="detail_text">{this.state.movie_data.duration + " mins"}</Card.Text>
                                </Col>
                                <Col className="no-margin-padding">
                                    <Card.Text className="detail_subheading">Available Experiences</Card.Text>
                                    <Card.Text className="detail_text">
                                        {this.state.movie_data.exp.map((e,j)=>{
                                            if(j == 0)
                                                return (e.name)
                                            else
                                                return (", " + e.name)
                                        })}
                                    </Card.Text>
                                </Col>
                            </Row>
                            <Row className="no-margin-padding mt-2">
                                <Col className="no-margin-padding">
                                    <Card.Text className="detail_subheading">Synopsis</Card.Text>
                                    <Card.Text className="detail_text">{this.state.movie_data.synopsis}</Card.Text>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Col>
                    <Col xs={2} className="no-margin-padding">
                        <Card id="detail_sentiment_container">
                            <Card.Body className="align-items-center">
                                <Row className="no-margin-padding">
                                    <Col className="no-margin-padding text-center font-weight-bold">
                                        <h4>Sentiment Score</h4>
                                    </Col>
                                </Row>
                                <Row className="no-margin-padding">
                                    <Col className="no-margin-padding text-center">
                                        {this.state.movie_data.avg_comp * 100 < 40 
                                        ?
                                            <h3 className="text-danger font-weight-bold">{Math.round(this.state.movie_data.avg_comp*100)}</h3>
                                        :
                                        this.state.movie_data.avg_comp * 100 < 70
                                        ?
                                            <h3 className="text-warning font-weight-bold">{Math.round(this.state.movie_data.avg_comp*100)}</h3>
                                        :
                                            <h3 className="text-success font-weight-bold">{Math.round(this.state.movie_data.avg_comp*100)}</h3>
                                        }
                                    </Col>
                                </Row>

                                <Card.Text className="detail_subheading"><h6>Positive</h6></Card.Text>
                                <ProgressBar variant="success"  
                                    now={this.state.movie_data.no_pos/this.state.movie_data.count*100}
                                    label={this.state.movie_data.no_pos/this.state.movie_data.count*100 + "%"}
                                />
                                <Card.Text className="detail_subheading mt-1"><h6>Neutral</h6></Card.Text>
                                <ProgressBar variant="info"  
                                    now={100-(this.state.movie_data.no_pos/this.state.movie_data.count*100)-(this.state.movie_data.no_neg/this.state.movie_data.count*100)}
                                    label={100-(this.state.movie_data.no_pos/this.state.movie_data.count*100)-(this.state.movie_data.no_neg/this.state.movie_data.count*100) + "%"}
                                />
                                <Card.Text className="detail_subheading mt-1"><h6>Negative</h6></Card.Text>
                                <ProgressBar variant="danger"  
                                    now={this.state.movie_data.no_neg/this.state.movie_data.count*100}
                                    label={this.state.movie_data.no_neg/this.state.movie_data.count*100 + "%"}
                                />

                            </Card.Body>
                        </Card>
                    </Col>
                    {this.trailerModal()}
                </Row>
            )
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
}