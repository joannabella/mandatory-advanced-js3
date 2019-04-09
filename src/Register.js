import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Route } from 'react-router';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import './App.css';
//import Home from './Home';
//import Add from './Add';
//import Edit from './Edit';
//import Details from './Details';


class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            isRegistered: false,
            errorMessage: '',
        }
        this.onEmail = this.onEmail.bind(this);
        this.onPassword = this.onPassword.bind(this);
        this.register = this.register.bind(this);
    }

    onEmail(event) {
        this.setState({ email: event.target.value, errorMessage: '' });
    }

    onPassword(event) {
        this.setState({ password: event.target.value, errorMessage: '' });
    }

    register(event) {
        event.preventDefault();
        axios.post('http://ec2-13-53-32-89.eu-north-1.compute.amazonaws.com:3000/register', { email: this.state.email, password: this.state.password })
            .then((response) => {
                console.log(response);
                this.setState({ isRegistered: true });
            })
            .catch((error) => {
                if (this.state.email === '' || this.state.password === '') {
                    this.setState({ errorMessage: 'Please fill in the missing field/s!', color: 'white' });
                }
                else {
                    this.setState({ errorMessage: 'The email or password that was provided has an invalid format' });
                }
            })
    }

    render() {
        return (
            <>
            <Helmet>
                <title>Register</title>
            </Helmet> 
            <form className='register-form'>
                <h2 className='register-form-title'>Register here</h2>
                <label className='register-label' htmlFor='enteremail'></label>  
                <input className='userfield' name='enteremail' onChange={this.onEmail} value={this.state.email} name='email' placeholder='Example@email.com' spellCheck='false' autoComplete='off' required='required'></input>  

                <label className='register-label' htmlFor='pickpassword'></label>  
                <input className='userfield' name='pickpassword' onChange={this.onPassword} value={this.state.password} type='password' name='password' placeholder='Password' spellCheck='false' autoComplete='off' required='required'></input>  
                <span className='login-link-register'>Hello there, welcome to team <span className='welcome-text'>listmeister!</span></span>
                <span className='register-error'>{this.state.errorMessage}</span>

                <button className='register-button' type='submit' onClick={this.register}>Submit</button>
            </form>
            </>
        );
    }
}

export default Register;