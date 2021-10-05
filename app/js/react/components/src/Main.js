import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router,
        Switch,
        Route} from 'react-router-dom';
import Customer from './customer/Customer';
import Admin from './admin/Admin';

export default class Main extends Component{
    render(){
        
        let cur_path='/cinema_project';
        let customer_path= cur_path;
        let admin_path= cur_path + "/admin";

        return(
            <Router>
                <Switch>
                    <Route path={admin_path} component={Admin}/>
                    <Route path={customer_path} component={Customer}/>
                </Switch>
            </Router>
            
        )
    }
}
//render Main component at id='main'
ReactDOM.render(<Main/>,document.getElementById('main'));