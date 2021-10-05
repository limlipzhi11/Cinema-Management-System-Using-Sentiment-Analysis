import React,{Component} from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import styles from './css/common.css';
import Button from 'react-bootstrap/esm/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Image from 'react-bootstrap/Image';
import Overlay from 'react-bootstrap/Overlay';
import Card from 'react-bootstrap/Card';
import Toast from 'react-bootstrap/Toast';
import InputGroup from 'react-bootstrap/InputGroup';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import * as Icons from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import NavbarCollapse from 'react-bootstrap/esm/NavbarCollapse';

export default class CinemaNav extends Component{

    constructor(){
        super();
        this.state={
            isLogged:false,

            show_loginModal:false,
            show_registerModal:false,
            show_toast:false,
            show_searchModal:false,

            show_userOverlay:false,

            login_email:"",
            login_pw:"",

            reg_name:"",
            reg_email:"",
            reg_pw:"",
            reg_confpw:"",
            reg_phone:"",
            reg_addr:"",

            validEmail:true,
            validPw:true,
            errorEmail:"",
            errorPw:"",

            validRegName:true,
            validRegEmail:true,
            validRegPw:true,
            validRegConfPw:true,
            validRegPhone:true,
            validRegAddr:true,
            errorRegName:"",
            errorRegEmail:"",
            errorRegPw:"",
            errorRegConfPw:"",
            errorRegPhone:"",
            errorRegAddr:"",

            toast_title:"",
            toast_msg:"",

            search_term:"",
            search_result:[],
        }

        this.overlayRef = React.createRef();
        this.overlayRefSmall = React.createRef();
        this.loginFunction = this.showLoginModal.bind(this);
    }

    componentDidMount(){
        this.getSession();
        if(this.props.forceLogin != undefined){
            this.props.forceLogin(this.loginFunction)
        }
    }

    render(){
        return(
            <>
                <Navbar id="cust_navbar" className="font-weight-bold text-dark shadow" collapseOnSelect expand="md" bg="warning" fixed="top" variant="light">
                    <Container className="no-margin-padding" fluid>
                        <Navbar.Brand id="navlogo" href="/cinema_project/">
                            <Image src="/cinema_project/public/img/logo_black.png"/>
                        </Navbar.Brand>
                        <Navbar.Brand id="navlogo_small" href="/cinema_project/">
                            <Image src="/cinema_project/public/img/logo_small.png"/>
                        </Navbar.Brand>

                        <Nav id="nav_btn_small" className="ml-auto">
                            <Row className="no-margin-padding">
                                {
                                    this.state.isLogged
                                    ?
                                    <Col className="no-margin-padding my-auto mr-3">
                                        <Nav.Link ref={this.overlayRefSmall} onClick={()=>this.setState({show_userOverlay:!this.state.show_userOverlay})}>
                                            <FontAwesomeIcon className="btnIcon" icon={Icons.faUser}/>
                                        </Nav.Link>
                                        <Overlay target={this.overlayRefSmall.current} show={this.state.show_userOverlay} placement="bottom">
                                            <div className="userOverlay show_when_small">
                                                {this.printOverlay()}
                                            </div>
                                        </Overlay>
                                    </Col>
                                    :
                                    <Col className="no-margin-padding my-auto mr-3">
                                        <Nav.Link onClick={()=>this.showLoginModal()}>
                                            <FontAwesomeIcon className="btnIcon" icon={Icons.faUser}/>
                                        </Nav.Link>
                                    </Col>
                                }
                                <Col className="no-margin-padding my-auto mr-3">
                                    <Nav.Link onClick={()=>this.showSearhModal()}>
                                        <FontAwesomeIcon className="btnIcon" icon={Icons.faSearch}/>
                                    </Nav.Link>
                                </Col>
                            </Row>
                        </Nav>

                        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                        <Navbar.Collapse id="responsive-navbar-nav">
                            <Nav className="me-auto">
                                <Nav.Link href="/cinema_project/movies">Movies</Nav.Link>
                            </Nav>
                            <Nav id="nav_btn" className="ml-auto">
                                {
                                    this.state.isLogged
                                    ?
                                    <>
                                        <Nav.Link ref={this.overlayRef} onClick={()=>this.setState({show_userOverlay:!this.state.show_userOverlay})}>
                                            <FontAwesomeIcon className="btnIcon" icon={Icons.faUser}/>
                                            Profile
                                        </Nav.Link>
                                        <Overlay target={this.overlayRef.current} show={this.state.show_userOverlay} placement="bottom">
                                            <div className="userOverlay show_when_big">
                                                {this.printOverlay()}
                                            </div>
                                        </Overlay>
                                    </>
                                    :
                                    <Nav.Link onClick={()=>this.showLoginModal()}>
                                        <FontAwesomeIcon className="btnIcon" icon={Icons.faUser}/>
                                        Log In
                                    </Nav.Link>
                                }
                                <Nav.Link onClick={()=>this.showSearhModal()}>
                                    <FontAwesomeIcon className="btnIcon" icon={Icons.faSearch}/>
                                    Search
                                </Nav.Link>
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
                {this.loginModal()}
                {this.registerModal()}
                {this.toast()}
                {this.searchModal()}
            </>
        )
    }

