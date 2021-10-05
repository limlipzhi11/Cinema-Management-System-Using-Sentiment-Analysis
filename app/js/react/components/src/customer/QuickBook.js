import React,{Component} from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import styles from './css/common.css';
import Button from 'react-bootstrap/esm/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Image from 'react-bootstrap/Image';
import Overlay from 'react-bootstrap/Overlay';
import Card from 'react-bootstrap/Card';
import Toast from 'react-bootstrap/Toast';
import InputGroup from 'react-bootstrap/InputGroup';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import * as Icons from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import NavbarCollapse from 'react-bootstrap/esm/NavbarCollapse';

export default class QuickBook extends Component{

    constructor(){
        super();
        this.state={
            isLogged:false,
            cust_id:-1,

            //Content List
            date_list:[],
            showing_list:[],
            movie_list:[],
            exp_list:[],

            //input state
            input_date:"",
            input_movie:-1,
            input_exp:-1,
            input_final:-1,
        }
        this.forceLogin = null;
        this.logHandler = this.loginHandler.bind(this);
    }

    componentDidMount(){
        this.getSession();
        this.getContent();

        this.forceLogin = this.props.forceLogin;
        if(this.props.syncLogged != undefined){
            this.props.syncLogged(this.logHandler);
        }
    }

    render(){
        return(
            <>
                <Navbar className="font-weight-bold text-dark shadow bg-dark no-margin-padding w-100" fixed="bottom" variant="light">
                    <Row className="w-100 no-margin-padding">
                        <Col xs={3} md={2} className="d-flex justify-content-center align-items-center bg-warning">
                            <Navbar.Brand className="font-weight-bold no-margin-padding" href="#">
                                <FontAwesomeIcon className="btnIcon" icon={Icons.faTicketAlt}/>
                                QUICK BOOK
                            </Navbar.Brand>
                        </Col>
                        <Col xs={9} md={10} className="no-margin-padding">
                            <Nav className="w-100">
                                <Row className="w-100 no-margin-padding">
                                    <Col className="d-flex justify-content-center align-items-center w-100">
                                        <Nav.Link className="w-100">
                                            <Form.Control 
                                                as="select" 
                                                defaultValue="" 
                                                onChange={(e)=>this.setState({
                                                    input_date:e.target.value,
                                                    input_movie:-1,
                                                    input_exp:-1,
                                                    input_final:-1,
                                                })} 
                                                className="w-100"
                                            >
                                                <option disabled value="">Select a Date</option>
                                                {this.printDateOptions()}
                                            </Form.Control>
                                        </Nav.Link>
                                    </Col>
                                    <Col className="d-flex justify-content-center align-items-center w-100">
                                        <Nav.Link className="w-100">
                                            <Form.Control 
                                                as="select" 
                                                value={this.state.input_movie} 
                                                className="w-100"
                                                disabled = {this.state.input_date != ""?false:true}
                                                onChange={(e)=>this.setState({
                                                    input_movie:e.target.value,
                                                    input_exp:-1,
                                                    input_final:-1,
                                                })}
                                            >
                                                <option disabled value={-1}>Select a Movie</option>
                                                {this.printMovieOptions()}
                                            </Form.Control>
                                        </Nav.Link>
                                    </Col>
                                    <Col className="d-flex justify-content-center align-items-center w-100">
                                        <Nav.Link className="w-100">
                                            <Form.Control 
                                                as="select" 
                                                value={this.state.input_exp}
                                                className="w-100"
                                                disabled = {this.state.input_date != "" && this.state.input_movie != -1?false:true}
                                                onChange={(e)=>this.setState({
                                                    input_exp:e.target.value,
                                                    input_final:-1,
                                                })}
                                            >
                                                <option disabled value={-1}>Select an Experience</option>
                                                {this.printExpOptions()}
                                            </Form.Control>
                                        </Nav.Link>
                                    </Col>
                                    <Col className="d-flex justify-content-center align-items-center w-100">
                                        <Nav.Link className="w-100">
                                            <Form.Control 
                                                as="select" 
                                                value={this.state.input_final}
                                                className="w-100"
                                                disabled = {this.state.input_date != "" && this.state.input_movie != -1&&this.state.input_exp != -1?false:true}
                                                onChange={(e)=>this.setState({
                                                    input_final:e.target.value
                                                })}
                                            >
                                                <option disabled value={-1}>Select a Time</option>
                                                {this.printTimeOptions()}
                                            </Form.Control>
                                        </Nav.Link>
                                    </Col>
                                    <Col className="d-flex justify-content-right w-100 no-margin-padding">
                                        <Button
                                            variant="warning"
                                            className="w-100 font-weight-bold rounded-0 d-flex align-items-center justify-content-center"
                                            disabled={this.state.input_date != "" && this.state.input_movie != -1&&this.state.input_exp != -1&&this.state.input_final!=-1?false:true}
                                            onClick = {()=>this.forceLoginFunction(this.state.input_final)}
                                        >
                                            Book Now
                                        </Button>
                                    </Col>
                                </Row>
                            </Nav>
                        </Col>
                    </Row>
                </Navbar>
            </>
        )
    }

