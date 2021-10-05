import React,{Component} from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import InputGroup from 'react-bootstrap/InputGroup';

import Session from './Session';
import SideNav from './SideNav';

import styles from './css/common/common.css';
import Button from 'react-bootstrap/esm/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';

import {Line, Bar} from 'react-chartjs-2';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import * as Icons from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

export default class Dashboard extends Component{

    constructor(){
        super();
        this.state={
            //session state variables
            isLogged:false,
            id:0,
            admin_group:0,

            //modal states
            show_loadModal:false,

            //content list
            profit_data:[],
            movie_sales_data:[],
            snack_sales_data:[],
            ticket_sales_data:[],
            suggestion:[],
            others:{},
            movie_list:[],

            //alert states
            show_alert:false,
            alert_variant:"",
            alert_heading:"",
            alert_msg:"",

            //input states
            snack_d_start:"0000-00-00",
            snack_d_end:"0000-00-00",
            movie_1:-1,
            movie_2:-1,
        }
    }

    componentDidMount(){
        this.getDashboardData();
        this.getSnackSales();
        this.getMovieSales();
        this.getMovies();
        this.getSuggestions();
    }

    render(){
        return(
            <Container fluid className="no-margin-padding bg-light">
                <Row className="wrapper">

                    <SideNav selected={location.pathname}/>
                    
                    <Col id="content">
                        {this.alertMessage()}
                        <Row id="pageHeader">
                            <Col className="no-margin-padding">
                                <div>DASHBOARD</div>
                            </Col>
                        </Row>
                        <Row id="pageContent" className="no-margin-padding dashboard-content">
                            <Col className="no-margin-padding">
                                {this.printData()}
                            </Col>
                        </Row>
                    </Col> 

                    {this.loadingModal()}

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

    loadingModal(){
        return(
            <Modal
                id="loading"
                show={this.state.show_loadModal}
                onHide={()=>this.hideLoadModal()}
                backdrop="static"
                keyboard={false}
                centered
                size="sm"
            >
                <Modal.Body>
                    <Spinner animation="border" variant="warning"></Spinner>
                </Modal.Body>
            </Modal>
        )
    }

    hideLoadModal(){
        this.setState({
            show_loadModal:false
        })
    }

    showLoadModal(){
        this.setState({
            show_loadModal:true
        })
    }

    getDashboardData(){
        const url = "/cinema_project/api/admin/getDashboardData";

        axios.get(url)
        .then(response => {
            var data = response.data.data;

            this.setState({
                profit_data:data.profit,
                ticket_sales_data:data.ticket_sales,
                others:data.others,
            })
        })
        .catch(error => {
            alert("Error: "+error);
        })
    }

    getSnackSales(){
        const url = "/cinema_project/api/admin/getSnackSales";
        const formData = new FormData();

        if(this.state.snack_d_start != "0000-00-00")
            formData.append('snack_start',this.state.snack_d_start)
        if(this.state.snack_d_end != "0000-00-00")
            formData.append('snack_end',this.state.snack_d_end)

        axios.post(url,formData)
        .then(response => {
            var data = response.data.data;

            this.setState({
                snack_sales_data:data.snack_sales,
            })
        })
        .catch(error => {
            alert("Error: "+error);
        })
    }

    getMovieSales(){
        const url = "/cinema_project/api/admin/getMovieSales";
        const formData = new FormData();

        if(this.state.movie_1!=-1 && this.state.movie_2!=-1){
            formData.append('m1',this.state.movie_1)
            formData.append('m2',this.state.movie_2)
        }

        axios.post(url,formData)
        .then(response => {
            var data = response.data.data;

            this.setState({
                movie_sales_data:data.movie_sales,
            })
        })
        .catch(error => {
            alert("Error: "+error);
        })
    }

    printData(){
        return(
            <>
                <Row>
                    {this.printOthers()}
                </Row>
                <Row className="mt-5">
                    <Col xs={12}>
                        {this.printSuggestions()}
                    </Col>
                </Row>
                <Row className="mt-3">
                    <Col xs={12}>
                        {this.printMovieSales()}
                    </Col>
                </Row>
                <Row className="mt-3">
                    <Col xs={12} className="pt-xs-3 pt-lg-0">
                        {this.printSnackSales()}
                    </Col>
                </Row>
                <Row className="mt-3">
                    <Col xs={12}>
                        {this.printProfit()}
                    </Col>
                </Row>
                <Row className="mt-3">
                    <Col xs={12}>
                        {this.printTicketSales()}
                    </Col>
                </Row>
            </>
        )
    }

    printOthers(){
        if(this.state.others.length != 0){
            return(
                <>
                    <Col>
                        <Card className="w-100 h-100 shadow">
                            <Card.Body>
                                <Row>
                                    <Col className="d-flex justify-content-center align-items-center text-primary">
                                        <FontAwesomeIcon icon={Icons.faUserCircle} className="fa-3x"/>
                                    </Col>
                                    <Col>
                                        <Row>
                                            <Col className="font-weight-bold">{this.state.others.cust_count}</Col>
                                        </Row>
                                        <Row>
                                            <Col><Card.Text className="font-weight-bold"><small>Total Users</small></Card.Text></Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col>
                        <Card className="w-100 h-100 shadow">
                            <Card.Body>
                                <Row>
                                    <Col className="d-flex justify-content-center align-items-center text-secondary">
                                        <FontAwesomeIcon icon={Icons.faUtensils} className="fa-3x"/>
                                    </Col>
                                    <Col>
                                        <Row>
                                            <Col className="font-weight-bold">{this.state.others.snacks_sold}</Col>
                                        </Row>
                                        <Row>
                                            <Col><Card.Text className="font-weight-bold"><small>Snacks Sold</small></Card.Text></Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col>
                        <Card className="w-100 h-100 shadow">
                            <Card.Body>
                                <Row>
                                    <Col className="d-flex justify-content-center align-items-center text-info">
                                        <FontAwesomeIcon icon={Icons.faTicketAlt} className="fa-3x"/>
                                    </Col>
                                    <Col>
                                        <Row>
                                            <Col className="font-weight-bold">{this.state.others.tickets_sold}</Col>
                                        </Row>
                                        <Row>
                                            <Col><Card.Text className="font-weight-bold"><small>Tickets Sold</small></Card.Text></Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col>
                        <Card className="w-100 h-100 shadow">
                            <Card.Body>
                                <Row>
                                    <Col className="d-flex justify-content-center align-items-center text-success">
                                        <FontAwesomeIcon icon={Icons.faDollarSign} className="fa-3x"/>
                                    </Col>
                                    <Col>
                                        <Row>
                                            <Col className="font-weight-bold">RM {this.state.others.total_profit}</Col>
                                        </Row>
                                        <Row>
                                            <Col><Card.Text className="font-weight-bold"><small>Total Profit</small></Card.Text></Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </>
            )
        }
    }

    printMovieSales(){
        if(this.state.movie_sales_data.length != 0){
            const data = {
                labels: this.state.movie_sales_data.labels,
                datasets:[{
                    label: 'Tickets Sold',
                    data: this.state.movie_sales_data.data,
                    backgroundColor:[
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                    ],
                    borderColor:[
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                    ],
                    borderWidth:1,
                }]
            }

            const options = {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                        }
                    }]
                },
            }