    getSession(){
        const url = "/cinema_project/api/getCustSession";

        axios.get(url)
        .then(response => {
            if(response.data.success){
                this.setState({
                    isLogged:true,
                    validEmail:true,
                    validPw:true,
                })

                this.props.loginHandler(response.data.data.isLogged,response.data.data.cust_id);
                if(this.props.syncLogged != undefined){
                    this.props.syncLogged(response.data.data.isLogged,response.data.data.cust_id)
                }
            }
        })
        .catch(error => {
            alert("Error: "+error);
        })
    }

    loginModal(){
        return(
            <Modal
                show={this.state.show_loginModal}
                onHide={()=>this.hideLoginModal()}
                backdrop="static"
                keyboard={false}
                centered
            >   
                <Modal.Header className="border-0" closeButton>
                    <Modal.Title className="font-weight-bold">
                        Login
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form id="login_Form" className="contentForm" onSubmit={this.login.bind(this)}>
                        <Form.Group className="mb-3" controlId="form_email">
                            <Form.Label>E-mail</Form.Label>
                            <Form.Control 
                                type="text" 
                                required 
                                placeholder="E-mail" 
                                onChange={(e)=>this.setState({login_email:e.target.value})}
                                isInvalid={!this.state.validEmail}
                            />
                            <Form.Control.Feedback type="invalid">
                                {this.state.errorEmail}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="form_pw" className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control 
                                type="password" 
                                required 
                                placeholder="Password" 
                                onChange={(e)=>this.setState({login_pw:e.target.value})}
                                isInvalid={!this.state.validPw}
                            />
                            <Form.Control.Feedback type="invalid">
                                {this.state.errorPw}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer className="border-0">
                    <Button className="mb-3 cust_login_btn" type="submit" form="login_Form" variant="warning"><b>Login</b></Button>
                   <span className="mx-auto mt-3 mb-2">Don't Have An Account ? <a className="text-primary" onClick={()=>this.showRegisterModal()}>Register Account</a> </span>
                </Modal.Footer>
            </Modal>
        )
    }

    showLoginModal(){
        this.setState({
            show_loginModal:true,
        })
    }

    hideLoginModal(){
        this.setState({
            show_loginModal:false,
            login_email:"",
            login_pw:"",
        })
    }

