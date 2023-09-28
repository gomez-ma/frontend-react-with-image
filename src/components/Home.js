import React, { Component } from 'react'

export default class Home extends Component {
  componentDidMount() {
		document.title = "Home"
  }

  render() {
    return (
      <div>Home</div>
    )
  }
}
