//Admin Dashboard
import React,{Component} from 'react';
import {Link} from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/esm/Button';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import Pagination from 'react-bootstrap/Pagination';
import InputGroup from 'react-bootstrap/InputGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

import Session from './Session';
import SideNav from './SideNav';

import styles from './css/common/common.css';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import * as Icons from '@fortawesome/free-solid-svg-icons';import axios from 'axios';
import Modal from 'react-bootstrap/esm/Modal';

export default class Movies extends Component{

    constructor(){
        super();
        this.state={
            //session state variables
            isLogged:false,
            id:0,
            admin_group:0,

            //Content states
            movie_list:[],
            genre_list:[],
            exp_list:[],

            //Modal states
            show_addGenreModal:false,
            show_editGenreModal:false,
            show_delGenreModal:false,
            show_addMovieModal:false,
            show_loadModal:false,
            show_editMovieModal:false,

            //addGenreForm inputs
            add_genre_genre:"",

            //editGenreForm inputs
            selected_genre_id:-1,
            selected_genre_index:-1,
            edit_genre_genre:"",

            //addMovieForm inputs
            add_movie_title:"",
            add_movie_cast:"",
            add_movie_director:"",
            add_movie_distributor:"",
            add_movie_synopsis:"",
            add_movie_price:0,
            add_movie_duration:0,
            add_movie_genre:[],
            add_movie_exp:[0],
            add_movie_start:this.minDate(0),
            add_movie_end:this.minDate(1),
            add_movie_poster:"",
            add_movie_trailer:"",

            //editMovieForm inputs
            selected_movie_id:-1,
            selected_movie_index:-1,
            edit_movie_title:"",
            edit_movie_cast:"",
            edit_movie_director:"",
            edit_movie_distributor:"",
            edit_movie_synopsis:"",
            edit_movie_price:0,
            edit_movie_duration:0,
            edit_movie_genre:[],
            edit_movie_exp:[],
            edit_movie_start:this.minDate(0),
            edit_movie_end:this.minDate(1),
            edit_movie_poster:"",
            edit_movie_trailer:"",


            //Alert states
            show_alert:false,
            alert_variant:"",
            alert_heading:"",
            alert_msg:"",

            //Pagination states
            total_pages:1,
            active_page:1,
            item_limit:5,
            sibling_count:1,

            //filter states
            filter_by:"none",
            filter_option:-1,
            searchTerm:"",
        }
    }

