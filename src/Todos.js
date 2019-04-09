import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { Redirect } from 'react-router-dom';
import { token$, removeToken } from './store';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import './App.css';


class Todos extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token: token$.value,
            todos: [],
            content: '',
            email: '',
            errorMessage: '',
        }
        this.removeTodo = this.removeTodo.bind(this);
        this.onChange = this.onChange.bind(this);
        this.addTodo = this.addTodo.bind(this);
    }

    loadTodos() {
        axios.get('http://ec2-13-53-32-89.eu-north-1.compute.amazonaws.com:3000/todos', { headers: {Authorization: 'Bearer ' + this.state.token }})
        .then((response) => {
            console.log(response.data);
            this.setState({ todos: response.data.todos });
        })
        .catch((error) => {
            /**
             * Assume token expired
             */
            console.log("TEST");
            removeToken();
        })
    }

    componentDidMount() {
        this.subscription = token$.subscribe( (token) => {
            this.setState({ token });
            const decoded = jwt.decode(this.state.token);
            this.setState( {email: decoded.email });
        });  
        //console.log(decoded);
        
        this.loadTodos();
    }

    componentWillUnmount() {
        this.subscription.unsubscribe();
    }

    onChange(event) {
        this.setState({ content: event.target.value, errorMessage: '' });
    }

    addTodo(event) {
        event.preventDefault();
        axios.post('http://ec2-13-53-32-89.eu-north-1.compute.amazonaws.com:3000/todos', { content: this.state.content }, { headers: {Authorization: 'Bearer ' + this.state.token }})
            .then((response) => {
                console.log(response);
                this.setState({ content: '' });
                return this.loadTodos();
            })
            .catch((error) => {
                this.setState({ errorMessage: 'Something went wrong... try again!' });
                this.loadTodos();
            })
    }

    removeTodo(event, todoId) {
        event.preventDefault();
        axios.delete('http://ec2-13-53-32-89.eu-north-1.compute.amazonaws.com:3000/todos/' + todoId, { headers: {Authorization: 'Bearer ' + this.state.token }})
            .then(() => {
                console.log('Successfully deleted'); 
                return this.loadTodos();               
            })
            .catch((error) => {
                this.setState({ errorMessage: 'Something went wrong... try again!' });
                this.loadTodos();
            })
    }

    render() {
        if (!this.state.token) {
            return <Redirect to='/login'/>
        }
        let className = 'add-input';
        if (this.state.errorMessage) {
            className += ' error';
        }
        return (
            <>
            <Helmet>
                <title>Todos</title>
            </Helmet>  
            <form>
                <label className='add-todo' htmlFor='addtodo'></label>  
                <input className={className} name='addtodo' onChange={this.onChange} value={this.state.content} name='addtodo' placeholder={this.state.errorMessage ? this.state.errorMessage : 'Enter item'} spellCheck='false' autoComplete='off'></input>  
                <button className='add-button' type='submit' onClick={this.addTodo}><i className="fas fa-plus"></i></button> 
            </form>      
            <main className='todo-content'>
                <h2 className='todo-list-title'>To do list</h2>
                <ul className='todo-list'>
                    {this.state.todos.map(item =>
                        <li className='todo-item' key={item.id}>{item.content} <button className='delete-button' onClick={(event) => this.removeTodo(event, item.id)}><i className='far fa-trash-alt'></i></button></li>
                    )}
                </ul>
            </main>
            </>
        );
    }
}

export default Todos;