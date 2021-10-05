import React, { Component } from 'react'; 
import { Link } from "react-router-dom";

export default class Nav extends Component {
  render() {

    let cur_path='/cinema_project';
    let list_path= cur_path + "/customer/index";
    let form_path= cur_path + "/customer/form";
    let edit_path= cur_path + "/customer/edit/5";

    return (
      <nav class="navbar navbar-expand-lg navbar-light bg-light rounded">
        <div class="collapse navbar-collapse" id="navbarsExample09">
          <ul class="navbar-nav mr-auto">
            <li class="nav-item">
              <Link class="nav-link" to={list_path}>List</Link>
            </li>
            <li class="nav-item">
              <Link class="nav-link" to={form_path}>Create</Link>
            </li>
            <li class="nav-item">
              <Link class="nav-link" to={edit_path}>Edit</Link>
            </li>
          </ul>
        </div>
      </nav>
    )
  }
}