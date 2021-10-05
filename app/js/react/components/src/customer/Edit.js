import React, {Component} from 'react';
import axios from 'axios';

export default class Edit extends Component{

    constructor(){
        super();
        this.state = {
            id:0,
            fieldName:'',
            fieldEmail:'',
            fieldAddress:'',
            fieldPhone:''
        }
    }

    componentDidMount(){
        const user_id = this.props.match.params.id;
        const url = "/cinema_project/api/customer/get/"+user_id;
        axios.get(url)
        .then(response => {
            const res = response.data

            if(res.success){
                console.log(res.data);
                this.setState({
                    id:res.data.id,
                    fieldName: res.data.name,
                    fieldEmail: res.data.email,
                    fieldAddress: res.data.address,
                    fieldPhone: res.data.phone
                })
            }
        })
        .catch(error => {
            alert("ERROR 500 "+error);
        })
    }

    render(){

        let userId = this.props.match.params.id;
        
        return(
            <div>
                <h4>Edit customer {userId} </h4>
                <hr />
                <div class="row">
                <div class="col-md-6 mb-3">
                    <label for="firstName">Name customer</label>
                    <input type="text" class="form-control" 
                    value={this.state.fieldName} 
                    onChange={(event) => this.setState({fieldName: event.target.value})}/>
                </div>
                </div>

                        <div class="row">
                <div class="col-md-6 mb-3">
                                <label for="email">Email</label>
                    <input type="email" class="form-control" placeholder="you@example.com" 
                    value={this.state.fieldEmail} 
                    onChange={(event) => this.setState({fieldName: event.target.value})}/>
                </div>
                </div>

                        <div class="row">
                <div class="col-md-6 mb-3">
                                <label for="address">Address</label>
                    <input type="text" class="form-control" placeholder="1234 Main St" 
                    value={this.state.fieldAddress} 
                    onChange={(event) => this.setState({fieldName: event.target.value})}/>
                </div>
                </div>

                        <div class="row">
                <div class="col-md-6 mb-3">
                                <label for="address">Phone </label>
                    <input type="text" class="form-control" placeholder="123467890" 
                    value={this.state.fieldPhone} 
                    onChange={(event) => this.setState({fieldName: event.target.value})}/>
                </div>
                </div>

                <div class="row">
                    <div class="col-md-6 mb-3">
                <button onClick={()=>this.onClickUpdate()} class="btn btn-primary btn-block" type="submit">Save</button>
                    </div>
                </div>
            </div>
        )
    }

    onClickUpdate(){
        const id = this.state.id;
        const baseURL = "/cinema_project/api/customer/update/"+id;

        const data = {
            name: this.state.fieldName,
            email: this.state.fieldEmail,
            address: this.state.fieldAddress,
            phone: this.state.fieldPhone
        }

        axios.put(baseURL,data)
        .then(response=>{
            alert(response.data.message);
        })
        .catch(error=>{
            alert("Error "+error);
        })
    }
}