    login(event){
        event.preventDefault();
        
        const url = "/cinema_project/api/loginCustomer";
        const formdata = new FormData();

        formdata.append('email',this.state.login_email);
        formdata.append('password',this.state.login_pw);

        axios.post(url,formdata)
        .then(response => {
            if(response.data.success){
                var data = response.data.data;
                this.setState({
                    isLogged:true,
                    validEmail:true,
                    validPw:true,
                })
                this.props.loginHandler(data.isLogged,data.cust_id)
                if(this.props.syncLogged != undefined){
                    this.props.syncLogged(data.isLogged,data.cust_id)
                }
                
                this.hideLoginModal();
                this.showToast("Login",response.data.message);
            }
            else{
                if(response.data.message.email){
                    this.setState({validEmail: false, errorEmail:response.data.message.email});
                }
                else{
                    this.setState({validEmail: true});
                }

                if(response.data.message.password){
                    this.setState({validPw: false, errorPw:response.data.message.password});
                }
                else{
                    this.setState({validPw: true});
                }
            }
        })
        .catch(error => {
            alert("Error: "+error);
        })
    }

    registerModal(){
        return(
            <Modal
                show={this.state.show_registerModal}
                onHide={()=>this.hideRegisterModal()}
                backdrop="static"
                keyboard={false}
                centered
            >   
                <Modal.Header className="border-0" closeButton>
                    <Modal.Title className="font-weight-bold">
                        Sign Up
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form id="register_Form" className="contentForm" onSubmit={this.register.bind(this)}>
                        <Form.Group className="mb-3" controlId="form_name">
                            <Form.Label>Name</Form.Label>
                            <Form.Control 
                                type="text" 
                                required 
                                placeholder="Name" 
                                onChange={(e)=>this.setState({reg_name:e.target.value})}
                                isInvalid={!this.state.validRegName}
                            />
                            <Form.Control.Feedback type="invalid">
                                {this.state.errorRegName}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="form_email">
                            <Form.Label>E-mail</Form.Label>
                            <Form.Control 
                                type="email" 
                                required 
                                placeholder="E-mail" 
                                onChange={(e)=>this.setState({reg_email:e.target.value})}
                                isInvalid={!this.state.validRegEmail}
                            />
                            <Form.Control.Feedback type="invalid">
                                {this.state.errorRegEmail}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Row className="no-margin-padding">
                            <Col className="no-margin-padding mr-1">
                                <Form.Group controlId="form_pw" className="mb-3">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control 
                                        type="password" 
                                        required 
                                        placeholder="Password" 
                                        onChange={(e)=>this.setState({reg_pw:e.target.value})}
                                        isInvalid={!this.state.validRegPw}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {this.state.errorRegPw}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col className="no-margin-padding ml-1">
                                <Form.Group controlId="form_cpw" className="mb-3">
                                    <Form.Label>Confirm Password</Form.Label>
                                    <Form.Control 
                                        type="password" 
                                        required 
                                        placeholder="Confirm Password" 
                                        onChange={(e)=>this.setState({reg_confpw:e.target.value})}
                                        isInvalid={!this.state.validRegConfPw}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {this.state.errorRegConfPw}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group controlId="form_phone" className="mb-3">
                            <Form.Label>Phone Number</Form.Label>
                            <Form.Control 
                                type="tel" 
                                required 
                                placeholder="Phone Number"
                                pattern="[0-9]{10}"
                                onChange={(e)=>this.setState({reg_phone:e.target.value})}
                                isInvalid={!this.state.validRegPhone}
                            />
                            <Form.Control.Feedback type="invalid">
                                {this.state.errorRegPhone}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="form_addr">
                            <Form.Label>Address</Form.Label>
                            <Form.Control 
                                type="text" 
                                required 
                                placeholder="Address" 
                                onChange={(e)=>this.setState({reg_addr:e.target.value})}
                                isInvalid={!this.state.validRegAddr}
                            />
                            <Form.Control.Feedback type="invalid">
                                {this.state.errorRegAddr}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer className="border-0">
                    <Button className="mb-3 cust_login_btn" type="submit" form="register_Form" variant="warning"><b>Sign Up</b></Button>
                </Modal.Footer>
            </Modal>
        )
    }