    componentDidMount(){
        this.getMovies();
        this.getGenre();
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
                                <div>MOVIES</div>
                            </Col>
                           
                            <Col className="text-right my-auto">
                                
                            </Col>
                        </Row>

                        <Row id="pageContent">
                            <Col className="no-margin-padding">
                                <Tabs defaultActiveKey="movies" id="movieTabs">
                                    <Tab eventKey="movies" title="Movies">
                                        <Row id="movieContent" className="shadow">
                                            <Col className="no-margin-padding">
                                                <Row className="no-margin-padding">
                                                    <InputGroup id="filterBar">
                                                        <DropdownButton 
                                                            variant="outline-secondary"
                                                            title = "Filter By"
                                                            id = "filter_by"
                                                            onSelect={(key)=>this.handleFilterChange(key)}
                                                            className="filterDropdown noRightRadius"
                                                        >
                                                            <Dropdown.Item active={this.state.filter_by==="none"} eventKey="none">None</Dropdown.Item>
                                                            <Dropdown.Item active={this.state.filter_by==="show"} eventKey="show">Showing Status</Dropdown.Item>
                                                            <Dropdown.Item active={this.state.filter_by==="genre"} eventKey="genre">Genre</Dropdown.Item>
                                                            <Dropdown.Item active={this.state.filter_by==="exp"} eventKey="exp">Movie Experience</Dropdown.Item>
                                                        </DropdownButton>
                                                        <DropdownButton
                                                            variant="outline-secondary"
                                                            title = "Options"
                                                            id = "filter_option"
                                                            className="filterDropdown noRadius"
                                                            onSelect={(key)=>this.handleFilterOptionChange(key)}
                                                        >
                                                            {this.showFilterOptions()}
                                                        </DropdownButton>
                                                        <Form.Control
                                                            placeholder="Search by Movie Title"
                                                            type="text"
                                                            id="searchTitle"
                                                            onChange={(e)=>this.setState({searchTerm:e.target.value})}
                                                        />
                                                        <Button variant="warning" className="noLeftRadius" onClick={()=>this.getFilteredMovies()}>
                                                            <FontAwesomeIcon icon={Icons.faSearch} className="btnIcon"/>
                                                            Filter
                                                        </Button>
                                                    </InputGroup>
                                                </Row>
                                                <Row>
                                                    <Table id="moviesTable" borderless>
                                                        <tbody>
                                                            {this.printMovie()}
                                                        </tbody>
                                                    </Table>
                                                </Row>
                                                <Row className="no-margin-padding">
                                                   <Col>
                                                        <Pagination className="ml-3">
                                                            {this.pagination()}
                                                        </Pagination>
                                                   </Col>
                                                </Row>
                                            </Col>
                                            <Col xs={2} className="no-margin-padding">
                                                <Card id="movieToolbar">
                                                    <Card.Header className="bg-warning"><b>Tools</b></Card.Header>
                                                    <ListGroup variant="flush" className="align-items-center">
                                                        <ListGroup.Item>
                                                            <Button variant="warning" className="toolbarBtn" size="sm" onClick={()=>this.showAddMovieModal()}>
                                                                <FontAwesomeIcon className="btnIcon" icon={Icons.faPlusCircle}/>
                                                                <b>Add Movie</b>
                                                            </Button>
                                                        </ListGroup.Item>
                                                        {/*
                                                        <ListGroup.Item>
                                                            <Button variant="warning" className="toolbarBtn" size="sm" onClick={()=>this.updateSentiment()}>
                                                                <FontAwesomeIcon className="btnIcon" icon={Icons.faRetweet}/>
                                                                <b>Refresh Sentiment</b>
                                                            </Button>
                                                        </ListGroup.Item>
                                                        */}
                                                    </ListGroup>
                                                </Card>
                                            </Col>
                                        </Row>
                                    </Tab>
                                    <Tab eventKey="genre" title="Genres">
                                        <Row id="movieContent" className="shadow">
                                            <Col id="genreContainer">
                                                <Table id="genreTable" className="contentTable" responsive hover bordered variant="warning">
                                                    <thead className="bg-warning rounded-top">
                                                        <th>#</th>
                                                        <th>Genre</th>
                                                        <th>Tools</th>
                                                    </thead>
                                                    <tbody>
                                                        {this.state.genre_list.length != 0 
                                                            ?
                                                            this.state.genre_list.map((data,i) => {
                                                                return(
                                                                    <tr>
                                                                        <td>{data.genre_id}</td>
                                                                        <td>{data.genre}</td>
                                                                        <td>
                                                                            <Row className="justify-content-center">
                                                                                <Button variant="primary" size="sm" onClick={()=>this.showEditGenreModal(i,data.genre_id)}>
                                                                                    <FontAwesomeIcon icon={Icons.faEdit}/>
                                                                                </Button>
                                                                                &nbsp;
                                                                                <Button variant="danger" size="sm" onClick={()=>this.showDelGenreModal(i,data.genre_id)}>
                                                                                    <FontAwesomeIcon icon={Icons.faTrash}/>
                                                                                </Button>
                                                                            </Row>
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            })
                                                            :
                                                            <tr>
                                                                <td colspan="3">No Genres Found.</td>
                                                            </tr>
                                                        }
                                                    </tbody>
                                                </Table>
                                            </Col>
                                            <Col xs={2}>
                                                <Card id="movieToolbar">
                                                    <Card.Header className="bg-warning"><b>Tools</b></Card.Header>
                                                    <Card.Body>
                                                            <Button variant="warning" className="toolbarBtn" size="sm" onClick={()=>this.showAddGenreModal()}>
                                                                <FontAwesomeIcon className="btnIcon" icon={Icons.faPlusCircle}/>
                                                                <b>Add Genre</b>
                                                            </Button>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                        </Row>
                                    </Tab>
                                </Tabs>
                            </Col>
                        </Row>
                    </Col> 

                    {this.genreAddModal()}
                    {this.genreEditModal()}
                    {this.genreDelModal()}
                    {this.movieAddModal()}
                    {this.loadingModal()}
                    {this.movieEditModal()}
                    {this.movieDelModal()}

                    <Session/>
                </Row>
            </Container>
        )
    }

    getMovies(){
        const url = "/cinema_project/api/admin/getMovies";

        axios.get(url)
        .then(response => {
            const res = response.data;
            this.setState({
                movie_list:res.data
            },()=>{this.getTotalPages()})
        })
        .catch(error => {
            alert("Error: " + error);
        })
    }

    printMovie(){
        if(this.state.movie_list.length != 0){
            return(
                this.limitTableContent(this.state.movie_list,this.state.active_page,this.state.item_limit).map((data,i) => {
                    return(
                        <tr>
                            <td>
                                <Card className="no-margin-padding">
                                    <Row>
                                        <Col className="d-flex align-items-center" xs={3}>
                                            <Card.Img className="movieListImg" src={data.poster}/>
                                        </Col>
                                        <Col>
                                            <Card.Body className="movieListBody">
                                                <Card.Title><b>{data.title}</b></Card.Title>
                                                <Card.Text className="movieItem_text">
                                                    {data.genre.map((g,j)=>{
                                                        if(j == 0)
                                                            return (g.genre)
                                                        else
                                                            return (", " + g.genre)
                                                    })}
                                                </Card.Text>
                                                <Card.Text>
                                                    <Row>
                                                        <Col>
                                                            <Row className="no-margin-padding">
                                                                <b><span className="movieItem_sub">Cast</span></b>
                                                            </Row>
                                                            <Row className="no-margin-padding">
                                                                <span className="movieItem_text">{data.cast}</span>
                                                            </Row>
                                                        </Col>
                                                        <Col>
                                                            <Row className="no-margin-padding">
                                                                <b><span className="movieItem_sub">Showing Dates</span></b>
                                                            </Row>
                                                            <Row className="no-margin-padding">
                                                                <span className="movieItem_text">{data.show_start} - {data.show_end}</span>
                                                            </Row>
                                                        </Col>
                                                        <Col>
                                                            <Row className="no-margin-padding">
                                                                <b><span className="movieItem_sub">Director</span></b>
                                                            </Row>
                                                            <Row className="no-margin-padding">
                                                                <span className="movieItem_text">{data.director}</span>
                                                            </Row>
                                                        </Col>
                                                        <Col>
                                                            <Row className="no-margin-padding">
                                                                <b><span className="movieItem_sub">Distributor</span></b>
                                                            </Row>
                                                            <Row className="no-margin-padding">
                                                                <span className="movieItem_text">{data.distributor}</span>
                                                            </Row>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col>
                                                            <Row className="no-margin-padding">
                                                                <b><span className="movieItem_sub">Synopsis</span></b>
                                                            </Row>
                                                            <Row className="no-margin-padding">
                                                                <span className="movieItem_text">{data.synopsis}</span>
                                                            </Row>
                                                        </Col>
                                                    </Row>
                                                    <Row className="mt-auto">
                                                        <Col className="text-right">
                                                            <Button variant="primary" size="sm" onClick={()=>this.showEditMovieModal(((this.state.active_page-1)*this.state.item_limit)+i,data.movie_id)}>
                                                                <FontAwesomeIcon icon={Icons.faEdit}/>
                                                            </Button>
                                                            &nbsp;
                                                            <Button variant="danger" size="sm" onClick={()=>this.showDelMovieModal(((this.state.active_page-1)*this.state.item_limit)+i,data.movie_id)}>
                                                                <FontAwesomeIcon icon={Icons.faTrash}/>
                                                            </Button>
                                                            &nbsp;
                                                            <Link to={"/cinema_project/admin/movieDetail/"+data.movie_id}>
                                                                <Button variant="outline-dark" size="sm">
                                                                    <FontAwesomeIcon className="btnIcon" icon={Icons.faInfoCircle}/>
                                                                    More Info
                                                                </Button>
                                                            </Link>
                                                        </Col>
                                                    </Row>
                                                </Card.Text>
                                            </Card.Body>
                                        </Col>
                                    </Row>
                                </Card>
                            </td>
                        </tr>
                    )
                })
            )
        }
        else{
            return(
                <tr  id="none-found-msg" >
                    <td><h4>No Movies Found.</h4></td>
                </tr>
            )
        }
    }

