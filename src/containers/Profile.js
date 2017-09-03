import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {
  FormGroup,
  FormControl,
} from 'react-bootstrap';
import LoaderButton from '../components/LoaderButton';
import './Profile.css';
import { invokeApig } from '../libs/awsLib';

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: null,
      apiKey: '',
      apiSecret: ''
    };
  }

  validateForm() {
    return this.state.apiKey.length > 0 && this.state.apiSecret.length > 0;
  }

  handleChange = (event) => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  async componentDidMount() {
    try {
      const results = await this.getProfile();
      
      if(!results.apiSecret) results.apiSecret = 'empty';
      
      this.setState({
        setting: results,
        apiKey: results.apiKey,
        apiSecret: results.apiSecret
      });
    }
    catch(e) {
      alert(e);
    }
  }

  getProfile() {
    return invokeApig({ path: `/profile` }, this.props.userToken);
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    this.setState({ isLoading: true });

    try {
      await this.saveProfile({
        apiKey: this.state.apiKey,
        apiSecret: this.state.apiSecret
      });
      this.props.history.push('/');
    }
    catch (e) {
      alert(e);
      this.setState({ isLoading: false });
    }
  }

  saveProfile(profile) {
    return invokeApig({
      path: '/profile',
      method: 'PUT',
      body: profile,
    }, this.props.userToken);
  }

  render() {
    return (
      <div className="Profile">
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="apiKey">
            <label>API key</label>
            <FormControl
              onChange={this.handleChange}
              value={this.state.apiKey}
              componentClass="input" />
          </FormGroup>
          <FormGroup controlId="apiSecret">
            <label>API secret</label>
            <FormControl
              onChange={this.handleChange}
              value={this.state.apiSecret}
              componentClass="input" />
          </FormGroup>
          <LoaderButton
            block
            bsStyle="primary"
            bsSize="large"
            disabled={!this.validateForm()}
            type="submit"
            isLoading={this.state.isLoading}
            text="Save"
            loadingText="Saving" />
        </form>
      </div>
    );
  }
}

export default withRouter(Profile);