    hideRegisterModal(){
        this.setState({
            show_registerModal:false,
            reg_name:"",
            reg_email:"",
            reg_pw:"",
            reg_confpw:"",
            reg_phone:"",
            reg_addr:"",
            validRegName:true,
            validRegEmail:true,
            validRegPw:true,
            validRegConfPw:true,
            validRegPhone:true,
            validRegAddr:true,
            errorRegName:"",
            errorRegEmail:"",
            errorRegPw:"",
            errorRegConfPw:"",
            errorRegPhone:"",
            errorRegAddr:"",
        })
    }

    showRegisterModal(){
        this.setState({
            show_registerModal:true,
        })
        this.hideLoginModal();
    }

    register(event){
        event.preventDefault();

        const url="/cinema_project/api/addCustomer";
        const formdata = new FormData();

        formdata.append('name',this.state.reg_name);
        formdata.append('email',this.state.reg_email);
        formdata.append('password',this.state.reg_pw);
        formdata.append('confpassword',this.state.reg_confpw);
        formdata.append('phone',this.state.reg_phone);
        formdata.append('address',this.state.reg_addr);

        axios.post(url,formdata)
        .then(response => {
            if(response.data.success){
                this.setState({
                    validRegName:true,
                    validRegEmail:true,
                    validRegPw:true,
                    validRegConfPw:true,
                    validRegPhone:true,
                    validRegAddr:true,
                    errorRegName:"",
                    errorRegEmail:"",
                    errorRegPw:"",
                    errorRegConfPw:"",
                    errorRegPhone:"",
                    errorRegAddr:"",
                })
                this.hideRegisterModal();
                this.showLoginModal();
            }
            else{
                var msg = response.data.message;
                if(msg.name){
                    this.setState({validRegName: false, errorRegName:msg.name});
                }
                else{
                    this.setState({validRegName: true, errorRegName:""});
                }

                if(msg.email){
                    this.setState({validRegEmail: false, errorRegEmail:msg.email});
                }
                else{
                    this.setState({validRegEmail: true, errorRegEmail:""});
                }

                if(msg.password){
                    this.setState({validRegPw: false, errorRegPw:msg.password});
                }
                else{
                    this.setState({validRegPw: true, errorRegPw:""});
                }

                if(msg.confpassword){
                    this.setState({validRegConfPw: false, errorRegConfPw:msg.confpassword});
                }
                else{
                    this.setState({validRegConfPw: true, errorRegConfPw:""});
                }

                if(msg.phone){
                    this.setState({validRegPhone: false, errorRegPhone:msg.phone});
                }
                else{
                    this.setState({validRegPhone: true, errorRegPhone:""});
                }

                if(msg.address){
                    this.setState({validRegAddr: false, errorRegAddr:msg.address});
                }
                else{
                    this.setState({validRegAddr: true, errorRegAddr:""});
                }
            }
        })
        .catch(error => {
            alert("Error:" + error)
        })
    }

    printOverlay(){
        return(
            <Card>
                <Card.Body className="overlayBody">
                    <Row className="no-margin-padding">
                        <Col className="no-margin-padding font-weight-bold">
                            User
                        </Col>
                    </Row>
                    <Nav id="user_nav">
                        <Nav.Link href="/cinema_project/custBooking">
                            My Bookings
                        </Nav.Link>
                    </Nav>
                </Card.Body>
                <Card.Footer className="overlayFooter">
                    <Nav>
                        <Nav.Link onClick={()=>this.logout()}>
                            Log Out
                        </Nav.Link>
                    </Nav>
                </Card.Footer>
            </Card>
        )
    }

    logout(){
        const url = "/cinema_project/api/logoutCustomer";

        axios.get(url)
        .then(response => {
            this.setState({
                isLogged:false,
                show_userOverlay:false,
            })

            this.props.loginHandler(false,-1);
            if(this.props.syncLogged != undefined){
                this.props.syncLogged(false,-1)
            }
            this.showToast("Logout",response.data.message);
        })
        .catch(error => {
            alert("Error: "+error);
        })
    }

