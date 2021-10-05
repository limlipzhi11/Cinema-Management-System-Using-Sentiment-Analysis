import React,{Component} from 'react';
import {Redirect} from 'react-router-dom';
import axios from 'axios';

export default class Session extends Component{

    constructor(){
        super();
        this.state = {
            isLogged:true,
            id:0,
            admin_group:0,
        }
    }

    componentDidMount(){
        this.getSession()
    }

    render(){
        return(
            <div>
                {this.redirect()}
            </div>
        )
    }

    getSession(){
        const baseURL = "/cinema_project/api/admin/session";

        axios.get(baseURL)
        .then(response => {
            //console.log(response.data);
            if(response.data.success){
                this.setState({
                    isLogged: response.data.isLogged,
                    id: response.data.id,
                    admin_group: response.data.admin_group
                })
            }
            else{
                this.setState({
                    isLogged: false
                })
            }
        })
        .catch(error => {
            console.log("Error: "+error);
        })
    }

    redirect(){
        if(!this.state.isLogged){
            return <Redirect to="/cinema_project/admin"/>
        }
    }
}