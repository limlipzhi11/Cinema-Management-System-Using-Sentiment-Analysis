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

export default class Banners extends Component{

    constructor(){
        super();
        this.state={
            //session state variables
            isLogged:false,
            id:0,
            admin_group:0,

            //content states
            banner_list:[],

            //modal states
            show_loadModal:false,
            show_addBannerModal:false,
            show_editBannerModal:false,
            show_delBannerModal:false,

            //input states
            selected_banner_index:-1,
            selected_banner_id:-1,

            add_banner_img:"",
            add_banner_link:"",
            add_banner_status:1,

            edit_banner_img:"",
            edit_banner_link:"",
            edit_banner_status:1,

            //alert states
            show_alert:false,
            alert_variant:"",
            alert_heading:"",
            alert_msg:"",
        }
    }

    componentDidMount(){
        this.getBanners();
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
                                <div>BANNERS</div>
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
                                                        <th>Banner Img</th>
                                                        <th>Link</th>
                                                        <th>Status</th>
                                                        <th>Tools</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {this.printBanners()}
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
                                                            onClick={()=>this.showAddBannerModal()}
                                                        >
                                                            <FontAwesomeIcon className="btnIcon" icon={Icons.faPlusCircle}/>
                                                            <b>Add Banner</b>
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
                    {this.addBannerModal()}
                    {this.editBannerModal()}
                    {this.delBannerModal()}

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

    getBanners(){
        const url = "/cinema_project/api/admin/getBanners";

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
            return this.state.banner_list.map((data,i)=>{
                return(
                    <tr>
                        <td  className="align-middle"><img className="banner_img" src={data.img}/></td>
                        <td  className="align-middle">{data.link}</td>
                        <td  className="align-middle">{data.status == 0 ? "Disabled" : "Enabled"}</td>
                        <td  className="align-middle">
                            <Button 
                                variant="primary" 
                                size="sm" 
                                onClick={()=>this.showEditBannerModal(data.banner_id,i)}
                            >
                                <FontAwesomeIcon icon={Icons.faEdit}/>
                            </Button>
                            &nbsp;
                            <Button 
                                variant="danger" 
                                size="sm" 
                                onClick={()=>this.showDelBannerModal(data.banner_id,i)}
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
                    <td colSpan={4}>No Banners Found.</td>
                </tr>
            )
        }
    }

    addBannerModal(){
        return(
            <Modal
                show={this.state.show_addBannerModal}
                onHide={()=>this.hideAddBannerModal()}
                backdrop="static"
                keyboard={false}
                centered
            >
                <Modal.Header className="modalHeader" closeButton>
                    Add A New Banner
                </Modal.Header>
                <Modal.Body>
                    <Form id="banner_addForm" className="contentForm" onSubmit={this.addBanner.bind(this)}>
                        <Form.Group className="mb-3" controlId="form_link">
                            <Form.Label>Banner Link</Form.Label>
                            <Form.Control type="text" required placeholder="Banner Link" onChange={(e)=>this.setState({add_banner_link:e.target.value})}/>
                        </Form.Group>
                        <Form.Group controlId="form_img" className="mb-3">
                            <Form.Label>Banner Image</Form.Label>
                            <Form.Control type="file" size="sm" accept="image/png,image/jpeg" onChange={(event)=>this.setState({add_banner_img:event.target.files[0]})} required/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="form_status">
                            <Form.Label>Status</Form.Label>
                            <Form.Control as="select" defaultValue="" required onChange={(e)=>this.setState({add_banner_status:e.target.value})}>
                                <option value="" disabled>Select a Status</option>
                                <option value={0}>Disabled</option>
                                <option value={1}>Enabled</option>
                            </Form.Control>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="muted" onClick={()=>this.hideAddBannerModal()}><b>Cancel</b></Button>
                    <Button type="submit" form="banner_addForm" variant="warning"><b>Add Banner</b></Button>
                </Modal.Footer>
            </Modal>
        )
    }

    hideAddBannerModal(){
        this.setState({
            show_addBannerModal:false,
            add_banner_img:"",
            add_banner_link:"",
            add_banner_status:1,
        })
    }

    showAddBannerModal(){
        this.setState({
            show_addBannerModal:true,
        })
    }

    addBanner(event){
        event.preventDefault();

        const url = "/cinema_project/api/admin/addBanner";
        const formData = new FormData();

        formData.append('img',this.state.add_banner_img);
        formData.append('link',this.state.add_banner_link);
        formData.append('status',this.state.add_banner_status);

        axios.post(url,formData)
        .then(response => {
            this.getBanners();
            this.showAlert(true,response.data.message);
            this.hideLoadModal();
        })
        .catch(error => {
            alert("Error: "+error);
        })

        this.hideAddBannerModal();
        this.showLoadModal();
    }

    editBannerModal(){
        return(
            <Modal
                show={this.state.show_editBannerModal}
                onHide={()=>this.hideEditBannerModal()}
                backdrop="static"
                keyboard={false}
                centered
            >
                <Modal.Header className="modalHeader" closeButton>
                    Edit Banner
                </Modal.Header>
                <Modal.Body>
                    <Form id="banner_editForm" className="contentForm" onSubmit={this.editBanner.bind(this,this.state.selected_banner_id,this.state.selected_banner_index)}>
                        <Form.Group className="mb-3" controlId="edit_form_link">
                            <Form.Label>Banner Link</Form.Label>
                            <Form.Control type="text" required placeholder="Banner Link" defaultValue={this.state.edit_banner_link} onChange={(e)=>this.setState({edit_banner_link:e.target.value})}/>
                        </Form.Group>
                        <Form.Group controlId="edit_form_img" className="mb-3">
                            <Form.Label>Banner Image</Form.Label>
                            <Form.Control type="file" size="sm" accept="image/png,image/jpeg" onChange={(event)=>this.setState({edit_banner_img:event.target.files[0]})}/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="edit_form_status">
                            <Form.Label>Status</Form.Label>
                            <Form.Control as="select" defaultValue={this.state.edit_banner_status} required onChange={(e)=>this.setState({edit_banner_status:e.target.value})}>
                                <option value="" disabled>Select a Status</option>
                                <option value={0}>Disabled</option>
                                <option value={1}>Enabled</option>
                            </Form.Control>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="muted" onClick={()=>this.hideEditBannerModal()}><b>Cancel</b></Button>
                    <Button type="submit" form="banner_editForm" variant="warning"><b>Edit Banner</b></Button>
                </Modal.Footer>
            </Modal>
        )
    }

    hideEditBannerModal(){
        this.setState({
            show_editBannerModal:false,
            selected_banner_index:-1,
            selected_banner_id:-1,
            edit_banner_img:"",
            edit_banner_link:"",
            edit_banner_status:1,
        })
    }

    showEditBannerModal(id,index){
        this.setState({
            show_editBannerModal:true,
            selected_banner_index:index,
            selected_banner_id:id,
            edit_banner_img:"",
            edit_banner_link:this.state.banner_list[index].link,
            edit_banner_status:this.state.banner_list[index].status,
        })
    }

    editBanner(id,index,event){
        event.preventDefault();

        const url = "/cinema_project/api/admin/editBanner/"+id;
        const formData = new FormData();

        formData.append('img',this.state.edit_banner_img);
        formData.append('link',this.state.edit_banner_link);
        formData.append('status',this.state.edit_banner_status);

        axios.post(url,formData)
        .then(response => {
            this.getBanners();
            this.showAlert(true,response.data.message);
            this.hideLoadModal();
        })
        .catch(error => {
            alert("Error: "+error);
        })

        this.hideEditBannerModal();
        this.showLoadModal();
    }

    delBannerModal(){
        return(
            <Modal
                show={this.state.show_delBannerModal}
                onHide={()=>this.hideDelBannerModal()}
                backdrop="static"
                keyboard={false}
                centered
            >
                <Modal.Header className="modalHeader" closeButton>
                    Delete Banner
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this banner ?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="muted" onClick={()=>this.hideDelBannerModal()}><b>Cancel</b></Button>
                    <Button type="submit" variant="danger" onClick={()=>this.deleteBanner(this.state.selected_banner_id,this.state.selected_banner_index)}><b>Delete</b></Button>
                </Modal.Footer>
            </Modal>
        )
    }

    hideDelBannerModal(){
        this.setState({
            show_delBannerModal:false,
            selected_banner_index:-1,
            selected_banner_id:-1,
        })
    }

    showDelBannerModal(id,index){
        this.setState({
            show_delBannerModal:true,
            selected_banner_index:index,
            selected_banner_id:id,
        })
    }

    deleteBanner(id,index){
        const url = "/cinema_project/api/admin/deleteBanner/"+id;

        axios.delete(url)
        .then(response => {
            const list = this.state.banner_list;
            list.splice(index,1);
            this.setState({banner_list:list});

            this.showAlert(true,response.data.message);
            this.hideLoadModal();
        })
        .catch(error => {
            alert("Error: "+error);
        })

        this.hideDelBannerModal();
        this.showLoadModal();
    }
}