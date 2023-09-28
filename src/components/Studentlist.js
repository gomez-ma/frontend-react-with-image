import React, { Component } from 'react'
import axios from 'axios'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import Pagination from 'react-bootstrap/Pagination'
import Alert from 'react-bootstrap/Alert'
import { Link } from 'react-router-dom'
import { withRouter } from './common/with-router'
import { configData } from './common/config'

class Studentlist extends Component {
    constructor(props) {
        super(props)

        const { search } = this.props.router.location;
        const queryParams = new URLSearchParams(search);
        const page = queryParams.get('page') || 1;

        this.state = {
            students: [],
            isLoading: false,
            profileImage: null,
            removeProfileImage: false,
            keyword:'',
            message:'',
            totalPages: 0,
            currentPage: parseInt(page, 10),
            limit: 2
        }
    }

    componentDidMount() {
		document.title = "Student Management"
        this.fetchData()
        this.nameInput.focus()
        //setTimeout(() => {
        //this.setState({ isLoading: false });
        //}, 1000);
    }

    componentDidUpdate(prevProps, prevState) {
        const { currentPage } = this.state;
        if (prevState.currentPage !== currentPage) {
          this.fetchData();
        }
      }

    fetchData = async () => {
        this.setState({ isLoading: true });
        const { keyword, currentPage, limit } = this.state
        await axios.get(configData.BASE_URL + '/students/', 
            { params: { firstname: keyword, page: currentPage, limit }}, 
            { cache: { maxAge: 15 * 60 * 1000, // Cache response for 15 minutes
        }})
        .then(res => {
            if (res.data && res.data.totalPages !== 0) {
                const { data, totalPages } = res.data
                this.setState({
                    students: data,
                    totalPages,
                    message: null
                })
                this.setState({ isLoading: false })
            } else {
                this.setState({ students: null, message: `No results found!` });
                this.setState({ isLoading: false })
            }
        })
        .catch((error) => {
            console.log(error)
            this.setState({ isLoading: false })
        });

        //const searchParams = new URLSearchParams();
        //searchParams.set('page', currentPage);
        //this.props.router.navigate(`?${searchParams.toString()}`);
    }

    onChangeSearchData = (e) => {
        const searchText = e.target.value;
        this.setState({ currentPage: 1 });
        //this.setState({ keyword: searchText }, () => this.fetchData());
        this.setState({ keyword: searchText });
    }

    handleKeyDown = (e) => {
        if(e.key === 'Enter'){
            this.fetchData();
         }
    }

    deleteStudent = (id) => {
        this.setState({ isLoading: true });
        axios.delete(configData.BASE_URL + '/students/delete-student/' + id)
        .then((res) => {
            this.fetchData()
            this.setState({ isLoading: false });
        })
        .catch((error) => {
            console.log(error)
        })
    }

    removeProfileImage = (id) => {
        this.setState({ isLoading: true });
        const formData = new FormData();
        formData.append('removeProfileImage', true);
        axios.put(configData.BASE_URL + '/students/update-student/' + id, formData)
        .then((res) => {
            this.fetchData()
            this.setState({ isLoading: false });
        })
        .catch((error) => {
            console.log(error)
        })
    }

    handlePageChange = pageNumber => {
        //this.setState({ currentPage: page }, () => this.fetchData());
        //const { currentPage } = this.state;

        const searchParams = new URLSearchParams();
        searchParams.set('page', pageNumber);
        this.props.router.navigate(`?${searchParams.toString()}`);

        this.setState({ currentPage: pageNumber });
    };

    handleFirstPageClick = () => {
        this.setState({ currentPage: 1 }, () => this.fetchData());
    };
    
    handleLastPageClick = () => {
        const { totalPages } = this.state;
        this.setState({ currentPage: totalPages }, () => this.fetchData());
    };

    handlePrevPage = () => {
        const { currentPage } = this.state;
        if (currentPage > 1) {
          this.setState(
            { currentPage: currentPage - 1 },
            () => this.fetchData(),
          );
        }
      };
    
    handleNextPage = () => {
        const { currentPage, totalPages } = this.state;
        if (currentPage < totalPages) {
            this.setState(
            { currentPage: currentPage + 1 },
            () => this.fetchData(),
            );
        }
    };

