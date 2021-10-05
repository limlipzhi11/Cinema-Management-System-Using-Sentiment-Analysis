import React,{Component} from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table'

import Session from './Session';
import SideNav from './SideNav';

import styles from './css/common/common.css';
import Button from 'react-bootstrap/esm/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import * as Icons from '@fortawesome/free-solid-svg-icons';import axios from 'axios';

export default class Experiences extends Component{

    constructor(){
        super();
        this.state={
            //session state variables
            isLogged:false,
            id:0,
            admin_group:0,

            //Modal States
            show_addModal:false,
            show_delModal:false,
            show_editModal:false,

            //Selected Item States
            selected_id:-1,
            selected_index:-1,

            //Form Input States
            input_name:"",
            input_description:"",
            input_surcharge:0,
            input_logo:"",
            edit_name:"",
            edit_description:"",
            edit_surcharge:0,
            edit_logo:"",

            //Content State
            experience_list:[],

            //Alert States
            show_alert:false,
            alert_variant:"",
            alert_heading:"",
            alert_msg:"",
        }
    }

    componentDidMount(){
        this.getExperience();
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
                                <div>MOVIE EXPERIENCES</div>
                            </Col>
                           
                            <Col className="text-right my-auto">
                                <Button 
                                    variant="warning"
                                    onClick={()=>this.showAddModal()}
                                    className="shadow"
                                >
                                    <FontAwesomeIcon className="btnIcon" icon={Icons.faPlusCircle}/>
                                    <b>Add Experience</b>
                                </Button>
                            </Col>
                        </Row>
                        <Row id="pageContent">
                            <Col className="no-margin-padding">
                                <Table className="contentTable shadow" hover bordered variant="warning">
                                    {/* Table Header */}
                                    <thead className="bg-warning rounded-top">
                                        <th>Logo</th>
                                        <th>Experience</th>
                                        <th>Description</th>
                                        <th>Surcharge (RM)</th>
                                        <th>Tools</th>
                                    </thead>
                                    {/* Table Body */}
                                    <tbody>
                                        {this.state.experience_list.length != 0
                                            ?
                                            this.state.experience_list.map((data,i) => {
                                                if(data.exp_id != 0){
                                                    return(
                                                        <tr>
                                                            <td>
                                                                <img src={data.logo} id="expLogo"/>
                                                            </td>
                                                            <td>{data.name}</td>
                                                            <td>{data.description}</td>
                                                            <td>{data.surcharge}</td>
                                                            <td>
                                                                <Row className="justify-content-center">
                                                                    <Button variant="primary" size="sm" onClick={() => this.showEditModal(i,data.exp_id)}>
                                                                        <FontAwesomeIcon icon={Icons.faEdit}/>
                                                                    </Button>
                                                                    &nbsp;
                                                                    <Button variant="danger" size="sm" onClick={() => this.showDelModal(i,data.exp_id)}>
                                                                        <FontAwesomeIcon icon={Icons.faTrash}/>
                                                                    </Button>
                                                                </Row>
                                                            </td>
                                                        </tr>
                                                    )
                                                }
                                                else{
                                                    return(
                                                        <tr>
                                                            <td>
                                                                <img src={data.logo} id="expLogo"/>
                                                            </td>
                                                            <td>{data.name}</td>
                                                            <td>{data.description}</td>
                                                            <td>{data.surcharge}</td>
                                                            <td>
                                                                <Row className="justify-content-center">
                                                                    <Button variant="primary" size="sm" value={data.exp_id} disabled><FontAwesomeIcon icon={Icons.faEdit}/></Button>
                                                                    &nbsp;
                                                                    <Button variant="danger" size="sm" value={data.exp_id} disabled><FontAwesomeIcon icon={Icons.faTrash}/></Button>
                                                                </Row>
                                                            </td>
                                                        </tr>
                                                    )
                                                }
                                            })
                                            :
                                            <tr>
                                                <td colspan="5">No Movie Experiences Found.</td>
                                            </tr>
                                        }
                                    </tbody>
                                </Table>
                            </Col>
                        </Row>
                    </Col> 

                    <Session/>

                    <Modal
                        show={this.state.show_addModal}
                        onHide={()=>this.hideAddModal()}
                        backdrop="static"
                        keyboard={false}
                        centered
                    >
                        <Modal.Header className="modalHeader" closeButton>
                            Add A New Movie Experience
                        </Modal.Header>
                        <Modal.Body>
                            <Form id="xp_addForm" className="contentForm" onSubmit={this.submitAddForm.bind(this)}>
                                <Form.Group className="mb-3" controlId="form_name">
                                    <Form.Label>Experience Name</Form.Label>
                                    <Form.Control type="text" placeholder="Experience Name" onChange={(value)=>this.setState({input_name:value.target.value})} required/>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="form_description">
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control type="text" placeholder="Description" onChange={(value)=>this.setState({input_description:value.target.value})} required/>
                                </Form.Group>
                                <Form.Group controlId="form_surcharge" className="mb-3">
                                    <Form.Label>Surcharge (RM)</Form.Label>
                                    <Form.Control type="number" max="999" min="0" step="0.1" placeholder="Surcharge" onChange={(value)=>this.setState({input_surcharge:value.target.value})} required/>
                                </Form.Group>
                                <Form.Group controlId="form_logo" className="mb-3">
                                    <Form.Label>Experience Logo</Form.Label>
                                    <Form.Control type="file" size="sm" accept="image/png,image/jpeg" onChange={(value)=>this.setState({input_logo:value.target.files[0]})} required/>
                                </Form.Group>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="muted" onClick={()=>this.hideAddModal()}><b>Cancel</b></Button>
                            <Button type="submit" form="xp_addForm" variant="warning"><b>Add Experience</b></Button>
                        </Modal.Footer>
                    </Modal>

                    <Modal
                        show={this.state.show_delModal}
                        onHide={()=>this.hideDelModal()}
                        backdrop="static"
                        keyboard={false}
                        centered
                    >
                        <Modal.Header className="modalHeader" closeButton>
                            Delete Movie Experience
                        </Modal.Header>
                        <Modal.Body>
                            Are you sure you want to delete this movie experience ?
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="muted" onClick={()=>this.hideDelModal()}><b>Cancel</b></Button>
                            <Button variant="danger" onClick={()=>this.deleteExperience(this.state.selected_index,this.state.selected_id)}><b>Delete</b></Button>
                        </Modal.Footer>
                    </Modal>

                    <Modal
                        show={this.state.show_editModal}
                        onHide={()=>this.hideEditModal()}
                        backdrop="static"
                        keyboard={false}
                        centered
                    >
                        <Modal.Header className="modalHeader" closeButton>
                            Edit Movie Experience
                        </Modal.Header>
                        <Modal.Body>
                            <Form id="xp_editForm" className="contentForm" onSubmit={this.editExperience.bind(this,this.state.selected_index,this.state.selected_id)}>
                                <Form.Group className="mb-3" controlId="form_name">
                                    <Form.Label>Experience Name</Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        placeholder="Experience Name" 
                                        onChange={(event)=>this.setState({edit_name:event.target.value})} 
                                        defaultValue={this.state.edit_name} 
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="form_description">
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        placeholder="Description" 
                                        onChange={(event)=>this.setState({edit_description:event.target.value})} 
                                        defaultValue={this.state.edit_description} 
                                        required
                                    />
                                </Form.Group>
                                <Form.Group controlId="form_surcharge" className="mb-3">
                                    <Form.Label>Surcharge (RM)</Form.Label>
                                    <Form.Control 
                                        type="number" 
                                        max="999" 
                                        min="0" 
                                        step="0.1" 
                                        placeholder="Surcharge" 
                                        onChange={(event)=>this.setState({edit_surcharge:event.target.value})} 
                                        defaultValue={this.state.edit_surcharge} 
                                        required
                                    />
                                </Form.Group>
                                <Form.Group controlId="form_logo" className="mb-3">
                                    <Form.Label>Experience Logo</Form.Label>
                                    <Form.Control type="file" size="sm" accept="image/png,image/jpeg" onChange={(event)=>this.setState({edit_logo:event.target.files[0]})}/>
                                </Form.Group>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="muted" onClick={()=>this.hideEditModal()}><b>Cancel</b></Button>
                            <Button type="submit" form="xp_editForm" variant="warning"><b>Edit Experience</b></Button>
                        </Modal.Footer>
                    </Modal>

                </Row>
            </Container>
        )
    }

    showAddModal(){
        this.setState({
            show_addModal:true
        });
    }

    hideAddModal(){
        this.setState({
            show_addModal:false
        });
    }

    submitAddForm(event){
        event.preventDefault();

        const baseURL = "/cinema_project/api/admin/addExperience";

        const formData = new FormData();
        formData.append('name',this.state.input_name);
        formData.append('description',this.state.input_description);
        formData.append('surcharge',this.state.input_surcharge);
        formData.append('logo',this.state.input_logo);

        axios.post(baseURL,formData)
        .then(response => {
            this.getExperience();
            this.hideAddModal();
            this.showAlert(true,response.data.message)
        })
        .catch(error => {alert("Error 500 " + error)});
    }

    getExperience(){
        const baseURL = "/cinema_project/api/admin/getExperience";

        axios.get(baseURL)
        .then(response => {
            this.setState({experience_list:response.data.data});
            //console.log(this.state.experience_list);
        })
        .catch(error => {
            alert("Error 500 " + error);
        })
    }

    deleteExperience(i,id){
        //console.log(i+" "+id);
        const url = "/cinema_project/api/admin/deleteExperience/" + id;

        axios.delete(url)
        .then(response => {
            const res = response.data;
            if(res.success){
                this.showAlert(true,res.message);

                const list = this.state.experience_list;
                list.splice(i,1);
                this.setState({experience_list:list});
            }
            else{
                this.showAlert(false,res.message);
            }
        })

        this.hideDelModal();
    }

    showDelModal(i,id){
        this.setState({
            show_delModal:true,
            selected_id:id,
            selected_index:i
        });
    }

    hideDelModal(){
        this.setState({
            show_delModal:false,
            selected_id:-1,
            selected_index:-1
        });
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

    editExperience(i,id,event){
        event.preventDefault();

        const url = "/cinema_project/api/admin/editExperience/" + id;

        const formData = new FormData();
        formData.append('name',this.state.edit_name);
        formData.append('description',this.state.edit_description);
        formData.append('surcharge',this.state.edit_surcharge);
        formData.append('logo',this.state.edit_logo);

        axios.post(url,formData)
        .then(response => {
            this.getExperience();
            this.hideEditModal();
            this.showAlert(true,response.data.message);
        })
        .catch(error => {
            alert("Error: " + error);
        })

        //this.hideEditModal();
    }

    showEditModal(i,id){
        this.setState({
            show_editModal:true,
            selected_id:id,
            selected_index:i,
            edit_name:this.state.experience_list[i].name,
            edit_description:this.state.experience_list[i].description,
            edit_surcharge:this.state.experience_list[i].surcharge,
            edit_logo:""
        });
    }

    hideEditModal(){
        this.setState({
            show_editModal:false,
            selected_id:-1,
            selected_index:-1,
            edit_name:"",
            edit_description:"",
            edit_surcharge:0,
            edit_logo:""
        });
    }
}