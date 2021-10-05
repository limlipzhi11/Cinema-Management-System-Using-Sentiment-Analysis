//Admin Login Component
import React,{Component} from 'react';
import {Route,Redirect} from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import axios from 'axios';

import styles from './css/common/common.css';

export default class Login extends Component{

    constructor(){
        super();
        this.state = {
            fieldEmail:"",
            fieldPassword:"",
            validEmail:true,
            validPassword:true,
            errorEmail:"",
            errorPassword:"",
            isAuthenticated:false,
        }
    }

    render(){
        return(
            <Container fluid style={{backgroundImage:"url(/cinema_project/public/img/admin_login_bg.png)",height:"100%"}}>
                <Row className="justify-content-sm-center">
                    <Col sm="4" style={{marginTop:"10%"}}>
                        <div className="login">
                            <Row className="justify-content-sm-center">
                                <img src="/cinema_project/public/img/logo.png" height="125px"/>
                            </Row>
                            <Row className="justify-content-sm-center" style={{marginTop:"10px"}}>
                                <Card className="shadow-lg" border="light" style={{width:"100%"}}>
                                    <Card.Body>
                                        <Form>
                                            <Row className="justify-content-sm-center">
                                                <Col sm="auto" style={{marginTop:"3%"}}>
                                                    <Card.Title style={{fontWeight:"bold"}}>Sign In</Card.Title>
                                                </Col>
                                            </Row>
                                            
                                            <Row>
                                                <Col sm="12">
                                                    <Form.Group controlId="emailField">
                                                        <Form.Label>Email Address</Form.Label>
                                                        <Form.Control 
                                                            type="email" 
                                                            placeholder="abcd@gmail.com" 
                                                            value={this.state.fieldEmail} 
                                                            onChange={(value) => this.setState({fieldEmail: value.target.value})}
                                                            isInvalid={!this.state.validEmail}
                                                        />
                                                        <Form.Control.Feedback type="invalid">
                                                            {this.state.errorEmail}
                                                        </Form.Control.Feedback>
                                                    </Form.Group>
                                                </Col>
                                            </Row>

                                            <Row>
                                                <Col sm="12">
                                                    <Form.Group controlId="passwordField">
                                                        <Form.Label>Password</Form.Label>
                                                        <Form.Control 
                                                            type="password" 
                                                            placeholder="Password" 
                                                            value={this.state.fieldPassword} 
                                                            onChange={(value) => this.setState({fieldPassword: value.target.value})}
                                                            isInvalid={!this.state.validPassword}
                                                        />
                                                        <Form.Control.Feedback type="invalid">
                                                            {this.state.errorPassword}
                                                        </Form.Control.Feedback>
                                                    </Form.Group>
                                                </Col>  
                                            </Row>
                                            
                                            <Row>
                                                <Col sm="12" style={{marginBottom:"3%"}}>
                                                    <Button onClick={()=>this.login()} variant="warning" block>Sign In</Button> 
                                                </Col>
                                            </Row>
                                        </Form>
                                    </Card.Body>
                                </Card>
                            </Row>
                        </div>
                    </Col>
                </Row>
                {this.redirect()}
            </Container>
        );
    }

    login(){
        const baseURL = "/cinema_project/api/admin/login";

        const dataPost = {
            email :this.state.fieldEmail,
            password:this.state.fieldPassword
        };
        //console.log(dataPost);

        axios.post(baseURL,dataPost)
        .then(response => {
            //console.log(response.data.message);
            if(response.data.success){
                this.setState({validEmail:true,validPassword:true,isAuthenticated:true});
            }
            else{
                if(response.data.message.email){
                    this.setState({validEmail: false, errorEmail:response.data.message.email});
                }
                else{
                    this.setState({validEmail: true});
                }

                if(response.data.message.password){
                    this.setState({validPassword: false, errorPassword:response.data.message.password});
                }
                else{
                    this.setState({validPassword: true});
                }
            }
        })
        .catch(error => {alert("Error 500 " + error)})
    }

    redirect(){
        if(this.state.isAuthenticated){
            return <Redirect push to='/cinema_project/admin/dashboard'/>;
        }
    }
}