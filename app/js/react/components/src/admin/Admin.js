import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router,
        Switch,
        Route} from 'react-router-dom';
import Login from './Login';
import Dashboard from './Dashboard';
import Movies from './Movies';
import Experiences from './Experiences';
import MovieDetails from './MovieDetails';
import MovieHall from './MovieHall';
import HallDetail from './HallDetail';
import Snacks from './Snacks';
import Banners from './Banners';

export default class Admin extends Component{
    render(){
        
        let cur_path='/cinema_project';
        let login_path= cur_path + "/admin";
        let dashboard_path= cur_path + "/admin/dashboard";
        let movies_path= cur_path + "/admin/movies";
        let experiences_path= cur_path + "/admin/experiences";
        let movie_details_path = cur_path + "/admin/movieDetail/:id";
        let movie_hall_path = cur_path + "/admin/movieHall";
        let hall_detail_path = cur_path + "/admin/hallDetail/:id";
        let snacks_path = cur_path + "/admin/snacks";
        let banners_path = cur_path + "/admin/banners";

        return(
            <Router>
                <Switch>
                    <Route path={login_path} exact component={Login}/>
                    <Route path={dashboard_path} exact component={Dashboard}/>
                    <Route path={movies_path} exact component={Movies}/>
                    <Route path={experiences_path} exact component={Experiences}/>
                    <Route path={movie_details_path} exact component={MovieDetails}/>
                    <Route path={movie_hall_path} exact component={MovieHall}/>
                    <Route path={hall_detail_path} exact component={HallDetail}/>
                    <Route path={snacks_path} exact component={Snacks}/>
                    <Route path={banners_path} exact component={Banners}/>
                </Switch>
            </Router>
        )
    }
}