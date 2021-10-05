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
import Carousel from 'react-bootstrap/Carousel';
import CarouselItem from 'react-bootstrap/CarouselItem';

import CinemaNav from './CinemaNav';
import CinemaFooter from './CinemaFooter';

import QRCode from "react-qr-code";

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import * as Icons from '@fortawesome/free-solid-svg-icons';
import * as Brands from '@fortawesome/free-brands-svg-icons';
import axios from 'axios';

export default class CustBookingDetail extends Component{

    constructor(){
        super();
        this.state={
            isLogged:false,
            cust_id:-1,

            //page state

            //modal states

            //content lists
            booking_data:{
                "cust_id":-1,
                "date":"2021-08-25",
                "payment_id":-1,
                "total":0,
            },
            tickets:[],
            snacks:[],

            //data states
        }
        this.logHandler = this.loginHandler.bind(this);
    }

    componentDidMount(){
        this.getPaymentDetail();
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
                                <h3 className="font-weight-bold border-bottom border-dark mb-3">Booking Details</h3>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                {this.printContent()}
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
        });
    }

    getPaymentDetail(){
        const payment_id = this.props.match.params.id;
        const url = "/cinema_project/api/getPaymentDetail/"+payment_id;

        axios.get(url)
        .then(response => {
            var data = response.data.data;
            this.setState({
                booking_data:data.payment,
                tickets:data.tickets,
                snacks:data.snacks,
            })
        })
        .catch(error => {
            alert("Error :" +error);
        })
    }

    printContent(){
        return(
            <Row>
                <Col xs={12} md={8} id="detail_panel" className="h-100">
                    <Card>
                        <Card.Body>
                            <Row className="no-margin-padding mb-3">
                                <Col className="no-margin-padding"><h5 className="font-weight-bold">Tickets</h5></Col>
                            </Row>
                            <Row className="no-margin-padding">
                                <Col className="d-flex justify-content-center">
                                    <Carousel interval={null} indicators={false} className="h-100 w-100 content_carousel px-5">
                                        {this.printTickets()}
                                    </Carousel>
                                </Col> 
                            </Row>
                            {this.printSnacks()}
                        </Card.Body>
                    </Card>
                </Col>
                <Col xs={12} md={4} id="price_panel" className="h-100 pt-3 pt-md-0">
                    <Card>
                        <Card.Body>
                            <h5 className="font-weight-bold">Payment Summary</h5>
                            <Row>
                                {this.printTicketPrice()}
                            </Row>
                            {this.printSnackPrice()}
                        </Card.Body>
                        <hr className="divider"/>
                        <Card.Footer className="pricePanel_footer border-0">
                            <Row className="mt-2">
                                <Col>
                                    <h6 className="font-weight-bold">Subtotal</h6>
                                </Col>
                                <Col className="text-right">
                                    <h6 className="font-weight-bold">RM {Number.parseFloat(this.state.booking_data.total / 1.1).toFixed(2)}</h6>
                                </Col>
                            </Row>
                            <Row className="mb-3">
                                <Col>
                                    <h6 className="font-weight-bold">Total (incl. Tax)</h6>
                                </Col>
                                <Col className="text-right">
                                    <h6 className="font-weight-bold">RM {this.state.booking_data.total}</h6>
                                </Col>
                            </Row>
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>
        )
    }

    printTicketPrice(){
        if(this.state.tickets.length != 0){
            return (
                <>
                    <Col xs={6}>
                        <Card.Text><small>{this.state.tickets[0].name}</small></Card.Text>
                    </Col>
                    <Col xs={3}>
                        <InputGroup className="d-flex justify-content-center">
                            <Card.Text><small>x {this.state.tickets.length}</small></Card.Text>
                        </InputGroup>
                    </Col>
                    <Col xs={3} className="text-right">
                        <Card.Text><small>RM {Number.parseFloat(Number.parseFloat(this.state.tickets[0].price) * this.state.tickets.length).toFixed(2)}</small></Card.Text>
                    </Col>
                </>
            )
        }
    }

    printSnackPrice(){
        if(this.state.snacks.length != 0){
            return this.state.snacks.map((data,i)=>{
                return (
                    <Row>
                        <Col xs={6}>
                            <Card.Text><small>{data.name}</small></Card.Text>
                        </Col>
                        <Col xs={3}>
                            <InputGroup className="d-flex justify-content-center">
                                <Card.Text><small>x {data.qty}</small></Card.Text>
                            </InputGroup>
                        </Col>
                        <Col xs={3} className="text-right">
                            <Card.Text><small>RM {Number.parseFloat(data.price).toFixed(2)}</small></Card.Text>
                        </Col>
                    </Row>
                )
            })
        }
    }

    printTickets(){
        if(this.state.tickets.length != 0){
            return this.state.tickets.map((data)=>{
                return (
                    <CarouselItem>
                        <Card className="w-100">
                            <Card.Body className="ticket_body">
                                <Row className="ticket_bar">
                                    <Col className="bg-dark">
                                        <Card.Text className="text-light font-weight-bold text-center">MOVIE TICKET</Card.Text>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={10}>
                                        <Row className="mt-3">
                                            <Col><h5 className="font-weight-bold text-left">{data.name}</h5></Col>
                                        </Row>
                                        <Row className="mt-1">
                                            <Col xs={4} md={2} className="font-weight-bold">Hall  : {data.hall_id}</Col>
                                            <Col xs={4} md={2} className="font-weight-bold">Seat  : {data.seat_no}</Col>
                                        </Row>
                                        <Row>
                                            <Col className="font-weight-bold">Date  : {data.show_date}</Col>
                                        </Row>
                                        <Row>
                                            <Col className="font-weight-bold">Time  : {data.start_time.slice(0, -3)} - {data.end_time.slice(0, -3)}</Col>
                                        </Row>
                                        <Row>
                                            <Col className="font-weight-bold">Price : RM {Number.parseFloat(data.price).toFixed(2)}</Col>
                                        </Row>
                                        <Row className="mt-3 mb-2">
                                            <Col className="font-weight-bold">No. {data.ticket_id}</Col>
                                        </Row>
                                    </Col>
                                    <Col xs={2} className="border-left d-flex align-items-center justify-content-center">
                                        <div className="my-auto">
                                            <Row>
                                                <Col><h5 className="font-weight-bold no-margin-padding text-center">{data.seat_no}</h5></Col>
                                            </Row>
                                            <Row className="mt-3">
                                                <Col className="w-100"><QRCode value={"ticket_"+data.ticket_id} size={80}/></Col>
                                            </Row>
                                        </div>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </CarouselItem>
                )
            })
        }
    }

    printSnacks(){
        if(this.state.snacks.length != 0){
            return(
                <>
                    <Row className="no-margin-padding my-3">
                        <Col className="no-margin-padding"><h5 className="font-weight-bold">Purchased Snacks</h5></Col>
                    </Row>
                    <Row className="no-margin-padding">
                        <Col className="px-5">
                            <Table className="text-center" bordered hover striped>
                                <thead className="bg-warning">
                                    <th>Item</th>
                                    <th>Qty.</th>
                                    <th>Price</th>
                                </thead>
                                <tbody>
                                    {this.state.snacks.map((data) => {
                                        return (
                                            <tr>
                                                <td>{data.name}</td>
                                                <td>{data.qty}</td>
                                                <td>RM {data.price}</td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                </>
            )
        }
    }
}