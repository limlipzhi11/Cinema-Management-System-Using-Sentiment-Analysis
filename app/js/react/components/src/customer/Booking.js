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
import NavbarCollapse from 'react-bootstrap/esm/NavbarCollapse';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

export default class Booking extends Component{

    constructor(){
        super();
        this.state={
            isLogged:false,
            cust_id:-1,

            //page state
            stage:"booking",

            //modal states

            //content lists
            showing_data:{
                "showing_id":0,
                "hall_id":0,
                "schedule_id":0,
                "exp_id":0,
                "movie_id":0,
                "duration":120,
                "name": "Showing Name",
                "price":0,
                "start_time":"00:00:00",
                "end_time":"00:00:00",
                "show_date":"00-00-0000",
                "enabled_by":"00-00-0000",
                "seating":[],
                "num_seats":96,
            },
            tickets:[],
            purchased_snacks:[],
            snack_list:[],

            //data states
            subtotal:0,
            ticket_qty:1,
            toSelect:1,
        }
        this.logHandler = this.loginHandler.bind(this);
    }

    componentDidMount(){
        this.getShowing();
        this.getSnacks();
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
                                <h3 className="font-weight-bold border-bottom border-dark mb-3">Ticket Booking</h3>
                            </Col>
                        </Row>
                        {this.printContent()}
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

    getShowing(){
        const showing_id = this.props.match.params.id;
        const url = "/cinema_project/api/getShowing/"+showing_id;

        axios.get(url)
        .then(response => {
            this.setState({
                showing_data:response.data.data,
                subtotal:Number.parseFloat(response.data.data.price),
            })
        })
        .catch(error => {
            alert("Error :" + error)
        })
    }

    printContent(){
        if(this.state.stage == "booking"){
            return(
                this.printBooking()
            )
        }
        else if(this.state.stage == "snacks"){
            return this.printSnacks()
        }
        else if(this.state.stage == "payment"){
            return this.printPayment()
        }
        else if(this.state.stage == "completed"){
            return this.printCompleted()
        }
    }

    printBooking(){
        return (
            <Row>
                <Col xs={12} md={8} id="detail_panel" className="h-100">
                    <Card>
                        <Card.Body>
                            <h5 className="font-weight-bold">Seats</h5>
                            <Table borderless responsive className="seating_table mx-auto mt-3">
                                <tbody>
                                    <tr>
                                        <td colspan={14} className="bg-info text-light">Screen</td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                    </tr>
                                    {this.printSeating()}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xs={12} md={4} id="price_panel" className="h-100 pt-3 pt-md-0">
                    <Card>
                        <Card.Body>
                            <h5 className="font-weight-bold">Total</h5>
                            <Row>
                                <Col xs={6}>
                                    <Card.Text><small>{this.state.showing_data.name}</small></Card.Text>
                                </Col>
                                <Col xs={3}>
                                    <InputGroup className="d-flex justify-content-center">
                                        <Button variant="outline-secondary" className="no-right-radius qty_control_btn" size="sm" onClick={()=>this.decTicket()}>
                                            -
                                        </Button>
                                        <FormControl
                                            type="number"
                                            readOnly
                                            className="qty_control text-center"
                                            size="sm"
                                            min={1}
                                            max={99}
                                            step={1}
                                            value={this.state.ticket_qty}
                                        />
                                        <Button variant="outline-secondary" className="no-left-radius qty_control_btn" size="sm" onClick={()=>this.incTicket()}>
                                            +
                                        </Button>
                                    </InputGroup>
                                </Col>
                                <Col xs={3} className="text-right">
                                    <Card.Text><small>RM {(this.state.showing_data.price*this.state.ticket_qty).toFixed(2)}</small></Card.Text>
                                </Col>
                            </Row>
                            {this.printSnackPrices()}
                        </Card.Body>
                        <hr className="divider"/>
                        <Card.Footer className="pricePanel_footer border-0">
                            <Row className="mt-2">
                                <Col>
                                    <h6 className="font-weight-bold">Subtotal</h6>
                                </Col>
                                <Col className="text-right">
                                    <h6 className="font-weight-bold">RM {Number.parseFloat(this.state.subtotal).toFixed(2)}</h6>
                                </Col>
                            </Row>
                            <Row className="mb-3">
                                <Col>
                                    <h6 className="font-weight-bold">Total (incl. Tax)</h6>
                                </Col>
                                <Col className="text-right">
                                    <h6 className="font-weight-bold">RM {Number.parseFloat(Number.parseFloat(this.state.subtotal)+(Number.parseFloat(this.state.subtotal)*0.1)).toFixed(2)}</h6>
                                </Col>
                            </Row>
                            <Row className="mb-2">
                                <Col>
                                    <Button
                                        variant="warning"
                                        className="font-weight-bold w-100"
                                        disabled = {this.state.toSelect != 0?true:false}
                                        title = {this.state.toSelect != 0?"Please finish selecting your seats":""}
                                        onClick= {()=>this.nextStage()}
                                    >
                                        <FontAwesomeIcon className="btnIcon" icon={Icons.faArrowCircleRight}/>
                                        Proceed to Browse Snacks
                                    </Button>
                                </Col>
                            </Row>
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>
        )
    }

    incTicket(){
        if(this.state.ticket_qty+1 <= this.state.showing_data.num_seats){
            this.setState({
                ticket_qty:this.state.ticket_qty+1,
                toSelect:this.state.toSelect+1,
                subtotal:Number.parseFloat(this.state.subtotal)+Number.parseFloat(this.state.showing_data.price),
            })
        }
    }

    decTicket(){
        if(this.state.ticket_qty-1 > 0){
            this.setState({
                ticket_qty:this.state.ticket_qty-1,
                toSelect:this.state.toSelect-1,
                subtotal:Number.parseFloat(this.state.subtotal)-Number.parseFloat(this.state.showing_data.price),
            },()=>{
                if(this.state.tickets.length > this.state.ticket_qty){
                    var list = this.state.tickets;
                    var tmp = list.pop();

                    var data = this.state.showing_data;
                    data.seating[tmp.row][tmp.col] = 0;

                    this.setState({
                        tickets:list,
                        showing_data:data,
                        toSelect:this.state.toSelect+1,
                    })
                }
            })
        }
    }

    printSeating(){
        if(this.state.showing_data.seating.length != 0){
            return this.state.showing_data.seating.map((data,row)=>{
                var tmp = [];
                data.map((d,col)=>{

                    if(col == 2 || col == 10)
                    tmp.push(
                        <td className="walkway"></td>
                    )
                    if(d == 0){
                        tmp.push(
                            <td>
                                <Button
                                    onClick={()=>this.chooseSeat(String.fromCharCode(row + 65)+(col+1),row,col)}
                                >
                                    {String.fromCharCode(row + 65)+(col+1)}
                                </Button>
                            </td>
                        )
                    }
                    else if (d == 1){
                        tmp.push(
                            <td>
                                <Button
                                    disabled
                                    variant="danger"
                                >
                                    {String.fromCharCode(row + 65)+(col+1)}
                                </Button>
                            </td>
                        )
                    }
                    else if (d == 2){
                        tmp.push(
                            <td>
                                <Button
                                    variant="warning"
                                    onClick={()=>this.chooseSeat(String.fromCharCode(row + 65)+(col+1),row,col)}
                                >
                                    {String.fromCharCode(row + 65)+(col+1)}
                                </Button>
                            </td>
                        )
                    }
                })

                return(
                    <tr>
                        {tmp}
                    </tr>
                )
            })
        }
    }

    chooseSeat(seat_no,row,col){
        if(this.state.showing_data.seating[row][col]==0 && this.state.toSelect > 0){
            var data = this.state.showing_data;
            data.seating[row][col]=2;

            var tickets = this.state.tickets;
            tickets.push({
                "hall_id":this.state.showing_data.hall_id,
                "showing_id":this.state.showing_data.showing_id,
                "seat_no":seat_no,
                "price":this.state.showing_data.price,
                "row":row,
                "col":col,
            })

            this.setState({
                toSelect:this.state.toSelect-1,
                showing_data:data,
                tickets:tickets,
            })
        }
        else if(this.state.showing_data.seating[row][col]==2 && this.state.toSelect <= this.state.ticket_qty){
            var data = this.state.showing_data;
            data.seating[row][col]=0;

            var tickets = this.state.tickets;
            var index = 0;
            tickets.map((data,i)=>{
                if(data.seat_no == seat_no)
                    index=i;
            })
            tickets.splice(index,1);

            this.setState({
                toSelect:this.state.toSelect+1,
                showing_data:data,
                tickets:tickets,
            })
        }
    }

    nextStage(){
        if(this.state.stage == "booking")
            this.setState({stage: "snacks"})
        else if(this.state.stage == "snacks")
            this.setState({stage:"payment"})
    }

    prevStage(){
        if(this.state.stage == "snacks")
            this.setState({stage: "booking"})
        else if(this.state.stage == "payment")
            this.setState({stage:"snacks"})
    }

    getSnacks(){
        const url = "/cinema_project/api/getSnacks";

        axios.get(url)
        .then(response => {
            this.setState({
                snack_list:response.data.data
            })
        })
        .catch(error => {
            alert("Error: "+error)
        })
    }

    printSnacks(){
        return (
            <Row>
                <Col xs={12} md={8} id="detail_panel" className="h-100">
                    <Card>
                        <Card.Body>
                            <Row className="no-margin-padding">
                                <Col className="no-margin-padding"><h5 className="font-weight-bold">Snacks</h5></Col>
                                <Col className="no-margin-padding text-right">
                                    <Button
                                        variant = "muted"
                                        className = "font-weight-bold ml-auto my-auto text-secondary"
                                        onClick = {()=>this.prevStage()}
                                    >
                                        <FontAwesomeIcon className="btnIcon" icon={Icons.faArrowLeft}/>
                                        Back to Seating
                                    </Button>
                                </Col>
                            </Row>
                            <Row className="no-margin-padding">
                                {this.printSnackList()}
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xs={12} md={4} id="price_panel" className="h-100 pt-3 pt-md-0">
                    <Card>
                        <Card.Body>
                            <h5 className="font-weight-bold">Total</h5>
                            <Row>
                                <Col xs={6}>
                                    <Card.Text><small>{this.state.showing_data.name}</small></Card.Text>
                                </Col>
                                <Col xs={3}>
                                    <InputGroup className="d-flex justify-content-center">
                                        <Card.Text><small>x {this.state.ticket_qty}</small></Card.Text>
                                    </InputGroup>
                                </Col>
                                <Col xs={3} className="text-right">
                                    <Card.Text><small>RM {(this.state.showing_data.price*this.state.ticket_qty).toFixed(2)}</small></Card.Text>
                                </Col>
                            </Row>
                            {this.printSnackPrices()}
                        </Card.Body>
                        <hr className="divider"/>
                        <Card.Footer className="pricePanel_footer border-0">
                            <Row className="mt-2">
                                <Col>
                                    <h6 className="font-weight-bold">Subtotal</h6>
                                </Col>
                                <Col className="text-right">
                                    <h6 className="font-weight-bold">RM {Number.parseFloat(this.state.subtotal).toFixed(2)}</h6>
                                </Col>
                            </Row>
                            <Row className="mb-3">
                                <Col>
                                    <h6 className="font-weight-bold">Total (incl. Tax)</h6>
                                </Col>
                                <Col className="text-right">
                                    <h6 className="font-weight-bold">RM {Number.parseFloat(Number.parseFloat(this.state.subtotal)+(Number.parseFloat(this.state.subtotal)*0.1)).toFixed(2)}</h6>
                                </Col>
                            </Row>
                            <Row className="mb-2">
                                <Col>
                                    <Button
                                        variant="warning"
                                        className="font-weight-bold w-100"
                                        onClick = {()=>this.nextStage()}
                                    >
                                        <FontAwesomeIcon className="btnIcon" icon={Icons.faShoppingCart}/>
                                        Proceed to Payment
                                    </Button>
                                </Col>
                            </Row>
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>
        )
    }

    printSnackList(){
        if(this.state.snack_list.length != 0){
            return this.state.snack_list.map((data,i)=>{
                return (
                    <Col xs={4} md={3} className="pt-3">
                        <Card className="shadow">
                            <Card.Img variant="top" src={data.img} className="booking_snack_img"/>
                            <Card.Body>
                                <h6 className="font-weight-bold">{data.name}</h6>
                                <Card.Text><small>RM {data.price}</small></Card.Text>
                            </Card.Body>
                            <Card.Footer className="border-0 pricePanel_footer pt-0">
                                <InputGroup className="d-flex justify-content-center">
                                    <Button variant="outline-secondary" className="no-right-radius qty_control_btn" size="sm" onClick={()=>this.decSnack(data.snack_id,data.price,i)}>
                                        -
                                    </Button>
                                    <FormControl
                                        id={"snack_qty_"+i}
                                        type="number"
                                        readOnly
                                        className="qty_control text-center"
                                        size="sm"
                                        min={1}
                                        max={99}
                                        step={1}
                                        defaultValue={this.getSnackQty(data.snack_id)}
                                    />
                                    <Button variant="outline-secondary" className="no-left-radius qty_control_btn" size="sm" onClick={()=>this.incSnack(data.snack_id,data.name,data.price,i)}>
                                        +
                                    </Button>
                                </InputGroup>
                            </Card.Footer>
                        </Card>
                    </Col>
                )
            })
        }
        else{
            return (
                <Col className="w-100 text-center">
                    No Snacks Available.
                </Col>
            )
        }
    }

    getSnackQty(id){
        if(this.state.purchased_snacks.length != 0){
            var tmp = this.state.purchased_snacks;
            var qty = 0
            
            tmp.map((data,i)=>{
                if(data.snack_id == id)
                    qty=data.qty
            })

            return qty
        }
        else{
            return 0
        }
    }

    incSnack(id,name,price,i){
        var isExists = false;
        var index = -1;
        var isNew = false;

        if(this.state.purchased_snacks.length != 0){
            this.state.purchased_snacks.map((data,i)=>{
                if(data.snack_id == id){
                    isExists=true
                    index = i
                }
            })
        }

        var tmp = this.state.purchased_snacks;
        if(isExists){
            if(this.state.purchased_snacks[index].qty+1<100){
                tmp[index].qty += 1;
                tmp[index].price = price * tmp[index].qty;
            }
        }
        else{
            tmp.push({
                "snack_id":id,
                "name":name,
                "qty":1,
                "price":price,
            })
            isNew  = true
        }
        this.setState({
            purchased_snacks:tmp,
            subtotal:Number.parseFloat(this.state.subtotal)+Number.parseFloat(price),
        },()=>{
            if(isExists)
                document.getElementById('snack_qty_'+i).value = tmp[index].qty
            else if(isNew)
                document.getElementById('snack_qty_'+i).value = tmp[tmp.length-1].qty
        })
    }

    decSnack(id,price,i){
        var isExists = false;
        var index = -1;

        if(this.state.purchased_snacks.length != 0){
            this.state.purchased_snacks.map((data,i)=>{
                if(data.snack_id == id){
                    isExists=true
                    index = i
                }
            })
        }
        var tmp = this.state.purchased_snacks;
        if(isExists){
            if(this.state.purchased_snacks[index].qty-1>0){
                tmp[index].qty -= 1;
                tmp[index].price = price * tmp[index].qty;
            }
            else if(this.state.purchased_snacks[index].qty-1==0){
                tmp.splice(index,1)
                isExists=false
            }
            this.setState({
                purchased_snacks:tmp,
                subtotal:Number.parseFloat(this.state.subtotal)-Number.parseFloat(price),
            },()=>{
                if(isExists)
                    document.getElementById('snack_qty_'+i).value = tmp[index].qty
                else
                    document.getElementById('snack_qty_'+i).value = 0
            })
        }
    }

    printSnackPrices(){
        if(this.state.purchased_snacks.length != 0){
            return this.state.purchased_snacks.map((data,i)=>{
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

    printPayment(){
        return (
            <Row>
            <Col xs={12} md={8} id="detail_panel" className="h-100">
                <Card>
                    <Card.Body>
                        <Row className="no-margin-padding">
                            <Col className="no-margin-padding"><h5 className="font-weight-bold">Payment</h5></Col>
                            <Col className="no-margin-padding text-right">
                                <Button
                                    variant = "muted"
                                    className = "font-weight-bold ml-auto my-auto text-secondary"
                                    onClick = {()=>this.prevStage()}
                                >
                                    <FontAwesomeIcon className="btnIcon" icon={Icons.faArrowLeft}/>
                                    Back to Snacks
                                </Button>
                            </Col>
                        </Row>
                        <Row className="no-margin-padding">
                            <Col className="d-flex justify-content-center px-5">
                                <PayPalScriptProvider
                                    options={{
                                        "client-id": "Afxsd5Ukh9kH0gJu1bBFX-vwCH3MbP3jk3wmNGhm0JwuKM7NNI8MmyslwfJA90Cw_2uwvzqKDIAH2a5A" ,
                                        "currency":"MYR",
                                        "locale":"en_MY",
                                    }}
                                >
                                    <PayPalButtons 
                                        style={{
                                            layout: "vertical"
                                        }}
                                        createOrder={(data, actions) => {
                                            return actions.order.create({
                                                purchase_units: [
                                                    {
                                                        amount: {
                                                            value: Number.parseFloat(Number.parseFloat(this.state.subtotal)+(Number.parseFloat(this.state.subtotal)*0.1)).toFixed(2),
                                                        },
                                                    },
                                                ],
                                                application_context: {
                                                    shipping_preference:"NO_SHIPPING"
                                                }
                                            })
                                        }}
                                        onApprove={()=>{this.paymentSuccess()}}
                                        options={{
                                            "NOSHIPPING":1,
                                        }}
                                        className="w-50"
                                    />
                                </PayPalScriptProvider>
                            </Col>
                        </Row>
                        <hr className="divider"/>
                        <Row className="mt-3">
                            <Col className="d-flex align-items-middle justify-content-center">
                                <span className="text-right font-weight-bold mr-2 my-auto">We Accept</span>
                                <FontAwesomeIcon className="mr-2 fa-2x my-auto" icon={Brands.faCcVisa}/>
                                <FontAwesomeIcon className="mr-2 fa-2x my-auto" icon={Brands.faCcMastercard}/>
                                <FontAwesomeIcon className="mr-2 fa-2x my-auto" icon={Brands.faCcPaypal}/>
                                <FontAwesomeIcon className="mr-2 fa-2x my-auto" icon={Brands.faCcDinersClub}/>
                                <FontAwesomeIcon className="mr-2 fa-2x my-auto" icon={Brands.faCcDiscover}/>
                                <FontAwesomeIcon className="mr-2 fa-2x my-auto" icon={Brands.faCcJcb}/>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Col>
            <Col xs={12} md={4} id="price_panel" className="h-100 pt-3 pt-md-0">
                <Card>
                    <Card.Body>
                        <h5 className="font-weight-bold">Total</h5>
                        <Row>
                            <Col xs={6}>
                                <Card.Text><small>{this.state.showing_data.name}</small></Card.Text>
                            </Col>
                            <Col xs={3}>
                                <InputGroup className="d-flex justify-content-center">
                                    <Card.Text><small>x {this.state.ticket_qty}</small></Card.Text>
                                </InputGroup>
                            </Col>
                            <Col xs={3} className="text-right">
                                <Card.Text><small>RM {(this.state.showing_data.price*this.state.ticket_qty).toFixed(2)}</small></Card.Text>
                            </Col>
                        </Row>
                        {this.printSnackPrices()}
                    </Card.Body>
                    <hr className="divider"/>
                    <Card.Footer className="pricePanel_footer border-0">
                        <Row className="mt-2">
                            <Col>
                                <h6 className="font-weight-bold">Subtotal</h6>
                            </Col>
                            <Col className="text-right">
                                <h6 className="font-weight-bold">RM {Number.parseFloat(this.state.subtotal).toFixed(2)}</h6>
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <Col>
                                <h6 className="font-weight-bold">Total (incl. Tax)</h6>
                            </Col>
                            <Col className="text-right">
                                <h6 className="font-weight-bold">RM {Number.parseFloat(Number.parseFloat(this.state.subtotal)+(Number.parseFloat(this.state.subtotal)*0.1)).toFixed(2)}</h6>
                            </Col>
                        </Row>
                    </Card.Footer>
                </Card>
            </Col>
        </Row>
        )
    }

    paymentSuccess(){
        console.log("approved");

        var tmp_showing = this.state.showing_data;
        var tmp_seating = tmp_showing.seating;
        var tmp_tickets = this.state.tickets;

        tmp_tickets.map((data)=>{
            if(tmp_seating[data.row][data.col] == 2)
                tmp_seating[data.row][data.col] = 1
        })

        tmp_showing.num_seats-=tmp_tickets.length;

        const url = "/cinema_project/api/paymentSuccess"
        const formData = new FormData();

        formData.append('showing_id',this.state.showing_data.showing_id)
        formData.append('seating',JSON.stringify(this.state.showing_data.seating))
        formData.append('num_seats',this.state.showing_data.num_seats)
        formData.append('tickets',JSON.stringify(this.state.tickets))
        formData.append('snacks',JSON.stringify(this.state.purchased_snacks))
        formData.append('total',Number.parseFloat(Number.parseFloat(this.state.subtotal)+(Number.parseFloat(this.state.subtotal)*0.1)).toFixed(2))
        formData.append('cust_id', this.state.cust_id);

        axios.post(url,formData)
        .then(response => {
            this.setComplete();
        })
        .catch(error => {
            alert("Error: "+error);
        })
    }

    setComplete(){
        this.setState({
            stage:"completed"
        })
    }

    printCompleted(){
        return(
            <Row>
                <Col xs={12} md={8} id="detail_panel" className="h-100">
                    <Card>
                        <Card.Body>
                            <Row className="no-margin-padding">
                                <Col className="no-margin-padding"><h5 className="font-weight-bold">Payment Successful!</h5></Col>
                            </Row>
                            <Row className="no-margin-padding">
                                <Col className="d-flex justify-content-center px-5">
                                    <Image className="w-25" src="/cinema_project/public/img/success.gif"/>
                                </Col> 
                            </Row>
                            <Row className="no-margin-padding">
                                <Col className="d-flex justify-content-center px-5">
                                    <h3>Payment Successful!</h3>
                                </Col> 
                            </Row>
                            <Row className="no-margin-padding">
                                <Col className="d-flex justify-content-center px-5 mt-3">
                                    <Button variant="warning" href="/cinema_project/">
                                        <FontAwesomeIcon className="btnIcon" icon={Icons.faHome}/>
                                        <b>Back to Home</b>
                                    </Button>
                                </Col> 
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xs={12} md={4} id="price_panel" className="h-100 pt-3 pt-md-0">
                    <Card>
                        <Card.Body>
                            <h5 className="font-weight-bold">Total</h5>
                            <Row>
                                <Col xs={6}>
                                    <Card.Text><small>{this.state.showing_data.name}</small></Card.Text>
                                </Col>
                                <Col xs={3}>
                                    <InputGroup className="d-flex justify-content-center">
                                        <Card.Text><small>x {this.state.ticket_qty}</small></Card.Text>
                                    </InputGroup>
                                </Col>
                                <Col xs={3} className="text-right">
                                    <Card.Text><small>RM {(this.state.showing_data.price*this.state.ticket_qty).toFixed(2)}</small></Card.Text>
                                </Col>
                            </Row>
                            {this.printSnackPrices()}
                        </Card.Body>
                        <hr className="divider"/>
                        <Card.Footer className="pricePanel_footer border-0">
                            <Row className="mt-2">
                                <Col>
                                    <h6 className="font-weight-bold">Subtotal</h6>
                                </Col>
                                <Col className="text-right">
                                    <h6 className="font-weight-bold">RM {Number.parseFloat(this.state.subtotal).toFixed(2)}</h6>
                                </Col>
                            </Row>
                            <Row className="mb-3">
                                <Col>
                                    <h6 className="font-weight-bold">Total (incl. Tax)</h6>
                                </Col>
                                <Col className="text-right">
                                    <h6 className="font-weight-bold">RM {Number.parseFloat(Number.parseFloat(this.state.subtotal)+(Number.parseFloat(this.state.subtotal)*0.1)).toFixed(2)}</h6>
                                </Col>
                            </Row>
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>
        )
    }
}