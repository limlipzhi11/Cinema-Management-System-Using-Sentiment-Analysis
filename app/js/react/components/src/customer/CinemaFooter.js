import React,{Component} from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Card from 'react-bootstrap/Card';
import styles from './css/common.css';
import Button from 'react-bootstrap/esm/Button';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import * as Icons from '@fortawesome/free-solid-svg-icons';
import * as Brands from '@fortawesome/free-brands-svg-icons';
import axios from 'axios';
import NavbarCollapse from 'react-bootstrap/esm/NavbarCollapse';

export default class CinemaFooter extends Component{

    constructor(){
        super();
        this.state={
        }
    }

    componentDidMount(){
    }

    render(){
        return(
            <Col fluid className="no-margin-padding cust_footer shadow">
                <Row className="footer_container">
                    <Col xs={4} className="text-center">
                        <Row className="no-margin-padding">
                            <Col className="no-margin-padding">
                                <img className="footer_logo" src="/cinema_project/public/img/logo_black.png"/>  
                            </Col>
                        </Row>
                        <Row className="no-margin-padding mx-auto mt-2" id="brands-container">
                            <Col>
                                <FontAwesomeIcon icon={Brands.faFacebookF}/>
                            </Col>
                            <Col>
                                <FontAwesomeIcon icon={Brands.faInstagram}/>
                            </Col>
                            <Col>
                                <FontAwesomeIcon icon={Brands.faTwitter}/>
                            </Col>
                            <Col>
                                <FontAwesomeIcon icon={Brands.faYoutube}/>
                            </Col>
                        </Row>
                        
                    </Col>

                    <Col xs={2} >
                        <Row className="no-margin-padding">
                            <Col className="no-margin-padding font-weight-bold">
                                About
                            </Col>
                        </Row>
                        <Row className="no-margin-padding">
                            <Col className="no-margin-padding">
                                About Us
                            </Col>
                        </Row>
                        <Row className="no-margin-padding">
                            <Col className="no-margin-padding">
                                Careers
                            </Col>
                        </Row>
                        <Row className="no-margin-padding">
                            <Col className="no-margin-padding">
                                Contact Us
                            </Col>
                        </Row>
                    </Col>

                    <Col xs={2} >
                        <Row className="no-margin-padding">
                            <Col className="no-margin-padding font-weight-bold">
                                Promotions
                            </Col>
                        </Row>
                        <Row className="no-margin-padding">
                            <Col className="no-margin-padding">
                                Food And Beverages
                            </Col>
                        </Row>
                        <Row className="no-margin-padding">
                            <Col className="no-margin-padding">
                                General
                            </Col>
                        </Row>
                        <Row className="no-margin-padding">
                            <Col className="no-margin-padding">
                                Partnership
                            </Col>
                        </Row>
                    </Col>

                    <Col xs={2} >
                        <Row className="no-margin-padding">
                            <Col className="no-margin-padding font-weight-bold">
                                Others
                            </Col>
                        </Row>
                        <Row className="no-margin-padding">
                            <Col className="no-margin-padding">
                                FAQ
                            </Col>
                        </Row>
                        <Row className="no-margin-padding">
                            <Col className="no-margin-padding">
                                Downloads
                            </Col>
                        </Row>
                        <Row className="no-margin-padding">
                            <Col className="no-margin-padding">
                                Support
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row className="mt-auto text-center mb-2">
                    <Col>
                        <small>Copyright Reserved &copy; 2021 Imperial Cinemas Sdn. Bhd. All Rights Reserved.</small>
                    </Col>
                </Row>
            </Col>
        )
    }
}