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

export default class Snacks extends Component{

    constructor(){
        super();
        this.state={
            //session state variables
            isLogged:false,
            id:0,
            admin_group:0,

            //content states
            snack_list:[],

            //modal states
            show_loadModal:false,
            show_addSnackModal:false,
            show_editSnackModal:false,
            show_delSnackModal:false,

            //input states
            selected_snack_index:-1,
            selected_snack_id:-1,

            add_snack_name:"",
            add_snack_price:0,
            add_snack_img:"",

            edit_snack_name:"",
            edit_snack_price:0,
            edit_snack_img:"",

            //alert states
            show_alert:false,
            alert_variant:"",
            alert_heading:"",
            alert_msg:"",
        }
    }

    componentDidMount(){
        this.getSnacks();
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
                                <div>SNACKS</div>
                            </Col>
                        </Row>
                        <Row id="pageContent" className="no-margin-padding">
                            <Col className="no-margin-padding">
                                <Card className="no-margin-padding">
                                    <Row className="no-margin-padding">
                                        <Col id="hall_table_container">
                                            <Table className="no-margin-padding text-center" striped bordered hover responsive>
                                                <thead className="bg-warning">
                                                    <tr>
                                                        <th>Image</th>
                                                        <th>Name</th>
                                                        <th>Price (RM)</th>
                                                        <th>Tools</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {this.printSnacks()}
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
                                                            onClick={()=>this.showAddSnackModal()}
                                                        >
                                                            <FontAwesomeIcon className="btnIcon" icon={Icons.faPlusCircle}/>
                                                            <b>Add Snack</b>
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
                    {this.addSnackModal()}
                    {this.editSnackModal()}
                    {this.delSnackModal()}

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

    getSnacks(){
        const url = "/cinema_project/api/admin/getSnacks";

        axios.get(url)
        .then(response => {
            this.setState({
                snack_list:response.data.data
            })
        })
        .catch(error => {
            alert("Error: "+error);
        })
    }

    printSnacks(){
        if(this.state.snack_list.length != 0){
            return this.state.snack_list.map((data,i)=>{
                return(
                    <tr>
                        <td  className="align-middle"><img className="snack_img" src={data.img}/></td>
                        <td  className="align-middle">{data.name}</td>
                        <td  className="align-middle">{data.price}</td>
                        <td  className="align-middle">
                            <Button 
                                variant="primary" 
                                size="sm" 
                                onClick={()=>this.showEditSnackModal(data.snack_id,i)}
                            >
                                <FontAwesomeIcon icon={Icons.faEdit}/>
                            </Button>
                            &nbsp;
                            <Button 
                                variant="danger" 
                                size="sm" 
                                onClick={()=>this.showDelSnackModal(data.snack_id,i)}
                            >
                                <FontAwesomeIcon icon={Icons.faTrash}/>
                            </Button>
                        </td>
                    </tr>
                )
            })
        }
        else{
            return (
                <tr>
                    <td colSpan={4}>No Snacks Found.</td>
                </tr>
            )
        }
    }

    addSnackModal(){
        return(
            <Modal
                show={this.state.show_addSnackModal}
                onHide={()=>this.hideAddSnackModal()}
                backdrop="static"
                keyboard={false}
                centered
            >
                <Modal.Header className="modalHeader" closeButton>
                    Add A New Snack
                </Modal.Header>
                <Modal.Body>
                    <Form id="snack_addForm" className="contentForm" onSubmit={this.addSnack.bind(this)}>
                        <Form.Group className="mb-3" controlId="form_name">
                            <Form.Label>Snack Name</Form.Label>
                            <Form.Control type="text" required placeholder="Snack Name" onChange={(e)=>this.setState({add_snack_name:e.target.value})}/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="form_price">
                            <Form.Label>Price</Form.Label>
                            <Form.Control type="number" required min="0" max="999" step="0.1" placeholder="Snack Price" onChange={(e)=>this.setState({add_snack_price:e.target.value})}/>
                        </Form.Group>
                        <Form.Group controlId="form_img" className="mb-3">
                            <Form.Label>Image</Form.Label>
                            <Form.Control type="file" size="sm" accept="image/png,image/jpeg" onChange={(event)=>this.setState({add_snack_img:event.target.files[0]})} required/>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="muted" onClick={()=>this.hideAddSnackModal()}><b>Cancel</b></Button>
                    <Button type="submit" form="snack_addForm" variant="warning"><b>Add Snack</b></Button>
                </Modal.Footer>
            </Modal>
        )
    }

    hideAddSnackModal(){
        this.setState({
            show_addSnackModal:false,
            add_snack_name:"",
            add_snack_price:0,
            add_snack_img:"",
        })
    }

    showAddSnackModal(){
        this.setState({
            show_addSnackModal:true,
        })
    }

    addSnack(event){
        event.preventDefault();

        const url = "/cinema_project/api/admin/addSnack";
        const formData = new FormData();

        formData.append('name',this.state.add_snack_name);
        formData.append('price',this.state.add_snack_price);
        formData.append('img',this.state.add_snack_img);

        axios.post(url,formData)
        .then(response => {
            this.getSnacks();
            this.showAlert(true,response.data.message);
            this.hideLoadModal();
        })
        .catch(error => {
            alert("Error: "+error);
        })

        this.hideAddSnackModal();
        this.showLoadModal();
    }

    editSnackModal(){
        return(
            <Modal
                show={this.state.show_editSnackModal}
                onHide={()=>this.hideEditSnackModal()}
                backdrop="static"
                keyboard={false}
                centered
            >
                <Modal.Header className="modalHeader" closeButton>
                    Edit Snack
                </Modal.Header>
                <Modal.Body>
                    <Form id="snack_editForm" className="contentForm" onSubmit={this.editSnack.bind(this,this.state.selected_snack_id,this.state.selected_snack_index)}>
                        <Form.Group className="mb-3" controlId="edit_form_name">
                            <Form.Label>Snack Name</Form.Label>
                            <Form.Control type="text" required placeholder="Snack Name" defaultValue={this.state.edit_snack_name} onChange={(e)=>this.setState({edit_snack_name:e.target.value})}/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="edit_form_price">
                            <Form.Label>Price</Form.Label>
                            <Form.Control type="number" required min="0" max="999" step="0.1" defaultValue={this.state.edit_snack_price} placeholder="Snack Price" onChange={(e)=>this.setState({edit_snack_price:e.target.value})}/>
                        </Form.Group>
                        <Form.Group controlId="edit_form_img" className="mb-3">
                            <Form.Label>Image</Form.Label>
                            <Form.Control type="file" size="sm" accept="image/png,image/jpeg" onChange={(event)=>this.setState({edit_snack_img:event.target.files[0]})}/>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="muted" onClick={()=>this.hideEditSnackModal()}><b>Cancel</b></Button>
                    <Button type="submit" form="snack_editForm" variant="warning"><b>Edit Snack</b></Button>
                </Modal.Footer>
            </Modal>
        )
    }

    hideEditSnackModal(){
        this.setState({
            show_editSnackModal:false,
            selected_snack_index:-1,
            selected_snack_id:-1,
            edit_snack_name:"",
            edit_snack_price:0,
            edit_snack_img:"",
        })
    }

    showEditSnackModal(id,index){
        this.setState({
            show_editSnackModal:true,
            selected_snack_index:index,
            selected_snack_id:id,
            edit_snack_name:this.state.snack_list[index].name,
            edit_snack_price:this.state.snack_list[index].price,
            edit_snack_img:"",
        })
    }

    editSnack(id,index,event){
        event.preventDefault();

        const url = "/cinema_project/api/admin/editSnack/"+id;
        const formData = new FormData();

        formData.append('name',this.state.edit_snack_name);
        formData.append('price',this.state.edit_snack_price);
        formData.append('img',this.state.edit_snack_img);

        axios.post(url,formData)
        .then(response => {
            this.getSnacks();
            this.showAlert(true,response.data.message);
            this.hideLoadModal();
        })
        .catch(error => {
            alert("Error: "+error);
        })

        this.hideEditSnackModal();
        this.showLoadModal();
    }

    delSnackModal(){
        return(
            <Modal
                show={this.state.show_delSnackModal}
                onHide={()=>this.hideDelSnackModal()}
                backdrop="static"
                keyboard={false}
                centered
            >
                <Modal.Header className="modalHeader" closeButton>
                    Delete Snack
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this snack ?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="muted" onClick={()=>this.hideDelSnackModal()}><b>Cancel</b></Button>
                    <Button type="submit" variant="danger" onClick={()=>this.deleteSnack(this.state.selected_snack_id,this.state.selected_snack_index)}><b>Delete</b></Button>
                </Modal.Footer>
            </Modal>
        )
    }

    hideDelSnackModal(){
        this.setState({
            show_delSnackModal:false,
            selected_snack_index:-1,
            selected_snack_id:-1,
        })
    }

    showDelSnackModal(id,index){
        this.setState({
            show_delSnackModal:true,
            selected_snack_index:index,
            selected_snack_id:id,
        })
    }

    deleteSnack(id,index){
        const url = "/cinema_project/api/admin/deleteSnack/"+id;

        axios.delete(url)
        .then(response => {
            const list = this.state.snack_list;
            list.splice(index,1);
            this.setState({snack_list:list});

            this.showAlert(true,response.data.message);
            this.hideLoadModal();
        })
        .catch(error => {
            alert("Error: "+error);
        })

        this.hideDelSnackModal();
        this.showLoadModal();
    }
}