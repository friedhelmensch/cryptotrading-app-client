import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import './Profile.css';
import { invokeApig } from '../libs/awsLib';
import ProfileWritable from './ProfileWritable';
import ProfileReadonly from './ProfileReadonly';

class Profile extends Component {
  constructor(props) {
    super(props);

    this.deleteProfile = this.deleteProfile.bind(this);
    this.saveProfile = this.saveProfile.bind(this);
    this.createProfile = this.createProfile.bind(this);
    this.reloadProfile = this.reloadProfile.bind(this);

    this.state = {
      active: false
    };
  }

  async componentDidMount() {
    await this.reloadProfile();
  }

  async reloadProfile() {
    var profile = await this.getProfile();
    if (profile.noProfile) {
      this.setState({
        apiKey: '',
        apiSecret: '',
        active: false
      });
    }
    else {
      this.setState({
        apiKey: "***encrypted***",
        apiSecret: "***encrypted***",
        active: profile.active
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

  toggleCheckboxChange = (checkboxChangedEvent) => {
    const profile = {
      active: checkboxChangedEvent.target.checked,
      spread: 111,
      buyFactor: 222,
      targetProfit : 333,
      euroLimit : 444,
    }
    this.saveProfile(profile);
  }

  render() {
    if (this.state.apiKey && this.state.apiSecret) {
      return (
        <div>
          <label>
            Active:
           <div className="checkbox">
              <label>
                <input type="checkbox" defaultChecked={this.state.active} onChange={this.toggleCheckboxChange} />
              </label>
           </div>
          </label>
          <ProfileReadonly apiKey={this.state.apiKey} apiSecret={this.state.apiSecret} deleteProfile={this.deleteProfile} profileChanged={this.reloadProfile} />
        </div>
      )
    }
    else {
      return (
        <ProfileWritable createProfile={this.createProfile} profileChanged={this.reloadProfile} />
      )
    }
  }
}

export default withRouter(Profile);