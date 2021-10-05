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
import Image from 'react-bootstrap/Image';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';

import CinemaNav from './CinemaNav';
import CinemaFooter from './CinemaFooter';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import * as Icons from '@fortawesome/free-solid-svg-icons';
import * as Brands from '@fortawesome/free-brands-svg-icons';
import axios from 'axios';

export default class CustBooking extends Component{

    constructor(){
        super();
        this.state={
            isLogged:false,
            cust_id:-1,

            //page state

            //modal states

            //content lists
            booking_list:[],

            //data states
        }
        this.logHandler = this.loginHandler.bind(this);
    }

    componentDidMount(){
        
    }

    render(){
        return(
            <Container fluid className="no-margin-padding bg-light">
                <Row className="no-margin-padding">
                    <CinemaNav loginHandler={this.logHandler}/>
                </Row>

                <Row className="no-margin-padding cust_content mDetail_margin_padding">
                    <Col className="no-margin-padding moviesList_container">
                        <Row>
                            <Col>
                                <h3 className="font-weight-bold border-bottom border-dark mb-3">My Bookings</h3>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Table bordered striped hover className="text-center mt-3">
                                    <thead className="bg-warning text-dark">
                                        <th>Booking No.</th>
                                        <th>Booking Date</th>
                                        <th>Total (RM)</th>
                                        <th>More Info</th>
                                    </thead>
                                    <tbody>
                                        {this.printBookings()}
                                    </tbody>
                                </Table>
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
        },()=>{
            if(!this.state.isLogged)
                window.location.href = "/cinema_project/";
            else
                this.getBookings();
        });
    }

    printBookings(){
        if(this.state.booking_list.length != 0){
            return this.state.booking_list.map((data)=>{
                return (
                    <tr>
                        <td>{data.payment_id}</td>
                        <td>{data.date}</td>
                        <td>{data.total}</td>
                        <td>
                            <Button
                                variant="info"
                                size="sm"
                                href={"/cinema_project/custBookingDetail/"+data.payment_id}
                            >
                                <FontAwesomeIcon icon={Icons.faInfoCircle}/>
                            </Button>
                        </td>
                    </tr>
                )
            })
        }
        else{
            return(
                <tr className="h-100">
                    <td colSpan={4}>No Prior Bookings Found</td>
                </tr>
            )
        }
    }

    getBookings(){
        const cust_id = this.state.cust_id;
        const url = "/cinema_project/api/getPayments/" + cust_id;

        axios.get(url)
        .then(response => {
            this.setState({
                booking_list:response.data.data
            },()=>{console.log(this.state.booking_list)})
        })
        .catch(error => {
            alert("Error: "+error);
        })
    }
}