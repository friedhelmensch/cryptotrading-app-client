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

    this.deleteProfile = this.deleteProfile.bind(this);
    this.profileDeleted = this.profileDeleted.bind(this);
    
    this.saveProfile = this.saveProfile.bind(this);
    this.reloadProfile = this.reloadProfile.bind(this);

    this.state = {
      isLoading: false
    };
  }

  async componentDidMount() {
    await this.reloadProfile();
  }

  async reloadProfile() {
    var profile;
    try {
      profile = await this.getProfile();
      this.setState({
        profile: profile,
        apiKey: profile.apiKey,
        apiSecret: profile.apiSecret
      });
    } catch (e) {
      this.setState({
        profile: null
      });
    }
  }

  getProfile() {
    return invokeApig({ path: `/profile` }, this.props.userToken);
  }

  async saveProfile(profile) {
    return invokeApig({
      path: '/profile',
      method: 'PUT',
      body: profile,
    }, this.props.userToken);
  }

  //implement delete api and uncomment
  async deleteProfile() {
    /*
    return invokeApig({
      path: `/profile/}`,
      method: 'DELETE',
    }, this.props.userToken);*/
    return null;
  }

  //replace this with reload when delete is implemented
  profileDeleted() {
    this.setState(
      {
        profile: null,
        apiKey: '',
        apiSecret: ''
      });
  }

  render() {
    if (this.state.profile) {
      return (
                                                                                                      //replace this with reload when delete is implemented
        <ReadonlyProfile apiKey={this.state.apiKey} apiSecret={this.state.apiSecret} deleteProfile={this.deleteProfile} profileChanged={this.profileDeleted} />
      )
    }
    else {
      return (
        <WritableProfile saveProfile={this.saveProfile} profileChanged={this.reloadProfile}/>
      )
    }
  }
}

export default withRouter(Profile);

class WritableProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      apiKey: '',
      apiSecret: ''
    };
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    this.setState({ isLoading: true });

    try {
      
      await this.props.saveProfile({
        apiKey: this.state.apiKey,
        apiSecret: this.state.apiSecret
      });

      await this.props.profileChanged();

    }
    catch (e) {
      alert(e);
      this.setState({ isLoading: false });
    }
  }

  validateForm() {
    return this.state.apiKey.length > 0 && this.state.apiSecret.length > 0;
  }

  handleChange = (event) => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  render() {
    return (
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
    );
  }
}

class ReadonlyProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      apiKey: this.props.apiKey,
      apiSecret: this.props.apiSecret,
    };
  }

  handleDelete = async (event) => {
    event.preventDefault();

    const confirmed = window.confirm('Are you sure you want to delete these api keys?');

    if (!confirmed) {
      return;
    }

    this.setState({ isDeleting: true });

    try {
      await this.props.deleteProfile();
      this.props.profileChanged();
    }
    catch (e) {
      alert(e);
      this.setState({ isDeleting: false });
    }
  }

  render() {
    return (
      <div className="Profile">
        <form>
          <FormGroup controlId="apiKey">
            <label>API key</label>
            <FormControl
              value={this.state.apiKey}
              disabled />
          </FormGroup>
          <FormGroup controlId="apiSecret">
            <label>API secret</label>
            <FormControl
              value={this.state.apiSecret}
              disabled />
          </FormGroup>
          <LoaderButton
            block
            bsStyle="primary"
            bsSize="large"
            isLoading={this.state.isLoading}
            onClick={this.handleDelete}
            text="Delete"
            loadingText="Deleting" />
        </form>
      </div>
    );
  }
}