            return (
                <Card>
                    <Card.Body>
                        <Row>
                            <Col xs={12} lg={3} className="my-auto"><h5 className="font-weight-bold no-margin-padding">Movie Sales</h5></Col>
                            <Col className="my-auto">
                                <InputGroup>
                                    <InputGroup.Text className="border-0 bg-white pl-0">Compare</InputGroup.Text>
                                    <Form.Control
                                        as="select"
                                        value={this.state.movie_1}
                                        onChange={(e)=>this.setState({movie_1:e.target.value},()=>this.getMovieSales())}
                                    >
                                        <option value={-1} disabled>Movie 1</option>
                                        {this.printOptions()}
                                    </Form.Control>
                                    <InputGroup.Text className="border-0 bg-white pl-1">With</InputGroup.Text>
                                    <Form.Control
                                        as="select"
                                        value={this.state.movie_2}
                                        onChange={(e)=>this.setState({movie_2:e.target.value},()=>this.getMovieSales())}
                                    >
                                        <option value={-1} disabled>Movie 2</option>
                                        {this.printOptions()}
                                    </Form.Control>
                                </InputGroup>
                            </Col>
                        </Row>
                        <Bar data={data} options={options}/>
                    </Card.Body>
                </Card>
            )
        }
    }

    printSnackSales(){
        if(this.state.snack_sales_data.length != 0){
            const data = {
                labels: this.state.snack_sales_data.labels,
                datasets:[{
                    label: 'Units Sold',
                    data: this.state.snack_sales_data.data,
                    backgroundColor:[
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                    ],
                    borderColor:[
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                    ],
                    borderWidth:1,
                }]
            }

            const options = {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                        }
                    }]
                }
            }

            return (
                <Card>
                    <Card.Body>
                        <Row>
                            <Col xs={12} lg={3} className="my-auto"><h5 className="font-weight-bold no-margin-padding">Snack Sales</h5></Col>
                            <Col className="my-auto">
                                <InputGroup>
                                    <InputGroup.Text className="border-0 bg-white pl-0">From</InputGroup.Text>
                                    <Form.Control
                                        type="date"
                                        value={this.state.snack_d_start}
                                        onChange={(e)=>{this.setState({snack_d_start:e.target.value,snack_d_end:e.target.value},()=>this.getSnackSales())}}
                                        max={this.getDate()}
                                    />
                                    <InputGroup.Text className="border-0 bg-white pl-1">To</InputGroup.Text>
                                    <Form.Control
                                        type="date"
                                        value={this.state.snack_d_end}
                                        onChange={(e)=>{this.setState({snack_d_end:e.target.value},()=>this.getSnackSales())}}
                                        max={this.getDate()}
                                        min = {this.state.snack_d_start}
                                    />
                                </InputGroup>
                            </Col>
                        </Row>
                        <Bar data={data} options={options}/>
                    </Card.Body>
                </Card>
            )
        }
    }

    printProfit(){
        if(this.state.profit_data.length != 0){
            const data = {
                labels: this.state.profit_data.labels,
                datasets:[]
            }
            for(var i=0;i<5;i++){
                var y = new Date().getFullYear();
                y =  y-i;

                var tmp =this.random_rgba();

                data.datasets.push({
                    label: y,
                    data: this.state.profit_data.data[i],
                    fill: false,
                    backgroundColor: tmp,
                    borderColor: tmp,
                })
            }

            const options = {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                        }
                    }]
                },
            }

            return (
                <Card className="dashboard-content">
                    <Card.Body>
                        <h5 className="font-weight-bold">Profit by Month</h5>
                        <Line data={data} options={options}/>
                    </Card.Body>
                </Card>
            )
        }
    }

    printTicketSales(){
        if(this.state.ticket_sales_data.length != 0){
            const data = {
                labels: this.state.ticket_sales_data.labels,
                datasets:[]
            }

            for(var i=0;i<5;i++){
                var y = new Date().getFullYear();
                y =  y-i;

                var tmp =this.random_rgba();

                data.datasets.push({
                    label: y,
                    data: this.state.ticket_sales_data.data[i],
                    fill: false,
                    backgroundColor: tmp,
                    borderColor: tmp,
                })
            }

            const options = {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                        }
                    }]
                },
            }

            return (
                <Card className="dashboard-content">
                    <Card.Body>
                        <h5 className="font-weight-bold">Tickets Sold by Month</h5>
                        <Line data={data} options={options}/>
                    </Card.Body>
                </Card>
            )
        }
    }

    random_rgba() {
        var o = Math.round, r = Math.random, s = 255;
        return 'rgba(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ',' + r().toFixed(1) + ')';
    }

    getDate(){
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();

        today = yyyy + '-' + mm + '-' + dd;

        return today;
    }

    getMovies(){
        const url = "/cinema_project/api/admin/getMovies";

        axios.get(url)
        .then(response => {
            this.setState({
                movie_list:response.data.data,
            })
        })
        .catch(error => {
            alert("Error: "+error);
        })
    }

    printOptions(){
        if(this.state.movie_list.length!=0){
            return this.state.movie_list.map((data)=>{
                return (
                    <option value={data.movie_id}>{data.title}</option>
                )
            })
        }
    }

    getSuggestions(){
        const url = "/cinema_project/api/admin/getSentimentRecommendation";

        axios.get(url)
        .then(response => {
            this.setState({
                suggestion: response.data.data
            })
        })
        .catch(error => {
            alert("Error :"+error);
        })
    }

    printSuggestions(){
        if(this.state.suggestion.length != 0){
            return (
                <Card>
                    <Card.Body>
                        <Row>
                            <Col xs={12} lg={3} className="my-auto"><h5 className="font-weight-bold no-margin-padding">Suggested Actions</h5></Col>
                        </Row>
                        <Row>
                            <Col>
                                <Table className="mt-3 mb-0">
                                    <tbody>
                                        {this.state.suggestion.increase.map((data,i)=>{
                                            return (
                                                <tr>
                                                    <td className="pl-0">{data.title}</td>
                                                    <td className="text-success font-weight-bold">Increase Showtime Due to Popularity - Top {i+1} Most Popular Movie Currently Showing in Your Cinema &nbsp;<FontAwesomeIcon icon={Icons.faArrowAltCircleUp}/></td>
                                                </tr>
                                            )
                                        })}
                                        {this.state.suggestion.decrease.map((data,i)=>{
                                            return (
                                                <tr>
                                                    <td className="pl-0">{data.title}</td>
                                                    <td className="text-danger font-weight-bold">Decrease Showtime Due to Lack of Popularity - Top {i+1} Least Popular Movie Currently Showing in Your Cinema &nbsp;<FontAwesomeIcon icon={Icons.faArrowAltCircleDown}/></td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </Table>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            )
        }
    }
}