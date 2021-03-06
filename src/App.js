import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Route } from 'react-router';
import { Link } from 'react-router-dom';
import { token$, removeToken } from './store';
import jwt from 'jsonwebtoken';
import './App.css';
import Register from './Register';
import Login from './Login';
import Todos from './Todos';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: token$.value,
      email: '',
    }
  }
  componentDidMount() {
    this.subscription = token$.subscribe( (token) => {
      this.setState({ token });
      const decoded = jwt.decode(token);
      if (decoded) {
        this.setState({ email: decoded.email });
      }
    });  
  }

  componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  onLogout(event) {
    removeToken();
  }

  render() {
    const token = this.state.token;
    return (
      <Router>
        <div className="App">
        <header className='nav-header'>
          <h1 className='app-title'>listmeister.</h1>
          {token ? <span className='loggedin-user'>Welcome, {this.state.email}</span> : <Link to='/register' className='register-link'>register</Link>}
          {token ? <button className='logout-link' onClick={this.onLogout}>logout</button> : <Link to='/login' className='login-link'>login</Link>}
        </header>  
          <Route path='/register' component={Register} />
          <Route path='/login' component={Login} />
          <Route path='/todos' component={Todos} />
        </div>
      </Router>
    );
  }
}

export default App;