    getSession(){
        const url = "/cinema_project/api/getCustSession";

        axios.get(url)
        .then(response => {
            if(response.data.success){
                this.setState({
                    isLogged:response.data.data.isLogged,
                    cust_id: response.data.data.cust_id
                })
            }
        })
        .catch(error => {
            alert("Error: "+error);
        })
    }

    getContent(){
        const url = "/cinema_project/api/getQuickBook";

        axios.get(url)
        .then(response => {
            var data = response.data.data;

            this.setState({
                date_list:data.dates,
                showing_list:data.showings,
                movie_list:data.movies,
                exp_list:data.exps,
            })
        })
        .catch(error => {
            alert("Error :"+error)
        })
    }

    printDateOptions(){
        if(this.state.date_list.length != 0 && this.state.showing_list.length != 0){
            return this.state.date_list.map((data)=>{
                return (
                    <option value={data.show_date}>{data.show_date}</option>
                )
            })
        }
    }

    printMovieOptions(){
        if(this.state.movie_list.length != 0 && this.state.showing_list.length != 0){
            return this.state.movie_list.map((data)=>{
                var isValid = false;
                this.state.showing_list.map((d)=>{
                    if(d.show_date == this.state.input_date && d.movie_id == data.movie_id)
                        isValid = true;
                })

                if(isValid)
                    return(<option value={data.movie_id}>{data.title}</option>)
            })
        }
    }

    printExpOptions(){
        if(this.state.exp_list.length != 0 && this.state.showing_list.length != 0){
            return this.state.exp_list.map((data)=>{
                var isValid=false;

                this.state.showing_list.map((d)=>{
                    if(d.show_date == this.state.input_date && d.movie_id == this.state.input_movie && d.exp_id == data.exp_id)
                        isValid = true;
                })

                if(isValid)
                    return(<option value={data.exp_id}>{data.name}</option>)
            })
        }
    }

    printTimeOptions(){
        if(this.state.showing_list.length != 0){
            return this.state.showing_list.map((data) => {
                if(data.show_date == this.state.input_date && data.movie_id == this.state.input_movie && data.exp_id == this.state.input_exp)
                    return(
                        <option value={data.showing_id}>{data.start_time.slice(0,-3)} - {data.end_time.slice(0,-3)}</option>
                    )
            })
        }
    }

    forceLoginFunction(id){
        if(this.state.isLogged){
            window.location.href = "/cinema_project/booking/" + id;
        }
        else{
            console.log("hi2")
            this.forceLogin();
        }
    }

    loginHandler(log,id){
        this.setState({
            isLogged:log,
            cust_id:id,
        });
    }
}