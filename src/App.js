import { Component } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css';
import { Routes, Route } from 'react-router-dom'

import Menubar from './components/Menubar'
import Home from './components/Home'
import About from './components/About'
import Studentlist from './components/Studentlist'
import CreateStudent from './components/CreateStudent'
import EditStudent from './components/EditStudent'

export default class App extends Component {
  render(){
    return (
      <>
      <Menubar />
      <div className="container">
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/student-list' element={<Studentlist />} />
          <Route path='/create-student' element={<CreateStudent />} />
          <Route path='/edit-student/:id' element={<EditStudent />} />
        </Routes>
      </div>
      </>
    );
  }
}
