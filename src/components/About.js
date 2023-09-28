import React, { Component } from 'react'

export default class About extends Component {
  componentDidMount() {
		document.title = "About"
  }

  render() {
    return (
      <div>About</div>
    )
  }
}
