import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom'
import { connect } from 'react-redux';
import { RootState } from './app/store';

import TaskList from './features/task/components/TaskList';
import Login from './features/user/components/LoginForm'
import TaskForm from './features/task/components/TaskForm';
import { isLogin, logout } from './features/user/api'
import './App.css'
import './features/task/components/TaskList.css'


const Navbar = ({ ...props }) => {
  const navigator = useNavigate()
  return (<div className="navbar">
    <Link to="/">Задачи</Link>
    {!props.isLogIn()
      ? <Link to="/login" className="login-btn">Вход</Link>
      : <button onClick={() => {
        logout()
        navigator('/login')
      }} className="logout-btn">Выход</button>}
  </div>)
}
class App extends React.Component {
  render() {
    return <Router>
      <div className="app" >
        <div className="header">
          <div className="logo">
            Tmanager
          </div>
          <Navbar {...this.props} />
        </div>
      </div>
      <div className="content">
        <Routes>
          <Route path="/" element={<TaskList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/create" element={<TaskForm />}></Route>
          <Route path="/edit" element={<TaskForm />}></Route>
        </Routes>
      </div>
    </Router>
  }
}
export default connect(
  (state: RootState) => ({
    isLogIn: () => isLogin()
  })
)(App)
