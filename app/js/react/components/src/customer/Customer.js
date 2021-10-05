import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router,
        Switch,
        Route} from 'react-router-dom';
import Home from './Home';
import MoviesList from './MoviesList';
import MovieDetail from './MovieDetail';
import Booking from './Booking';
import CustBooking from './CustBooking';
import CustBookingDetail from './CustBookingDetail';

export default class Customer extends Component{
    render(){
        
        let cur_path='/cinema_project';
        let home_path= cur_path+"/";
        let movie_list_path = cur_path + "/movies";
        let movie_detail_path = cur_path + "/movieDetail/:id";
        let booking_path = cur_path + "/booking/:id";
        let cust_booking_path = cur_path + "/custBooking";
        let booking_detail_path = cur_path + "/custBookingDetail/:id";

        return(
            <Router>
                <Switch>
                    <Route path={home_path} exact component={Home}/>
                    <Route path={movie_list_path} exact component={MoviesList}/>
                    <Route path={movie_detail_path} exact component={MovieDetail}/>
                    <Route path={booking_path} exact component={Booking}/>
                    <Route path={cust_booking_path} exact component={CustBooking}/>
                    <Route path={booking_detail_path} exact component={CustBookingDetail}/>
                </Switch>
            </Router>
            
        )
    }
}