  render() {
    const { isLoading, keyword, currentPage, totalPages} = this.state;

    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }

    const renderPageNumbers = pageNumbers.map((number) => {
        /* if (number === 1 || number === totalPages || (number >= currentPage - 2 && number <= currentPage + 2)) {
          return (
            <Pagination.Item
              key={number}
              active={number === currentPage}
              onClick={() => this.handlePageChange(number)}>
              {number}
            </Pagination.Item>
          );
        } else if (number === currentPage - 3 || number === currentPage + 3) {
          return <Pagination.Ellipsis key={number} />;
        } */
        return number === 1 || number === totalPages || (number >= currentPage - 2 && number <= currentPage + 2) ?
            <Pagination.Item
              key={number}
              active={number === currentPage}
              onClick={() => this.handlePageChange(number)}>
              {number}
            </Pagination.Item>
        : number === currentPage - 3 || number === currentPage + 3 ?
            <Pagination.Ellipsis key={number} />
        :null
    });

    return (
        <>
        <div className="list row">
            <div className="col-md-3">
                <div className="input-group mb-3">
                    <input ref={(input) => { this.nameInput = input; }}
                    type="search"
                    className="form-control"
                    placeholder="Search by firstname"
                    value={keyword}
                    onChange={this.onChangeSearchData}
                    onKeyDown={this.handleKeyDown}
                    />
                </div>
            </div>
        </div>
        {isLoading ? (
            <div class="d-flex justify-content-center">
                <div class="spinner-border text-primary" role="status">
                    <span class="sr-only"> </span>
                </div>
            </div>
        ) : (
        <>
        <h5>Student Management</h5>
        {this.state.message && (
            <Alert key='danger' variant='danger'>{this.state.message}</Alert>
        )}
        { this.state.students && (
        <>
        <Table striped bordered hover responsive>
            <thead>
                <tr className="text-center">
                    <th>No</th>
                    <th>Code</th>
                    <th>Firstname</th>
                    <th>Lastname</th>
                    <th>Email</th>
                    <th>Image</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {this.state.students.map((res, index) => (
                <tr key={res._id}>
                    <td className="text-center">{index+1}</td>
                    <td>{res.code}</td>
                    <td>{res.firstname}</td>
                    <td>{res.lastname}</td>
                    <td>{res.email}</td>
                    <td className="text-center">
                        { res.profileImage ? (
                            <div><img style={{height:50}} src={configData.BASE_URL + '/' + res.profileImage} alt='profile' />
                                <span className='p-1'>
                                    <Link onClick={() => { window.confirm('Are you sure you want to delete your picture?') && this.removeProfileImage(res._id)}}>X</Link>
                                </span>
                            </div>
                        ) : (
                            <img style={{height:50}} src={configData.BASE_URL + '/no_image.jpg'} alt='profile' />
                        )}
                        </td>
                    <td className="text-center">
                        <Link className='btn btn-warning btn-sm' 
                        to={'/edit-student/' + res._id}>Edit</Link>
                        {' '}
                        <Button className='btn btn-danger btn-sm' onClick={() => { window.confirm('Are you sure you want to delete this item?') && this.deleteStudent(res._id)}}>
                            Delete
                        </Button>
                    </td>
                </tr>
                ))}
            </tbody>
        </Table>
        <Pagination className='justify-content-center'>
            <Pagination.First className={currentPage === 1 ? 'disabled' : ''}
                onClick={this.handleFirstPageClick}>First</Pagination.First>
            <Pagination.Prev className={currentPage === 1 ? 'disabled' : ''}
                onClick={this.handlePrevPage}>Previous</Pagination.Prev>
            {renderPageNumbers}
            <Pagination.Next className={currentPage === totalPages ? 'disabled' : totalPages === 0 ? 'disabled' : ''}
                onClick={this.handleNextPage}>Next</Pagination.Next>
            <Pagination.Last className={currentPage === totalPages ? 'disabled' : totalPages === 0 ? 'disabled' : ''}
                onClick={this.handleLastPageClick}>Last</Pagination.Last>
        </Pagination>
        <p className='text-center'>Page {currentPage} / {totalPages}</p>
        </>
        )} {/* End Not Found */}
        </>
        )} {/* End loading */}
      </>
    )
  }
}
export default withRouter(Studentlist)