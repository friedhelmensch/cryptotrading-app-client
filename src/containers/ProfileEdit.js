import React, { Component } from 'react';
import {
  FormGroup,
  FormControl,
} from 'react-bootstrap';
import LoaderButton from '../components/LoaderButton';
import './ProfileEdit.css';
import Dropdown from 'react-dropdown';

class ProfileEdit extends Component {
  constructor(props) {
    super(props);

    this.state = {
      apiKey: this.props.apiKey,
      apiSecret: this.props.apiSecret,
      active: this.props.active,
      //convert number to string because dropdown can only handle strings properly
      signal: "" + this.props.signal,
      buyFactor: "" + this.props.buyFactor,
      targetProfit : "" + this.props.targetProfit,
      euroLimit : "" + this.props.euroLimit
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
        //convert strings to numbers again
        spread: this.state.signal * 1,
        buyFactor: this.state.buyFactor * 1,
        targetProfit: this.state.targetProfit *  1,
        euroLimit: this.state.euroLimit * 1,
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

  buyFactorChanged = (options) => {
    this.setState({
      buyFactor: options.value
    });
  }

  signalChanged = (options) => {
    this.setState({
      signal: options.value
    });
  }

  targetProfitChanged = (options) => {
    this.setState({
      targetProfit: options.value
    });
  }

  euroLimitChanged = (options) => {
    this.setState({
      euroLimit: options.value
    });
  }

  render() {
    return (
      <div className="Profile">
        <form>
          <label> Active: </label>
          <div><input type="checkbox" defaultChecked={this.state.active} onChange={this.toggleCheckboxChange} /> </div>
          <label> Signal: </label>
          <Dropdown options={[{ value: "3" }, { value: "4" }, { value: "5" }, { value: "6" }, { value: "7" }]} onChange={this.signalChanged} value={this.state.signal} placeholder="Select an option" />
          <label> Buy Factor: </label>
          <Dropdown options={[{ value: "1.2" }, { value: "1.3" }, { value: "1.4" }, { value: "1.5" }, { value: "1.6" }, { value: "1.7" }]} onChange={this.buyFactorChanged} value={this.state.buyFactor} placeholder="Select an option" />
          <label> Profit (%): </label>
          <Dropdown options={[{ value: "2" }, { value: "3" }, { value: "4" }, { value: "5" }, { value: "6" }, { value: "7" }]} onChange={this.targetProfitChanged} value={this.state.targetProfit} placeholder="Select an option" />
          <label> Limit (€) : </label>
          <Dropdown options={[{ value: "0" }, { value: "100" }, { value: "200" }, { value: "500" }, { value: "1000" }, { value: "1500" }, { value: "2000" }]} onChange={this.euroLimitChanged} value={this.state.euroLimit} placeholder="Select an option" />
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