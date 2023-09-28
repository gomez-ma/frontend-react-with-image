import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap'

export default class Menubar extends Component {
  render() {
    return (
      <Navbar className='bg-light shadow-sm mb-3' sticky="top" expand="lg">
        <Container fluid>
            <Navbar.Brand href='/'>
                <img
                    alt=''
                    src='./logo192.png'
                    className='App-logo img-fluid'
                />{' '} My Portfolio
            </Navbar.Brand>
            <Navbar.Toggle aria-controls='basic-navbar-nav' />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    <ul className='navbar-nav mr-auto'>
                        <li className='nav-item'>
                            <NavLink to="/" className='nav-link'>
                                Home
                            </NavLink>
                        </li>
                        <li className='nav-item'>
                            <NavLink to="/about" className='nav-link'>
                                About
                            </NavLink>
                        </li>
                    </ul>
                    <NavDropdown title="Manage Students" id="basic-nav-dropdown">
                        <NavDropdown.Item>
                            <NavLink to="/create-student" className='nav-link'>
                                Create New Student
                            </NavLink>
                        </NavDropdown.Item>
                        <NavDropdown.Item>
                            <NavLink to="/student-list" className='nav-link'>
                                Student List
                            </NavLink>
                        </NavDropdown.Item>
                    </NavDropdown>
                </Nav>
                <Nav>
                    <Navbar.Text>
                        Signed in as : GoMez
                    </Navbar.Text>
                </Nav>
            </Navbar.Collapse>
        </Container>
      </Navbar>
    )
  }
}
