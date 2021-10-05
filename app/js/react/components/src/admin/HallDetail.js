import React,{Component} from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';

import Session from './Session';
import SideNav from './SideNav';

import styles from './css/common/common.css';
import Button from 'react-bootstrap/esm/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import * as Icons from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import NavbarCollapse from 'react-bootstrap/esm/NavbarCollapse';

export default class HallDetail extends Component{

    constructor(){
        super();
        this.state={
            //session state variables
            isLogged:false,
            id:0,
            admin_group:0,

            //content states
            hall_data:[],
            schedule_data:[],
            showing_data:[],
            movie_list:[],
            exp_list:[],

            //modal states
            show_loadModal:false,
            show_addShowModal:false,
            show_delShowModal:false,

            //date states
            schedule_start:"",
            schedule_end:"",
            schedule_by:"",

            //time states
            start_time:"",
            max_time:"",

            //input states
            add_movie_index:-1,

            //alert states
            show_alert:false,
            alert_variant:"",
            alert_heading:"",
            alert_msg:"",
        }
    }

    componentDidMount(){
        this.scheduleStateInit();
        this.getExperiences();
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
                                <div>MOVIE HALL DETAILS</div>
                            </Col>
                        </Row>
                        <Row id="pageContent" className="no-margin-padding">
                            <Col className="no-margin-padding">
                                <Card className="no-margin-padding">
                                    <Row className="no-margin-padding">
                                        <Col id="hall_table_container">
                                            <Card.Title>
                                                <Row className="no-margin-padding">
                                                    <h4 className="font-weight-bold mr-3 my-auto">{"Hall "+this.state.hall_data['hall_id']}</h4> 
                                                    <span className="my-auto">{"- Schedule for "+this.state.schedule_data.start_date+" to "+this.state.schedule_data.end_date}</span>
                                                </Row>
                                            </Card.Title>

                                            <Table className="no-margin-padding" striped bordered hover responsive>
                                                <thead className="bg-warning">
                                                    <tr>
                                                        <th>Title</th>
                                                        <th>Time</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {this.printShowings()}
                                                </tbody>
                                            </Table>
                                        </Col>
                                        <Col xs={2} className="no-margin-padding">
                                            <Card id="movieToolbar">
                                                <Card.Header className="bg-warning"><b>Tools</b></Card.Header>
                                                <ListGroup variant="flush" className="align-items-center">
                                                    <ListGroup.Item>
                                                        <Button 
                                                            variant="warning" 
                                                            className="toolbarBtn" 
                                                            size="sm" 
                                                            onClick={()=>this.saveShowings()}
                                                            disabled={!this.isEditable()}
                                                        >
                                                            <FontAwesomeIcon className="btnIcon" icon={Icons.faSave}/>
                                                            <b>Save Changes</b>
                                                        </Button>
                                                    </ListGroup.Item>
                                                    <ListGroup.Item>
                                                        <Button 
                                                            variant="warning" 
                                                            className="toolbarBtn" 
                                                            size="sm" 
                                                            onClick={()=>this.showAddShowModal()}
                                                            disabled={!this.isEditable()}
                                                        >
                                                            <FontAwesomeIcon className="btnIcon" icon={Icons.faPlusCircle}/>
                                                            <b>Add Showing</b>
                                                        </Button>
                                                    </ListGroup.Item>
                                                    <ListGroup.Item>
                                                        <Button 
                                                            variant="danger" 
                                                            className="toolbarBtn" 
                                                            size="sm" 
                                                            onClick={()=>this.showDelShowModal()}
                                                            disabled={this.state.showing_data.length==0 || !this.isEditable()}
                                                        >
                                                            <FontAwesomeIcon className="btnIcon" icon={Icons.faTrash}/>
                                                            <b>Remove Showing</b>
                                                        </Button>
                                                    </ListGroup.Item>
                                                </ListGroup>
                                            </Card>
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                        </Row>
                    </Col> 

                    {this.loadingModal()}
                    {this.addShowingModal()}
                    {this.delShowModal()}

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

    scheduleStateInit(){
        var d = new Date();
        var dayOfWeek = d.getDay();

        //Next Sunday Date
        var start = new Date();
        start.setDate(d.getDate() - dayOfWeek + 7);

        //Next Saturday Date
        var end = new Date();
        end.setDate(start.getDate() + 6);

        //This Thursday Date
        var deadline = new Date();
        deadline.setDate(d.getDate() - dayOfWeek + 4);

        //console.log("Next Sunday: " + start.getFullYear()+"-"+String(start.getMonth()+1).padStart(2,'0')+"-"+String(start.getDate()).padStart(2,'0'));
        //console.log("Next Saturday: " + end.getFullYear()+"-"+String(end.getMonth()+1).padStart(2,'0')+"-"+String(end.getDate()).padStart(2,'0'));
        //console.log("This Thursday: " + deadline.getFullYear()+"-"+String(deadline.getMonth()+1).padStart(2,'0')+"-"+String(deadline.getDate()).padStart(2,'0'));

        var start_time = new Date("2021-08-12 00:00:00.00");
        start_time = String(start_time.getHours()).padStart(2,'0') +":"+ String(start_time.getMinutes()).padStart(2,'0')+":"+ String(start_time.getSeconds()).padStart(2,'0');

        this.setState({
            schedule_start:start.getFullYear()+"-"+String(start.getMonth()+1).padStart(2,'0')+"-"+String(start.getDate()).padStart(2,'0'),
            schedule_end:end.getFullYear()+"-"+String(end.getMonth()+1).padStart(2,'0')+"-"+String(end.getDate()).padStart(2,'0'),
            schedule_by:deadline.getFullYear()+"-"+String(deadline.getMonth()+1).padStart(2,'0')+"-"+String(deadline.getDate()).padStart(2,'0'),
            start_time:start_time,
            max_time:start_time,
        },()=>{this.getHall()})
    }

    getHall(){
        const url = "/cinema_project/api/admin/getHall/"+this.props.match.params.id;

        axios.get(url)
        .then(response => {
            this.setState({
                hall_data:response.data.data
            },()=>{this.getSchedule()})
        })
        .catch(error => {
            alert("Error: "+error);            
        })
    }

    getSchedule(){
        const url = "/cinema_project/api/admin/getSchedule";
        const formData = new FormData();
        formData.append('hall_id',this.state.hall_data['hall_id']);
        formData.append('exp_id',this.state.hall_data['exp_id']);
        formData.append('start_date',this.state.schedule_start);
        formData.append('end_date',this.state.schedule_end);
        formData.append('schedule_by',this.state.schedule_by);

        axios.post(url,formData)
        .then(response => {
            this.setState({
                schedule_data:response.data.data.schedule,
                showing_data:response.data.data.showing,
            },()=>{
                this.getSchedulableMovies();
                if(this.state.showing_data.length!=0){
                    this.setState({
                        max_time:this.state.showing_data[this.state.showing_data.length-1].end_time,
                    })
                }
            })
            this.hideLoadModal();
        })
        .catch(error => {
            alert("Error: "+error);
        })

        this.showLoadModal()
    }

    printShowings(){
        if(this.state.showing_data.length != 0){
            return this.state.showing_data.map((data,i) => {
                return(
                    <tr>
                        <td>{data.name}</td>
                        <td>{data.start_time.slice(0,data.start_time.length - 3)+" - "+data.end_time.slice(0,data.start_time.length - 3)}</td>
                    </tr>
                )
            })
        }
        else{
            return(
                <tr>
                    <td className="text-center" colspan={2}>No Showings Found.</td>
                </tr>
            )
        }
    }

    getSchedulableMovies(){
        const url = "/cinema_project/api/admin/getSchedulableMovies";
        const formData = new FormData();
        formData.append('exp_id',this.state.schedule_data.exp_id);
        formData.append('start_date',this.state.schedule_start);
        formData.append('end_date',this.state.schedule_end);

        axios.post(url,formData)
        .then(response => {
            this.setState({
                movie_list:response.data.data
            })
        })
        .catch(error => {
            alert("Error: "+error);
        })
    }

    getExperiences(){
        const url = "/cinema_project/api/admin/getExperience";

        axios.get(url)
        .then(response => {
            this.setState({
                exp_list:response.data.data
            })
        })
        .catch(error => {
            alert("Error: "+error);
        })
    }

    addShowingModal(){
        return(
            <Modal
                show={this.state.show_addShowModal}
                onHide={()=>this.hideAddShowModal()}
                backdrop="static"
                keyboard={false}
                centered
            >
                <Modal.Header className="modalHeader" closeButton>
                    Add A New Showing
                </Modal.Header>
                <Modal.Body>
                    <Form id="show_addForm" className="contentForm" onSubmit={this.addShow.bind(this)}>
                        <Form.Group className="mb-3" controlId="form_movie">
                            <Form.Label>Movie</Form.Label>
                            <Form.Control as="select" defaultValue="" required onChange={(e)=>this.setState({add_movie_index:e.target.value})}>
                                <option value="" disabled>Select a Movie</option>
                                {this.state.movie_list.map((data,i)=>{
                                    if(this.checkValid(this.state.max_time,data.duration)){
                                        return(
                                            <>
                                                <option value={i}>
                                                    {data.title}
                                                </option>
                                                <option disabled className={data.avg_comp<0.4?"text-danger":data.avg_comp<0.7?"text-warning":"text-success"}>&emsp;{"Sentiment Score: "+(data.avg_comp*100)}</option>
                                            </>
                                        )
                                    }
                                })}
                            </Form.Control>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="muted" onClick={()=>this.hideAddShowModal()}><b>Cancel</b></Button>
                    <Button type="submit" form="show_addForm" variant="warning"><b>Add Showing</b></Button>
                </Modal.Footer>
            </Modal>
        )
    }

    hideAddShowModal(){
        this.setState({
            show_addShowModal:false,
            add_movie_index:-1,
        })
    }

    showAddShowModal(){
        this.setState({
            show_addShowModal:true,
        })
    }
    
    getExpName(id){
        for(var i=0; i<this.state.exp_list.length;i++){
            if(this.state.exp_list[i].exp_id == id)
                return this.state.exp_list[i].name;
        }
    }

    getExpPrice(id){
        for(var i=0; i<this.state.exp_list.length;i++){
            if(this.state.exp_list[i].exp_id == id)
                return this.state.exp_list[i].surcharge;
        }
    }

    getEndTime(time,duration){
        time = time.split(":")
        var endTime = new Date(0,0,0,time[0],time[1],time[2]);
        endTime=new Date(endTime.getTime()+(duration * 60 * 1000));

        return (String(endTime.getHours()).padStart(2,'0')+":"+String(endTime.getMinutes()).padStart(2,'0')+":"+String(endTime.getSeconds()).padStart(2,'0'));
    }

    checkValid(time,duration){
        time = time.split(":")
        var tmp = new Date(0,0,0,time[0],time[1],time[2]);
        var endTime=new Date(tmp.getTime()+(duration * 60 * 1000));

        if(tmp.getDate() != endTime.getDate())
            return false;
        else
            return true;
    }

    addShow(event){
        event.preventDefault();
        this.hideAddShowModal();

        this.showLoadModal();

        var showing = this.state.showing_data;

        showing.push({
            hall_id:this.state.hall_data.hall_id,
            schedule_id:this.state.schedule_data.schedule_id,
            exp_id:this.state.schedule_data.exp_id,
            movie_id:this.state.movie_list[this.state.add_movie_index].movie_id,
            duration:this.state.movie_list[this.state.add_movie_index].duration,
            name:this.state.movie_list[this.state.add_movie_index].title+" ("+this.getExpName(this.state.schedule_data.exp_id)+")",
            price:parseFloat(this.state.movie_list[this.state.add_movie_index].price)+parseFloat(this.getExpPrice(this.state.schedule_data.exp_id)),
            start_time:this.state.max_time,
            end_time:this.getEndTime(this.state.max_time,this.state.movie_list[this.state.add_movie_index].duration),
            enabled_by:this.state.schedule_by
        })

        this.setState({
            showing_data:showing,
            max_time:this.getEndTime(this.state.max_time,this.state.movie_list[this.state.add_movie_index].duration),
            add_movie_index:-1,
        })

        this.hideLoadModal();
    }

    delShowModal(){
        return(
            <Modal
                show={this.state.show_delShowModal}
                onHide={()=>this.hideDelShowModal()}
                backdrop="static"
                keyboard={false}
                centered
            >
                <Modal.Header className="modalHeader" closeButton>
                    Remove Showing
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this showing ?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="muted" onClick={()=>this.hideDelShowModal()}><b>Cancel</b></Button>
                    <Button variant="danger" onClick={()=>this.removeShow()}><b>Delete</b></Button>
                </Modal.Footer>
            </Modal>
        )
    }

    showDelShowModal(){
        this.setState({
            show_delShowModal:true
        })
    }

    hideDelShowModal(){
        this.setState({
            show_delShowModal:false
        })
    }

    removeShow(){
        this.hideDelShowModal();
        this.showLoadModal();

        if(this.state.showing_data.length != 0){
            var showing = this.state.showing_data;

            var tmp = showing.pop();
            
            this.setState({
                showing_data:showing,
                max_time:tmp.start_time,
            })
        }

        this.hideLoadModal();
    }

    saveShowings(){
        const url = "/cinema_project/api/admin/addShowing";
        const formData = new FormData();

        formData.append('showings',JSON.stringify(this.state.showing_data));
        formData.append('schedule_id',this.state.schedule_data.schedule_id);
        formData.append('start_date',this.state.schedule_data.start_date);
        formData.append('end_date',this.state.schedule_data.end_date);

        axios.post(url,formData)
        .then(response => {
            this.hideLoadModal();
            this.showAlert(true,response.data.message);
        })
        .catch(error => {
            alert("Error :" + error);
        })

        this.showLoadModal();
    }

    isEditable(){
        if(this.state.schedule_data.length != 0){
            var d = new Date();
            var today =(d.getFullYear())+"-"+String(d.getMonth()+1).padStart(2,'0')+"-"+String(d.getDate()).padStart(2,'0');
            today = new Date(today);
            
            var deadline = new Date(this.state.schedule_data.schedule_by);
            if(today.getTime()>deadline.getTime())
                return false;
            else
                return true;
        }
        else{
            return false;
        }
    }
}