import React, { Component } from 'react';
import {
  FormGroup,
  FormControl,
} from 'react-bootstrap';
import LoaderButton from '../components/LoaderButton';

class ProfileEdit extends Component {
  constructor(props) {
    super(props);

    this.state = {
      apiKey: this.props.apiKey,
      apiSecret: this.props.apiSecret,
      active: this.props.active
    };
  }

  handleDelete = async (event) => {
    event.preventDefault();

    const confirmed = window.confirm('Are you sure you want to delete this profile?');

    if (!confirmed) {
      return;
    }

    this.setState({ isDeleting: true });

    try {
      await this.props.deleteProfile();
      await this.props.profileChanged();
    }
    catch (e) {
      alert(e);
      this.setState({ isDeleting: false });
    }
  }

  handleSave = async (event) => {
    event.preventDefault();

    this.setState({ isSaving: true });

    try {
      var profile = {
        active: this.state.active,
        spread: 999,
        buyFactor: 888,
        targetProfit: 777,
        euroLimit: 555,
      };
      await this.props.saveProfile(profile);
      this.setState({ isSaving: false });
    }
    catch (e) {
      alert(e);
      this.setState({ isSaving: false });
    }
  }

  toggleCheckboxChange = (checkboxChangedEvent) => {
    this.setState({
      active: checkboxChangedEvent.target.checked
    })
  }

  render() {
    return (
      <div className="Profile">
        <form>
          <label>
            Active:
       <div className="checkbox">
              <label>
                <input type="checkbox" defaultChecked={this.state.active} onChange={this.toggleCheckboxChange} />
              </label>
            </div>
          </label>
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
            isLoading={this.state.isSaving}
            onClick={this.handleSave}
            text="Save"
            loadingText="Saving..." />
          <LoaderButton
            block
            bsStyle="danger"
            bsSize="large"
            isLoading={this.state.isDeleting}
            onClick={this.handleDelete}
            text="Delete"
            loadingText="Deleting" />
        </form>
      </div>
    );
  }
}

export default ProfileEdit;