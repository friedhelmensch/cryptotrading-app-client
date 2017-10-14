import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import './Profile.css';
import { invokeApig } from '../libs/awsLib';
import ProfileCreate from './ProfileCreate';
import ProfileEdit from './ProfileEdit';

class Profile extends Component {
  constructor(props) {
    super(props);

    this.deleteProfile = this.deleteProfile.bind(this);
    this.saveProfile = this.saveProfile.bind(this);
    this.createProfile = this.createProfile.bind(this);
    this.reloadProfile = this.reloadProfile.bind(this);

    this.state = {
      active: false,
      noProfile : true
    };
  }

  async componentDidMount() {
    await this.reloadProfile();
  }

  async reloadProfile() {
    var profile = await this.getProfile();
    if (profile.noProfile) {
      this.setState({
        noProfile: true
      });
    }
    else {
      this.setState({
        apiKey: "***encrypted***",
        apiSecret: "***encrypted***",
        active: profile.active,
        noProfile : false
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

  async createProfile(profile) {
    return invokeApig({
      path: '/profile',
      method: 'POST',
      body: profile,
    }, this.props.userToken);
  }

  async deleteProfile() {
    return invokeApig({
      path: `/profile`,
      method: 'DELETE',
    }, this.props.userToken);
  }

  render() {
    if (this.state.noProfile)
      return <ProfileCreate createProfile={this.createProfile} profileChanged={this.reloadProfile} />
    else
      return <ProfileEdit
        active={this.state.active}
        apiKey={this.state.apiKey}
        apiSecret={this.state.apiSecret}
        deleteProfile={this.deleteProfile}
        profileChanged={this.reloadProfile}
        saveProfile={this.saveProfile} />
  }
}

export default withRouter(Profile);