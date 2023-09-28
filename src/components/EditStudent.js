import React, { Component } from 'react'
import axios from 'axios'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Alert from 'react-bootstrap/Alert'
import { withRouter } from './common/with-router'
import { configData } from './common/config'

class EditStudent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            code: '',
            firstname: '',
            lastname: '',
            email: '',
            profileImage: null,
            previewImage: null,
            successMessage: '',
            uploadErrorMessage: '',
            isLoading: false
        }
    }

    componentDidMount() {
		document.title = "Edit Student"
        this.loadData()
    }

    loadData = () => {
        this.setState({ isLoading: true })
        axios.get(configData.BASE_URL + '/students/edit-student/' + this.props.router.params.id)
        .then(res => {
            this.setState({
                code: res.data.code,
                firstname: res.data.firstname,
                lastname: res.data.lastname,
                email: res.data.email,
                profileImage: res.data.profileImage
            })
            this.setState({ isLoading: false })
        })
        .catch((error) => {
            console.log(error)
        })
    }

    onChangeStudentCode = (e) => {
        this.setState({ code: e.target.value })
    }

    onChangeStudentFirstname = (e) => {
        this.setState({ firstname: e.target.value })
    }

    onChangeStudentLastname = (e) => {
        this.setState({ lastname: e.target.value })
    }

    onChangeStudentEmail = (e) => {
        this.setState({ email: e.target.value })
    }

    onChangeStudentProfileImage = (e) => {
        this.setState({ profileImage: e.target.files[0] });

        const reader = new FileReader();
        if(e.target.files[0]){
            reader.readAsDataURL(e.target.files[0])
        }
        reader.onloadend = () => {
          this.setState({ previewImage: reader.result });
        };
        this.setState({ uploadErrorMessage: '', successMessage: ''})
    }

    onSubmit = (e) => {
        e.preventDefault()

        const studentObject = {
            code: this.state.code,
            firstname: this.state.firstname,
            lastname: this.state.lastname,
            email: this.state.email,
            profileImage: this.state.profileImage
        }
        this.setState({ isLoading: true })
        axios.put(configData.BASE_URL + '/students/update-student/' + this.props.router.params.id, studentObject, {headers: { 'Content-Type': 'multipart/form-data'}})
        .then(res => {
            this.setState({ successMessage: res.data.message })
            this.setState({ isLoading: false })
        })
        .catch(error => {
            if (error.response) {
                this.setState({ uploadErrorMessage: error.response.data.error })
                this.setState({ isLoading: false })
              } else {
                console.error(error);
            }
        })

        //this.setState({code:'', firstname:'', lastname:'', email:'', profileImage:'', previewImage:''})

        //this.props.router.navigate('/student-list')
		//window.location.reload();
    }

  render() {
    const { isLoading } = this.state;
    return (
        <div>
            {isLoading ? (
            <div class="d-flex justify-content-center">
                <div class="spinner-border text-primary" role="status">
                    <span class="sr-only"> </span>
                </div>
            </div>
            ):(
            <>
            {this.state.successMessage && (
                <Alert key='success' variant='success'>
                    {this.state.successMessage}
                </Alert>
            )}
            {this.state.uploadErrorMessage && (
            <Alert key='danger' variant='danger'>{this.state.uploadErrorMessage}</Alert>
            )}
            <h5>Edit Student</h5>
                <Form onSubmit={this.onSubmit}>
                    <Form.Group>
                        <Form.Label>Code</Form.Label>
                        <Form.Control type='text' value={this.state.code} onChange={this.onChangeStudentCode} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Firstname</Form.Label>
                        <Form.Control type='text' value={this.state.firstname} onChange={this.onChangeStudentFirstname} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Lastname</Form.Label>
                        <Form.Control type='text' value={this.state.lastname} onChange={this.onChangeStudentLastname} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Email</Form.Label>
                        <Form.Control type='text' value={this.state.email} onChange={this.onChangeStudentEmail} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                    <Form.Label>Your image</Form.Label>
                        <Form.Control type="file" onChange={this.onChangeStudentProfileImage} />
                        { this.state.previewImage ? (
                            this.state.previewImage && <img className='mt-3' style={{height:150}} src={ this.state.previewImage } alt="Preview" />
                        ) : (
                            this.state.profileImage && <img className='mt-3' style={{height:150}} src={ configData.BASE_URL + '/' + this.state.profileImage} alt="Preview" />
                    )
                    }
                    </Form.Group>
                    <Form.Group className="text-center mt-3 mb-3">
                        <Button variant='primary' type='submit'>
                            Update
                        </Button>
                    </Form.Group>
                </Form>
                </>
                )}
        </div>
    )
  }
}

export default withRouter(EditStudent)