    genreAddModal(){
        return(
            <Modal
                show={this.state.show_addGenreModal}
                onHide={()=>this.hideAddGenreModal()}
                backdrop="static"
                keyboard={false}
                centered
            >
                <Modal.Header className="modalHeader" closeButton>
                    Add A New Genre
                </Modal.Header>

                <Modal.Body>
                    <Form id="genre_addForm" className="contentForm" onSubmit={this.addGenre.bind(this)}>
                            <Form.Group className="mb-3" controlId="addGenre_genre">
                                <Form.Label>Genre</Form.Label>
                                <Form.Control type="text" placeholder="Genre" onChange={(value)=>this.setState({add_genre_genre:value.target.value})} required/>
                            </Form.Group>
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="muted" onClick={()=>this.hideAddGenreModal()}><b>Cancel</b></Button>
                    <Button type="submit" form="genre_addForm" variant="warning"><b>Add Genre</b></Button>
                </Modal.Footer>
            </Modal>
        )
    }

    hideAddGenreModal(){
        this.setState({
            show_addGenreModal:false,
            add_genre_genre:""
        })
    }

    showAddGenreModal(){
        this.setState({
            show_addGenreModal:true
        })
    }

    getGenre(){
        const url = "/cinema_project/api/admin/getGenre";

        axios.get(url)
        .then(response => {
            this.setState({
                genre_list:response.data.data
            })
        })
        .catch(error => {
            alert("Error 500 " + error);
        })

    }

    addGenre(event){
        event.preventDefault();

        const url = "/cinema_project/api/admin/addGenre";

        const formData = new FormData();
        formData.append('genre',this.state.add_genre_genre);

        axios.post(url,formData)
        .then(response => {
            this.hideLoadModal();
            this.getGenre();
            this.showAlert(true,response.data.message);
        })
        .catch(error => {
            alert("Error 500 - " + error);
        })

        this.hideAddGenreModal();
        this.showLoadModal();
    }

    genreEditModal(){
        return(
            <Modal
                show={this.state.show_editGenreModal}
                onHide={()=>this.hideEditGenreModal()}
                backdrop="static"
                keyboard={false}
                centered
            >
                <Modal.Header className="modalHeader" closeButton>
                    Edit Genre
                </Modal.Header>

                <Modal.Body>
                    <Form id="genre_editForm" className="contentForm" onSubmit={this.editGenre.bind(this,this.state.selected_genre_id)}>
                            <Form.Group className="mb-3" controlId="editGenre_genre">
                                <Form.Label>Genre</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    placeholder="Genre" 
                                    defaultValue={this.state.edit_genre_genre} 
                                    onChange={(value)=>this.setState({edit_genre_genre:value.target.value})} 
                                    required
                                />
                            </Form.Group>
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="muted" onClick={()=>this.hideEditGenreModal()}><b>Cancel</b></Button>
                    <Button type="submit" form="genre_editForm" variant="warning"><b>Edit Genre</b></Button>
                </Modal.Footer>
            </Modal>
        )
    }

    showEditGenreModal(i,id){
        this.setState({
            show_editGenreModal:true,
            selected_genre_index:i,
            selected_genre_id:id,
            edit_genre_genre:this.state.genre_list[i].genre
        })
    }

    hideEditGenreModal(){
        this.setState({
            show_editGenreModal:false,
            selected_genre_id:-1,
            selected_genre_index:-1,
            edit_genre_genre:"",
        })
    }

    editGenre(id,event){
        event.preventDefault();

        const url = "/cinema_project/api/admin/editGenre/"+id;

        const formData = new FormData();
        formData.append('genre',this.state.edit_genre_genre);
        
        axios.post(url,formData)
        .then(response => {
            this.hideLoadModal();
            this.getGenre();
            this.showAlert(true,response.data.message);
        })
        .catch(error => {
            alert("Error: " + error);
        })

        this.hideEditGenreModal();
        this.showLoadModal();
    }

