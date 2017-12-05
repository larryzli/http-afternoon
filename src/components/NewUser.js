import React, { Component } from "react";

//import axios
import axios from "axios";

class NewUser extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      img: "",
      desc: ""
    };
    this.deleteUser = this.deleteUser.bind(this);
  }

  // insert addUser
  addUser() {
    const userData = {
      name: this.state.name,
      img: this.state.img,
      desc: this.state.desc
    };
    axios
      .post(`/api/users`, userData)
      .then(response => {
        let id = response.data.id;
        this.props.history.push(`/user/${id}`);
      })
      .catch(console.log);
  }

  // insert updateUser
  updateUser() {
    const userData = {
      name: this.state.name,
      img: this.state.img,
      desc: this.state.desc
    };
    const id = this.props.match.params.id;
    console.log("ID: " + id);
    axios
      .put(`/api/users/${id}`, userData)
      .then(response => {
        let id = response.data.id;
        console.log("ID: " + id);
        this.props.history.push(`/user/${id}`);
      })
      .catch(console.log);
  }

  // insert deleteUser
  deleteUser() {
    let id = this.props.match.params.id;
    console.log("ID: " + id);
    axios
      .delete(`/api/user/${id}`)
      .then(() => {
        this.props.history.push(`/search/`);
      })
      .catch(console.log);
  }

  render() {
    return (
      <div className="content">
        {this.state.warn ? (
          <h4 style={{ color: "red" }}>You must include at least a name.</h4>
        ) : null}
        <form className="new-user" onSubmit={e => this.submit(e)}>
          <div className="pic-input input-group">
            {this.state.img ? (
              <img src={this.state.img} alt="profile pic" />
            ) : (
              <div className="pic-placeholder">No Image Yet</div>
            )}
            <span>
              <label>Image URL</label>
              <input
                type="text"
                name="img"
                value={this.state.img}
                onChange={e => this.handleChange(e)}
              />
            </span>
          </div>
          <div className="input-group in-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={this.state.name}
              onChange={e => this.handleChange(e)}
            />
          </div>
          <div className="input-group in-group">
            <label>Description</label>
            <textarea
              name="desc"
              value={this.state.desc}
              onChange={e => this.handleChange(e)}
            />
          </div>
          {this.state.id >= 0 ? (
            <span>
              <button onClick={this.deleteUser} className="delete-button">
                Delete User
              </button>
              <button type="submit">Update</button>
            </span>
          ) : (
            <button type="submit">Save</button>
          )}
        </form>
      </div>
    );
  }

  componentDidMount() {
    let id = this.props.match.params.id;
    if (id >= 0) {
      axios.get(`/api/user/${id}`).then(response => {
        this.setState({
          id: id,
          name: response.data.name,
          img: response.data.img,
          desc: response.data.desc
        });
      });
    }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.match.params.hasOwnProperty("id")) {
      let id = newProps.match.params.id;
      axios.get(`/api/user/${id}`).then(response => {
        this.setState({
          id: id,
          name: response.data.name,
          img: response.data.img,
          desc: response.data.desc
        });
      });
    } else {
      this.setState({
        id: null,
        name: "",
        img: "",
        desc: ""
      });
    }
  }

  submit(e) {
    e.preventDefault();
    if (this.state.name) {
      if (this.props.match.params.hasOwnProperty("id")) {
        this.updateUser();
      } else {
        this.addUser();
      }
    } else {
      this.setState({ warn: true });
      setTimeout(() => {
        this.setState({ warn: false });
      }, 2000);
    }
  }
  handleChange(e) {
    let { value, name } = e.target;
    this.setState(_ => {
      let newState = {};
      newState[name] = value;
      return newState;
    });
  }
}

export default NewUser;
