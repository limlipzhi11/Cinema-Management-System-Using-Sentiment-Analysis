import React,{Component} from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Pagination from 'react-bootstrap/Pagination';
import Spinner from 'react-bootstrap/Spinner';

import Session from './Session';
import SideNav from './SideNav';

import styles from './css/common/common.css';
import Button from 'react-bootstrap/esm/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import * as Icons from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import {Link} from 'react-router-dom';

export default class MovieHall extends Component{

    constructor(){
        super();
        this.state={
            //session state variables
            isLogged:false,
            id:0,
            admin_group:0,

            //content list states
            exp_list:[],
            hall_list:[],

            //modal states
            show_addHallModal:false,
            show_loadModal:false,
            show_delHallModal:false,
            show_editHallModal:false,

            //selection states
            selected_hall_id:-1,
            selected_hall_index:-1,

            //form input states
            add_hall_exp:0,
            edit_hall_exp:0,

            //pagination states
            total_pages:1,
            active_page:1,
            item_limit:5,
            sibling_count:1,
        }
    }

    componentDidMount(){
        this.getExperiences();
        this.getHalls();
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
                                <div>MOVIE HALLS</div>
                            </Col>
                        </Row>
                        <Row id="pageContent" className="no-margin-padding">
                            <Col className="no-margin-padding">
                                <Card className="no-margin-padding">
                                    <Row className="no-margin-padding">
                                        <Col id="hall_table_container">
                                            <Table className="no-margin-padding" striped bordered hover responsive>
                                                <thead className="bg-warning">
                                                    <tr>
                                                        <th>Hall</th>
                                                        <th>Experience</th>
                                                        <th className="text-center">Tools</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {this.printHalls()}
                                                </tbody>
                                            </Table>
                                            <Pagination className="no-margin-padding mt-2">
                                                {this.pagination()}
                                            </Pagination>
                                        </Col>
                                        <Col xs={2} className="no-margin-padding">
                                            <Card id="movieToolbar">
                                                <Card.Header className="bg-warning"><b>Tools</b></Card.Header>
                                                <ListGroup variant="flush" className="align-items-center">
                                                    <ListGroup.Item>
                                                        <Button variant="warning" className="toolbarBtn" size="sm" onClick={()=>this.showAddHallModal()}>
                                                            <FontAwesomeIcon className="btnIcon" icon={Icons.faPlusCircle}/>
                                                            <b>Add Hall</b>
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

                    {this.addHallModal()}
                    {this.delHallModal()}
                    {this.editHallModal()}
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

    getExperiences(){
        const baseURL = "/cinema_project/api/admin/getExperience";

        axios.get(baseURL)
        .then(response => {
            this.setState({exp_list:response.data.data});
            //console.log(this.state.exp_list);
        })
        .catch(error => {
            alert("Error 500 " + error);
        })
    }

    getHalls(){
        const url = "/cinema_project/api/admin/getHalls";

        axios.get(url)
        .then(response => {
            this.setState({
                hall_list:response.data.data
            },()=>this.getTotalPages())
        })
        .catch(error => {
            alert("Error: "+error);
        })
    }

    printHalls(){
        if(this.state.hall_list.length != 0){
            return this.limitTableContent(this.state.hall_list,this.state.active_page,this.state.item_limit).map((data,i) => {
                return(
                    <tr>
                        <td>{data.hall_id}</td>
                        <td>
                            {this.state.exp_list.map((e,j)=>{
                                if(e.exp_id == data.exp_id)
                                    return(e.name)
                            })}
                        </td>
                        <td className="text-center">
                            <Button size="sm" variant="primary" onClick={()=>this.showEditHallModal(data.hall_id,(((this.state.active_page-1)*this.state.item_limit)+i))}>
                                <FontAwesomeIcon icon={Icons.faEdit}/>
                            </Button>
                            &nbsp;
                            <Button size="sm" variant="danger" onClick={()=>this.showDelHallModal(data.hall_id,(((this.state.active_page-1)*this.state.item_limit)+i))}>
                                <FontAwesomeIcon icon={Icons.faTrash}/>
                            </Button>
                            &nbsp;
                            <Link to={"/cinema_project/admin/hallDetail/"+data.hall_id}>
                                <Button size="sm" variant="outline-secondary">
                                    <FontAwesomeIcon className="btnIcon" icon={Icons.faInfoCircle}/>
                                    More Info
                                </Button>
                            </Link>
                        </td>
                    </tr>
                )
            })
        }
        else{
            return(
                <tr className="text-center">
                    <td colSpan={3}>No Halls Found.</td>
                </tr>
            )
        }
    }

    addHallModal(){
        return(
            <Modal
                show={this.state.show_addHallModal}
                onHide={()=>this.hideAddHallModal()}
                backdrop="static"
                keyboard={false}
                centered
            >
                <Modal.Header className="modalHeader" closeButton>
                    Add A New Movie Hall
                </Modal.Header>
                <Modal.Body>
                    <Form id="hall_addForm" className="contentForm" onSubmit={this.addHall.bind(this)}>
                        <Form.Group className="mb-3" controlId="form_exp">
                            <Form.Label>Movie Experience</Form.Label>
                            <Form.Control as="select" defaultValue="" required onChange={(e)=>this.setState({add_hall_exp:e.target.value})}>
                                <option value="" disabled>Select a Movie Experience</option>
                                {this.state.exp_list.map((data)=>{
                                    return(
                                        <option value={data.exp_id}>{data.name}</option>
                                    )
                                })}
                            </Form.Control>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="muted" onClick={()=>this.hideAddHallModal()}><b>Cancel</b></Button>
                    <Button type="submit" form="hall_addForm" variant="warning"><b>Add Hall</b></Button>
                </Modal.Footer>
            </Modal>
        )
    }

    hideAddHallModal(){
        this.setState({
            show_addHallModal:false,
            add_hall_exp:0,
        })
    }

    showAddHallModal(){
        this.setState({
            show_addHallModal:true
        })
    }

    addHall(event){
        event.preventDefault();

        const url = "/cinema_project/api/admin/addHall";
        const formData = new FormData();
        formData.append('exp_id',this.state.add_hall_exp);

        axios.post(url,formData)
        .then(response=>{
            this.showAlert(true,response.data.message);
            this.getHalls();
            this.hideLoadModal();
        })
        .catch(error=>{
            alert("Error: "+error)
        })

        this.hideAddHallModal();
        this.showLoadModal();
    }

    range(start,end){
        let length = end - start + 1;

        return Array.from({length},(_,idx)=>idx+start);
    }

    getPaginationRange(totalPages,siblingCount,activePage){
        const totalPageCount  = totalPages;
        const total_page_numbers = siblingCount + 5;
        const DOTS = "DOTS";

        //case 1
        if(total_page_numbers >= totalPageCount )
            return this.range(1,totalPageCount);

        const leftSiblingIndex = Math.max(activePage - siblingCount,1);
        const rightSiblingIndex = Math.min(activePage + siblingCount,totalPageCount);

        const shouldShowLeftDots = leftSiblingIndex > 2;
        const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2;

        const firstPageIndex = 1;
        const lastPageIndex = totalPageCount;

        //case 2
        if(!shouldShowLeftDots && shouldShowRightDots){
            let leftItemCount = 3 + 2 * siblingCount;
            let leftRange = this.range(1,leftItemCount);

            return [...leftRange, DOTS,totalPageCount];
        }

        //case 3
        if(shouldShowLeftDots && !shouldShowRightDots){
            let rightItemCount = 3 + 2 * siblingCount;
            let rightRange = this.range(
                totalPageCount - rightItemCount + 1,
                totalPageCount
            );
            return [firstPageIndex, DOTS, ...rightRange];
        }

        //case 4
        if(shouldShowLeftDots && shouldShowRightDots){
            let middleRange = this.range(leftSiblingIndex,rightSiblingIndex);
            return [firstPageIndex, DOTS,...middleRange,DOTS,lastPageIndex];
        }
    }

    pagination(){
        const n_pages = this.state.total_pages;

        var tmp=this.getPaginationRange(n_pages,this.state.sibling_count,this.state.active_page);

        return tmp.map((data)=>{
            if(data != "DOTS"){
                return (
                    <Pagination.Item key={data} active={(data) === this.state.active_page} onClick={()=>this.setState({active_page:data})}>
                        {data}
                    </Pagination.Item>
                )
            }
            else{
                return (
                    <Pagination.Ellipsis/>
                )
            }
        })
    }

    getTotalPages(){
        if(this.state.hall_list.length!=0){
            var n_pages = Math.ceil(this.state.hall_list.length/this.state.item_limit);
        }
        else{
            var n_pages = 1;
        }
        this.setState({total_pages:n_pages},()=>{
            if(this.state.active_page > this.state.total_pages && this.state.total_pages != 0)
                this.setState({active_page: this.state.total_pages});
        })
    }

    limitTableContent(data,activePage,itemLimit){
        const firstPageIndex = (activePage - 1) * itemLimit;
        const lastPageIndex = firstPageIndex + itemLimit;
        return data.slice(firstPageIndex, lastPageIndex);
    }

    delHallModal(){
        return(
            <Modal
                show={this.state.show_delHallModal}
                onHide={()=>this.hideDelHallModal()}
                backdrop="static"
                keyboard={false}
                centered
            >
                <Modal.Header className="modalHeader" closeButton>
                    Delete Movie Hall
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this movie hall ?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="muted" onClick={()=>this.hideDelHallModal()}><b>Cancel</b></Button>
                    <Button variant="danger" onClick={()=>this.deleteHall(this.state.selected_hall_index,this.state.selected_hall_id)}><b>Delete</b></Button>
                </Modal.Footer>
            </Modal>
        )
    }

    hideDelHallModal(){
        this.setState({
            show_delHallModal:false,
            selected_hall_index:-1,
            selected_hall_id:-1,
        })
    }

    showDelHallModal(id,index){
        this.setState({
            show_delHallModal:true,
            selected_hall_index:index,
            selected_hall_id:id,
        })
    }

    deleteHall(index,id){
        const url = "/cinema_project/api/admin/deleteHall/"+id;

        axios.delete(url)
        .then(response => {
            const list = this.state.hall_list;
            list.splice(index,1);
            this.setState({hall_list:list});

            this.showAlert(true,response.data.message);
            this.hideLoadModal();
        })
        .catch(error=> {
            alert("Error: "+error);
        })

        this.hideDelHallModal();
        this.showLoadModal();
    }

    editHallModal(){
        return(
            <Modal
                show={this.state.show_editHallModal}
                onHide={()=>this.hideEditHallModal()}
                backdrop="static"
                keyboard={false}
                centered
            >
                <Modal.Header className="modalHeader" closeButton>
                    Edit Movie Hall
                </Modal.Header>
                <Modal.Body>
                    <Form id="hall_editForm" className="contentForm" onSubmit={this.editHall.bind(this,this.state.selected_hall_id,this.state.selected_hall_index)}>
                        <Form.Group className="mb-3" controlId="edit_form_exp">
                            <Form.Label>Movie Experience</Form.Label>
                            <Form.Control as="select" defaultValue={this.state.edit_hall_exp} required onChange={(e)=>this.setState({edit_hall_exp:e.target.value})}>
                                <option value="" disabled>Select a Movie Experience</option>
                                {this.state.exp_list.map((data)=>{
                                    return(
                                        <option value={data.exp_id}>{data.name}</option>
                                    )
                                })}
                            </Form.Control>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="muted" onClick={()=>this.hideEditHallModal()}><b>Cancel</b></Button>
                    <Button type="submit" form="hall_editForm" variant="warning"><b>Edit Hall</b></Button>
                </Modal.Footer>
            </Modal>
        )
    }

    hideEditHallModal(){
        this.setState({
            show_editHallModal:false,
            selected_hall_id:-1,
            selected_hall_index:-1,
            edit_hall_exp:0,
        })
    }

    showEditHallModal(id,index){
        this.setState({
            show_editHallModal:true,
            selected_hall_id:id,
            selected_hall_index:index,
            edit_hall_exp:this.state.hall_list[index].exp_id,
        })
    }

    editHall(id,index,event){
        event.preventDefault();

        const url = "/cinema_project/api/admin/editHall/"+id;
        const formData = new FormData();

        formData.append('exp_id',this.state.edit_hall_exp);

        axios.post(url,formData)
        .then(response => {
            this.getHalls();
            this.showAlert(true,response.data.message);
            this.hideLoadModal();
        })
        .catch(error => {
            alert("Error: "+error);
        })
        
        this.hideEditHallModal();
        this.showLoadModal();
    }
}