    genreDelModal(){
        return(
            <Modal
                show={this.state.show_delGenreModal}
                onHide={()=>this.hideDelGenreModal()}
                backdrop="static"
                keyboard={false}
                centered
            >
                <Modal.Header className="modalHeader" closeButton>
                    Delete Genre
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this genre ?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="muted" onClick={()=>this.hideDelGenreModal()}><b>Cancel</b></Button>
                    <Button variant="danger" onClick={()=>this.deleteGenre(this.state.selected_genre_index,this.state.selected_genre_id)}><b>Delete</b></Button>
                </Modal.Footer>
            </Modal>
        )
    }

    hideDelGenreModal(){
        this.setState({
            show_delGenreModal:false,
            selected_genre_id:-1,
            selected_genre_index:-1,
        })
    }

    showDelGenreModal(i,id){
        this.setState({
            show_delGenreModal:true,
            selected_genre_id:id,
            selected_genre_index:i,
        })
    }

    deleteGenre(i,id){
        const url = "/cinema_project/api/admin/deleteGenre/"+id;

        axios.delete(url)
        .then(response => {
            const res = response.data;
            if(res.success){
                this.getMovies();
                this.hideLoadModal();
                this.showAlert(true,res.message);

                const list = this.state.genre_list;
                list.splice(i,1);
                this.setState({genre_list:list});
            }
            else{
                this.showAlert(false,res.message);
            }
        })

        this.hideDelGenreModal();
        this.showLoadModal();
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

    movieAddModal(){
        return(
            <Modal
                show={this.state.show_addMovieModal}
                onHide={()=>this.hideAddMovieModal()}
                backdrop="static"
                keyboard={false}
                centered
                size="lg"
            >
                <Modal.Header className="modalHeader" closeButton>
                    Add A New Movie
                </Modal.Header>

                <Modal.Body>
                    <Form id="movie_addForm" className="contentForm" onSubmit={this.addMovie.bind(this)}>
                            <Form.Group className="mb-3" controlId="addMovie_title">
                                <Form.Label>Title</Form.Label>
                                <Form.Control type="text" placeholder="Movie Title" onChange={(value)=>this.setState({add_movie_title:value.target.value})} required/>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="addMovie_cast">
                                <Form.Label>Cast</Form.Label>
                                <Form.Control type="text" placeholder="Cast" onChange={(value)=>this.setState({add_movie_cast:value.target.value})} required/>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="addMovie_director">
                                <Form.Label>Director</Form.Label>
                                <Form.Control type="text" placeholder="Director" onChange={(value)=>this.setState({add_movie_director:value.target.value})} required/>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="addMovie_distributor">
                                <Form.Label>Distributor</Form.Label>
                                <Form.Control type="text" placeholder="Distributor" onChange={(value)=>this.setState({add_movie_distributor:value.target.value})} required/>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="addMovie_synopsis">
                                <Form.Label>Synopsis</Form.Label>
                                <Form.Control as="textarea" placeholder="Enter Movie Synopsis" style={{height:'100px'}} onChange={(event)=>this.setState({add_movie_synopsis:event.target.value})} required/>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="addMovie_price">
                                <Form.Label>Price (RM)</Form.Label>
                                <Form.Control type="number" placeholder="Price" max="999" min="0" step="0.1" onChange={(value)=>this.setState({add_movie_price:value.target.value})} required/>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="addMovie_duration">
                                <Form.Label>Duration (min)</Form.Label>
                                <Form.Control type="number" placeholder="Duration" max="480" min="60" step="1" onChange={(value)=>this.setState({add_movie_duration:value.target.value})} required/>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="addMovie_genre">
                                <Form.Label>Genres</Form.Label>
                                <div key="inline-addgenre-checkbox">
                                    {this.state.genre_list.map((data,i) => {
                                        return(
                                            <Form.Check
                                                inline
                                                label={data.genre}
                                                name="movie_genre[]"
                                                type="checkbox"
                                                id={"addMovie_genreCheck_"+(i+1)}
                                                value={data.genre_id}
                                                required

                                                onChange={(e)=>this.handleGenreCheck(e.target.value)}
                                            />
                                        )
                                    })}
                                </div>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="addMovie_experience">
                                <Form.Label>Available Movie Experiences</Form.Label>
                                <div key="inline-addExp-checkbox">
                                    {this.state.exp_list.map((data,i) => {
                                        if(data.exp_id != 0){
                                            return(
                                                <Form.Check
                                                    inline
                                                    label={data.name}
                                                    name="movie_exp[]"
                                                    type="checkbox"
                                                    id={"addMovie_expCheck_"+(i+1)}
                                                    value={data.exp_id}
    
                                                    onChange={(e)=>this.handleExpCheck(e.target.value)}
                                                />
                                            )
                                        }
                                        else{
                                            return(
                                                <Form.Check
                                                    inline
                                                    label={data.name}
                                                    name="movie_exp[]"
                                                    type="checkbox"
                                                    id={"addMovie_expCheck_"+(i+1)}
                                                    value={data.exp_id}
                                                    checked
                                                    disabled

                                                    onChange={(e)=>this.handleExpCheck(e.target.value)}
                                                />
                                            )
                                        }
                                    })}
                                </div>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="addMovie_start">
                                <Form.Label>Start Show Date</Form.Label>
                                <Form.Control type="date" placeholder="Start Show Date" min={this.minDate(0)} defaultValue={this.minDate(0)} onChange={(value)=>this.setState({add_movie_start:value.target.value},this.setEndMin(value.target.value))} required/>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="addMovie_end">
                                <Form.Label>End Show Date</Form.Label>
                                <Form.Control type="date" placeholder="End Show Date" min={this.minDate(1)} defaultValue={this.minDate(1)} onChange={(value)=>this.setState({add_movie_end:value.target.value})} required/>
                            </Form.Group>
                            <Form.Group controlId="addMovie_poster" className="mb-3">
                                <Form.Label>Poster</Form.Label>
                                <Form.Control type="file" size="sm" accept="image/png,image/jpeg" onChange={(event)=>this.setState({add_movie_poster:event.target.files[0]})} required/>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="addMovie_trailer">
                                <Form.Label>Trailer Link</Form.Label>
                                <Form.Control type="text" placeholder="Trailer Link" onChange={(value)=>this.setState({add_movie_trailer:value.target.value})} required/>
                            </Form.Group>
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="muted" onClick={()=>this.hideAddMovieModal()}><b>Cancel</b></Button>
                    <Button type="submit" form="movie_addForm" variant="warning"><b>Add Movie</b></Button>
                </Modal.Footer>
            </Modal>
        )
    }

    hideAddMovieModal(){
        this.setState({
            show_addMovieModal:false,
            add_movie_title:"",
            add_movie_cast:"",
            add_movie_director:"",
            add_movie_distributor:"",
            add_movie_synopsis:"",
            add_movie_price:0,
            add_movie_duration:0,
            add_movie_genre:[],
            add_movie_exp:[0],
            add_movie_start:this.minDate(0),
            add_movie_end:this.minDate(1),
            add_movie_poster:"",
            add_movie_trailer:"",
        })
    }

    showAddMovieModal(){
        this.setState({
            show_addMovieModal:true
        })
    }

    addMovie(event){
        event.preventDefault();

        const url = "/cinema_project/api/admin/addMovie"

        const formData = new FormData();
        formData.append('title',this.state.add_movie_title);
        formData.append('cast',this.state.add_movie_cast);
        formData.append('director',this.state.add_movie_director);
        formData.append('distributor',this.state.add_movie_distributor);
        formData.append('synopsis',this.state.add_movie_synopsis);
        formData.append('price',this.state.add_movie_price);
        formData.append('duration',this.state.add_movie_duration);
        //put true when json_decode e.g. json_decode(..,true)
        formData.append('genre',JSON.stringify(this.state.add_movie_genre));
        formData.append('experience',JSON.stringify(this.state.add_movie_exp));
        formData.append('show_start',this.state.add_movie_start);
        formData.append('show_end',this.state.add_movie_end);
        formData.append('poster',this.state.add_movie_poster);
        formData.append('trailer',this.state.add_movie_trailer);

        axios.post(url,formData)
        .then(response => {
            this.hideLoadModal();
            this.getMovies();
            this.showAlert(true,response.data.message);
        })
        .catch(error => {
            alert("Error: " + error);
        })

        this.hideAddMovieModal();
        this.showLoadModal();
    }

    handleGenreCheck(id){
        var list = this.state.add_movie_genre;

        if(list.includes(id)){
            list = list.filter(i => i != id);
        }
        else{
            list.push(id);
        }
        list.sort();

        if(list.length!=0){
            var tmp = document.getElementsByName('movie_genre[]');
            for(var i=0;i<tmp.length;i++){
                tmp[i].required=false;
            }
        }
        else{
            var tmp = document.getElementsByName('movie_genre[]');
            for(var i=0;i<tmp.length;i++){
                tmp[i].required=true;
            }
        }

        this.setState({
            add_movie_genre:list
        })
    }

    handleExpCheck(id){
        var list = this.state.add_movie_exp;

        if(list.includes(id)){
            list = list.filter(i => i != id);
        }
        else{
            list.push(id);
        }
        list.sort();

        if(list.length!=0){
            var tmp = document.getElementsByName('movie_exp[]');
            for(var i=0;i<tmp.length;i++){
                tmp[i].required=false;
            }
        }
        else{
            var tmp = document.getElementsByName('movie_exp[]');
            for(var i=0;i<tmp.length;i++){
                tmp[i].required=true;
            }
        }

        this.setState({
            add_movie_exp:list
        })
    }

    minDate(offset){
        var today = new Date(new Date().getTime() + (offset * 24 * 60 * 60 * 1000));

        var date = today.getFullYear() + "-" + String(today.getMonth()+1).padStart(2, '0') + "-" + String(today.getDate()).padStart(2, '0');

        return date;
    }

    setEndMin(date){
        //console.log(date);
        var tmpDate = new Date(new Date(date).getTime() + (1 * 24 * 60 * 60 * 1000));

        var newDate = tmpDate.getFullYear() + "-" + String(tmpDate.getMonth()+1).padStart(2, '0') + "-" + String(tmpDate.getDate()).padStart(2, '0');

        document.getElementById('addMovie_end').min=newDate;
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

    movieEditModal(){
        return(
            <Modal
                show={this.state.show_editMovieModal}
                onHide={()=>this.hideEditMovieModal()}
                backdrop="static"
                keyboard={false}
                centered
                size="lg"
            >
                <Modal.Header className="modalHeader" closeButton>
                    Edit Movie
                </Modal.Header>

                <Modal.Body>
                    <Form id="movie_editForm" className="contentForm" onSubmit={this.editMovie.bind(this,this.state.selected_movie_index,this.state.selected_movie_id)}>
                            <Form.Group className="mb-3" controlId="editMovie_title">
                                <Form.Label>Title</Form.Label>
                                <Form.Control type="text" placeholder="Movie Title" defaultValue={this.state.edit_movie_title} onChange={(value)=>this.setState({edit_movie_title:value.target.value})} required/>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="editMovie_cast">
                                <Form.Label>Cast</Form.Label>
                                <Form.Control type="text" placeholder="Cast" defaultValue={this.state.edit_movie_cast} onChange={(value)=>this.setState({edit_movie_cast:value.target.value})} required/>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="editMovie_director">
                                <Form.Label>Director</Form.Label>
                                <Form.Control type="text" placeholder="Director" defaultValue={this.state.edit_movie_director} onChange={(value)=>this.setState({edit_movie_director:value.target.value})} required/>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="editMovie_distributor">
                                <Form.Label>Distributor</Form.Label>
                                <Form.Control type="text" placeholder="Distributor" defaultValue={this.state.edit_movie_distributor} onChange={(value)=>this.setState({edit_movie_distributor:value.target.value})} required/>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="editMovie_synopsis">
                                <Form.Label>Synopsis</Form.Label>
                                <Form.Control as="textarea" placeholder="Enter Movie Synopsis" defaultValue={this.state.edit_movie_synopsis} style={{height:'100px'}} onChange={(event)=>this.setState({edit_movie_synopsis:event.target.value})} required/>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="editMovie_price">
                                <Form.Label>Price (RM)</Form.Label>
                                <Form.Control type="number" placeholder="Price" max="999" min="0" step="0.1" defaultValue={this.state.edit_movie_price} onChange={(value)=>this.setState({edit_movie_price:value.target.value})} required/>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="editMovie_duration">
                                <Form.Label>Duration (min)</Form.Label>
                                <Form.Control type="number" placeholder="Duration" max="480" min="60" step="1" defaultValue={this.state.edit_movie_duration} onChange={(value)=>this.setState({edit_movie_duration:value.target.value})} required/>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="editMovie_genre">
                                <Form.Label>Genres</Form.Label>
                                <div key="inline-editgenre-checkbox">
                                    {this.state.genre_list.map((data,i) => {
                                        if(this.state.edit_movie_genre.includes(data.genre_id)){
                                            return(
                                                <Form.Check
                                                    inline
                                                    label={data.genre}
                                                    name="edit_movie_genre[]"
                                                    type="checkbox"
                                                    id={"editMovie_genreCheck_"+(i+1)}
                                                    value={data.genre_id}
                                                    checked
    
                                                    onChange={(e)=>this.handleEditGenreCheck(e.target.value)}
                                                />
                                            )
                                        }
                                        else{
                                            return(
                                                <Form.Check
                                                    inline
                                                    label={data.genre}
                                                    name="edit_movie_genre[]"
                                                    type="checkbox"
                                                    id={"editMovie_genreCheck_"+(i+1)}
                                                    value={data.genre_id}
    
                                                    onChange={(e)=>this.handleEditGenreCheck(e.target.value)}
                                                />
                                            )
                                        }
                                    })}
                                </div>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="editMovie_experience">
                                <Form.Label>Available Movie Experiences</Form.Label>
                                <div key="inline-addExp-checkbox">
                                    {this.state.exp_list.map((data,i) => {
                                        if(this.state.edit_movie_exp.includes(data.exp_id)){
                                            if(data.exp_id != 0){
                                                return(
                                                    <Form.Check
                                                        inline
                                                        label={data.name}
                                                        name="edit_movie_exp[]"
                                                        type="checkbox"
                                                        id={"editMovie_expCheck_"+(i+1)}
                                                        value={data.exp_id}
                                                        checked
                                                        onChange={(e)=>this.handleEditExpCheck(e.target.value)}
                                                    />
                                                )
                                            }
                                            else{
                                                return(
                                                    <Form.Check
                                                        inline
                                                        label={data.name}
                                                        name="edit_movie_exp[]"
                                                        type="checkbox"
                                                        id={"editMovie_expCheck_"+(i+1)}
                                                        value={data.exp_id}
                                                        checked
                                                        disabled

                                                        onChange={(e)=>this.handleEditExpCheck(e.target.value)}
                                                    />
                                                )
                                            }
                                        }
                                        else{
                                            return(
                                                <Form.Check
                                                    inline
                                                    label={data.name}
                                                    name="edit_movie_exp[]"
                                                    type="checkbox"
                                                    id={"editMovie_expCheck_"+(i+1)}
                                                    value={data.exp_id}
    
                                                    onChange={(e)=>this.handleEditExpCheck(e.target.value)}
                                                />
                                            )
                                        }
                                    })}
                                </div>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="editMovie_start">
                                <Form.Label>Start Show Date</Form.Label>
                                <Form.Control type="date" placeholder="Start Show Date" min={this.state.edit_movie_start} defaultValue={this.state.edit_movie_start} onChange={(value)=>this.setState({edit_movie_start:value.target.value},this.setEditEndMin(value.target.value))} required/>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="editMovie_end">
                                <Form.Label>End Show Date</Form.Label>
                                <Form.Control type="date" placeholder="End Show Date" min={this.editMinDate(this.state.edit_movie_start)}  defaultValue={this.state.edit_movie_end} onChange={(value)=>this.setState({edit_movie_end:value.target.value})} required/>
                            </Form.Group>
                            <Form.Group controlId="editMovie_poster" className="mb-3">
                                <Form.Label>Poster</Form.Label>
                                <Form.Control type="file" size="sm" accept="image/png,image/jpeg" onChange={(event)=>this.setState({edit_movie_poster:event.target.files[0]})}/>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="editMovie_trailer">
                                <Form.Label>Trailer Link</Form.Label>
                                <Form.Control type="text" placeholder="Trailer Link" defaultValue={this.state.edit_movie_trailer} onChange={(value)=>this.setState({edit_movie_trailer:value.target.value})} required/>
                            </Form.Group>
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="muted" onClick={()=>this.hideEditMovieModal()}><b>Cancel</b></Button>
                    <Button type="submit" form="movie_editForm" variant="warning"><b>Edit Movie</b></Button>
                </Modal.Footer>
            </Modal>
        )
    }

    hideEditMovieModal(){
        this.setState({
            show_editMovieModal:false,
            selected_movie_id:-1,
            selected_movie_index:-1,
            edit_movie_title:"",
            edit_movie_cast:"",
            edit_movie_director:"",
            edit_movie_distributor:"",
            edit_movie_synopsis:"",
            edit_movie_price:0,
            edit_movie_duration:0,
            edit_movie_genre:[],
            edit_movie_exp:[],
            edit_movie_start:this.minDate(0),
            edit_movie_end:this.minDate(1),
            edit_movie_poster:"",
            edit_movie_trailer:"",
        })
    }

    showEditMovieModal(i,id){
        var tmp_genre = [];
        for(var j=0;j<this.state.movie_list[i].genre.length;j++)
            tmp_genre.push(this.state.movie_list[i].genre[j].genre_id);
        var tmp_exp = [];
        for(var j=0;j<this.state.movie_list[i].experience.length;j++)
            tmp_exp.push(this.state.movie_list[i].experience[j].exp_id);

        this.setState({
            show_editMovieModal:true,
            selected_movie_id:id,
            selected_movie_index:i,
            edit_movie_title:this.state.movie_list[i].title,
            edit_movie_cast:this.state.movie_list[i].cast,
            edit_movie_director:this.state.movie_list[i].director,
            edit_movie_distributor:this.state.movie_list[i].distributor,
            edit_movie_synopsis:this.state.movie_list[i].synopsis,
            edit_movie_price:this.state.movie_list[i].price,
            edit_movie_duration:this.state.movie_list[i].duration,
            edit_movie_genre:tmp_genre,
            edit_movie_exp:tmp_exp,
            edit_movie_start:this.state.movie_list[i].show_start,
            edit_movie_end:this.state.movie_list[i].show_end,
            edit_movie_poster:"",
            edit_movie_trailer:this.state.movie_list[i].trailer,
        })
    }

    editMovie(i,id,event){
        event.preventDefault();

        var url = "/cinema_project/api/admin/editMovie/"+id;
        const formData = new FormData();

        formData.append('title',this.state.edit_movie_title);
        formData.append('cast',this.state.edit_movie_cast);
        formData.append('director',this.state.edit_movie_director);
        formData.append('distributor',this.state.edit_movie_distributor);
        formData.append('synopsis',this.state.edit_movie_synopsis);
        formData.append('price',this.state.edit_movie_price);
        formData.append('duration',this.state.edit_movie_duration);
        //put true when json_decode e.g. json_decode(..,true)
        formData.append('genre',JSON.stringify(this.state.edit_movie_genre));
        formData.append('experience',JSON.stringify(this.state.edit_movie_exp));
        formData.append('show_start',this.state.edit_movie_start);
        formData.append('show_end',this.state.edit_movie_end);
        formData.append('poster',this.state.edit_movie_poster);
        formData.append('trailer',this.state.edit_movie_trailer);

        axios.post(url,formData)
        .then(response => {
            this.getMovies();
            this.hideLoadModal();
            this.showAlert(true,response.data.message);
        })
        .catch(error => {
            alert("Error: " + error);
        })
        this.hideEditMovieModal();
        this.showLoadModal();
    }

    handleEditGenreCheck(id){
        var list = this.state.edit_movie_genre;

        if(list.includes(id)){
            list = list.filter(i => i != id);
        }
        else{
            list.push(id);
        }
        list.sort();

        if(list.length!=0){
            var tmp = document.getElementsByName('edit_movie_genre[]');
            for(var i=0;i<tmp.length;i++){
                tmp[i].required=false;
            }
        }
        else{
            var tmp = document.getElementsByName('edit_movie_genre[]');
            for(var i=0;i<tmp.length;i++){
                tmp[i].required=true;
            }
        }

        this.setState({
            edit_movie_genre:list
        })
    }

    handleEditExpCheck(id){
        var list = this.state.edit_movie_exp;

        if(list.includes(id)){
            list = list.filter(i => i != id);
        }
        else{
            list.push(id);
        }
        list.sort();

        if(list.length!=0){
            var tmp = document.getElementsByName('edit_movie_exp[]');
            for(var i=0;i<tmp.length;i++){
                tmp[i].required=false;
            }
        }
        else{
            var tmp = document.getElementsByName('edit_movie_exp[]');
            for(var i=0;i<tmp.length;i++){
                tmp[i].required=true;
            }
        }

        this.setState({
            edit_movie_exp:list
        })
    }

    setEditEndMin(date){
        //console.log(date);
        var tmpDate = new Date(new Date(date).getTime() + (1 * 24 * 60 * 60 * 1000));

        var newDate = tmpDate.getFullYear() + "-" + String(tmpDate.getMonth()+1).padStart(2, '0') + "-" + String(tmpDate.getDate()).padStart(2, '0');

        document.getElementById('editMovie_end').min=newDate;
    }

    editMinDate(date){
        var tmpDate = new Date(new Date(date).getTime() + (1 * 24 * 60 * 60 * 1000));

        var newDate = tmpDate.getFullYear() + "-" + String(tmpDate.getMonth()+1).padStart(2, '0') + "-" + String(tmpDate.getDate()).padStart(2, '0');

        return newDate;
    }

    movieDelModal(){
        return(
            <Modal
                show={this.state.show_delMovieModal}
                onHide={()=>this.hideDelMovieModal()}
                backdrop="static"
                keyboard={false}
                centered
            >
                <Modal.Header className="modalHeader" closeButton>
                    Delete Movie
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this movie ?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="muted" onClick={()=>this.hideDelMovieModal()}><b>Cancel</b></Button>
                    <Button variant="danger" onClick={()=>this.deleteMovie(this.state.selected_movie_index,this.state.selected_movie_id)}><b>Delete</b></Button>
                </Modal.Footer>
            </Modal>
        )
    }

    hideDelMovieModal(){
        this.setState({
            show_delMovieModal:false,
            selected_movie_id:-1,
            selected_movie_index:-1,
        })
    }

    showDelMovieModal(i,id){
        this.setState({
            show_delMovieModal:true,
            selected_movie_id:id,
            selected_movie_index:i,
        })
    }

    deleteMovie(i,id){
        var url = "/cinema_project/api/admin/deleteMovie/"+id;
        
        axios.delete(url)
        .then(response => {
            this.hideLoadModal();
            this.showAlert(true,response.data.message);

            const list = this.state.movie_list;
            list.splice(i,1);
            this.setState({movie_list:list},()=>{this.getTotalPages()});
        })
        .catch(error => {
            alert("Error: "+error);
        })

        this.hideDelMovieModal();
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
        if(this.state.movie_list.length!=0){
            var n_pages = Math.ceil(this.state.movie_list.length/this.state.item_limit);
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

    handleFilterChange(key){
        this.setState({
            filter_by:key,
            filter_option:-1
        })
    }

    showFilterOptions(){
        switch(this.state.filter_by){
            case "none":
                return(
                    <Dropdown.Item active={this.state.filter_option===-1} eventKey={-1}>None</Dropdown.Item>
                )
                break;
            case "show":
                return(
                    <>
                        <Dropdown.Item active={this.state.filter_option===-1} eventKey={-1}>All</Dropdown.Item>
                        <Dropdown.Item active={this.state.filter_option===1} eventKey={1}>Now Showing</Dropdown.Item>
                        <Dropdown.Item active={this.state.filter_option===2} eventKey={2}>Upcoming</Dropdown.Item>
                    </>
                )
                break;
            case "genre":
                return this.state.genre_list.map((data,i)=>{
                    if(i==0){
                        return(
                            <>
                                <Dropdown.Item active={this.state.filter_option===-1} eventKey={-1}>All</Dropdown.Item>
                                <Dropdown.Item active={this.state.filter_option===data.genre_id} eventKey={data.genre_id}>{data.genre}</Dropdown.Item>
                            </>
                        )
                    }
                    else{
                        return(
                            <Dropdown.Item active={this.state.filter_option===data.genre_id} eventKey={data.genre_id}>{data.genre}</Dropdown.Item>
                        )
                    }
                })
                break;
            case "exp":
                return this.state.exp_list.map((data,i)=>{
                    if(i==0){
                        return(
                            <>
                                <Dropdown.Item active={this.state.filter_option===-1} eventKey={-1}>All</Dropdown.Item>
                                <Dropdown.Item active={this.state.filter_option===data.exp_id} eventKey={data.exp_id}>{data.name}</Dropdown.Item>
                            </>
                        )
                    }
                    else{
                        return(
                            <Dropdown.Item active={this.state.filter_option===data.exp_id} eventKey={data.exp_id}>{data.name}</Dropdown.Item>
                        )
                    }
                })
                break;
        }
    }

    handleFilterOptionChange(key){
        this.setState({
            filter_option:key
        })
    }

    getFilteredMovies(){
        const url = "/cinema_project/api/admin/filterMovies";
        const formData = new FormData();
        
        if(this.state.filter_by != "none" && this.state.filter_option != -1){
            formData.append("filter_by",this.state.filter_by);
            formData.append("filter_option",this.state.filter_option);
        }
        if(this.state.searchTerm != undefined){
            formData.append("search",this.state.searchTerm);
        }

        if(!(formData.entries().next().done)){
            axios.post(url,formData)
            .then(response=>{
                this.setState({
                    movie_list:response.data.data
                })
                this.hideLoadModal();
            })
            .catch(error => {
                alert("Error: "+error);
            })
            this.showLoadModal()
        }
        else{
            this.getMovies();
        }
    }

    updateSentiment(){
        const url = "/cinema_project/api/admin/runSentimentScript"
        
        axios.get(url)
        .then(response => {
            this.hideLoadModal();
            this.showAlert(true,response.data.message);
        })
        .catch(error => {
            alert("Error: "+error);
        })

        this.showLoadModal();
    }
}