    toast(){
        return (
            <Toast className="toast" show={this.state.show_toast} autohide onClose={()=>this.hideToast()}>
                <Toast.Header>
                    <strong className="mr-auto">{this.state.toast_title}</strong>
                </Toast.Header>
                <Toast.Body>{this.state.toast_msg}</Toast.Body>
            </Toast>
        )
    }

    showToast(title,msg){
        this.setState({
            show_toast:true,
            toast_title:title,
            toast_msg:msg,
        })
    }

    hideToast(){
        this.setState({
            show_toast:false,
            toast_title:"",
            toast_msg:"",
        })
    }

    searchModal(){
        return (
            <Modal 
                show={this.state.show_searchModal} 
                className="forceFullScreen"
                onHide={()=>this.hideSearchModal()}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header className="border-0 bg-warning" closeButton>
                    <Navbar.Brand id="navlogo" href="/cinema_project/">
                        <Image src="/cinema_project/public/img/logo_black.png"/>
                    </Navbar.Brand>
                    <Navbar.Brand id="navlogo_small" href="/cinema_project/">
                        <Image src="/cinema_project/public/img/logo_small.png"/>
                    </Navbar.Brand>
                    <Row className="w-75 no-margin-padding my-auto">
                        <Col>
                            <InputGroup>
                                <Form.Control
                                    placeholder="Search For a Movie"
                                    type="text"
                                    onChange={(e)=>this.setState({search_term:e.target.value})}
                                />
                                <Button variant="dark" className="search_btn font-weight-bold" onClick={()=>this.getSearchResult()}>
                                    <FontAwesomeIcon icon={Icons.faSearch} className="btnIcon"/>Search
                                </Button>
                            </InputGroup>
                        </Col>
                    </Row>
                </Modal.Header>
                <Modal.Body>
                    <Row className="w-100 no-margin-padding">
                        {this.printSearchResult()}
                    </Row>
                </Modal.Body>
            </Modal>
        )
    }

    showSearhModal(){
        this.setState({
            show_searchModal:true
        })
    }

    hideSearchModal(){
        this.setState({
            show_searchModal:false,
            search_term:"",
            search_result:[],
        })
    }

    printSearchResult(){
        if(this.state.search_result.length != 0){
            return this.state.search_result.map((data,i) => {
                return(
                    <Col xs={3} className="justify-content-center d-flex carousel_poster_item mt-4">
                        <div className="img_hover_bg z-1050" style={{zIndex:1}}/>
                        <Image className="content_carousel_img search_result_img" src={data.poster}/>
                        <div className="img_hover_container" style={{zIndex:3}}>
                            <div className="w-100">
                                <Row className="my-4 no-margin-padding">
                                    <div className="img_hover_text">{data.title}</div>
                                </Row>
                                <Row className="my-2 no-margin-padding">
                                    <Nav.Link href={"/cinema_project/movieDetail/"+data.movie_id} className="w-100 no-margin-padding">
                                        <Button className="img_hover_btn solid" size="sm" variant="light">Book Now</Button>
                                    </Nav.Link>
                                </Row>
                                <Row className="my-2 no-margin-padding">
                                    <Nav.Link href={"/cinema_project/movieDetail/"+data.movie_id} className="w-100  no-margin-padding">
                                        <Button size="sm" className="img_hover_btn outline" variant="outline-light">More Info</Button>
                                    </Nav.Link>
                                </Row>
                            </div>
                        </div>
                    </Col>
                )
            })
        }
        else{
            return(
                <Col className="justify-content-center align-items-center d-flex carousel_poster_item mt-4" style={{height:"76vh"}}>
                    <h3>No Movies Found!</h3>
                </Col>
            )
        }
    }

    getSearchResult(){
        const url = "/cinema_project/api/searchMovie";
        const formData = new FormData();

        formData.append('search_term',this.state.search_term);

        axios.post(url,formData)
        .then(response => {
            this.setState({
                search_result:response.data.data
            })
        })
        .catch(error => {
            alert("Error: "+error);
        })
    }
}