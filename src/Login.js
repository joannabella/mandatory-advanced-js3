import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Route } from 'react-router';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Redirect } from 'react-router-dom';
import { token$, updateToken, removeToken } from './store';
import axios from 'axios';
import './App.css';


class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            isLoggedIn: false,
            errorMessage: '',
        }
        this.onEmail = this.onEmail.bind(this);
        this.onPassword = this.onPassword.bind(this);
        this.login = this.login.bind(this);
    }


    onEmail(event) {
        this.setState({ email: event.target.value, errorMessage: '' });
    }

    onPassword(event) {
        this.setState({ password: event.target.value, errorMessage: '' });
    }


    login(event) {
        event.preventDefault();
        axios.post('http://ec2-13-53-32-89.eu-north-1.compute.amazonaws.com:3000' + '/auth', { email: this.state.email, password: this.state.password })
            .then((response) => {
                console.log(response);
                let token = response.data.token;
                updateToken(token);
                this.setState({ isLoggedIn: true });
                localStorage.setItem('token', token);
            })
            .catch((error) => {
                this.setState({ errorMessage: 'Email or password is invalid!' });
            })
    }

    render() {
        if (this.state.isLoggedIn) {
            return <Redirect to='/todos'/>
        }
        return (
            <>
            <Helmet>
                <title>Login</title>
            </Helmet> 
            <form className='login-form'>
                <h2 className='login-form-title'>Login here</h2>
                <label className='login-label' htmlFor='enteremail'></label>  
                <input className='userfield' name='enteremail' onChange={this.onEmail} value={this.state.email} name='email' placeholder='Example@email.com' spellCheck='false' autoComplete='off' required='required'></input>  

                <label className='login-label' htmlFor='enterpassword'></label>  
                <input className='userfield' name='enterpassword' onChange={this.onPassword} value={this.state.password} type='password' name='password' placeholder='Password' spellCheck='false' autoComplete='off' required='required'></input>  
                <span className='login-link-register'>Are you new to listmeister? <Link to='/register'>Register here</Link></span>
                <span className='login-error'>{this.state.errorMessage}</span>
                <button className='login-button' type='submit' onClick={this.login}>Submit</button>
            </form>
            </>
        );
    }
}

export default Login;