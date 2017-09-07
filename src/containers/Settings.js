import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { invokeApig } from '../libs/awsLib';
import { getDisplayname, getCurrencyOptions } from '../libs/currencyHelper';
import {
  FormGroup,
  FormControl,
} from 'react-bootstrap';
import LoaderButton from '../components/LoaderButton';
import './Settings.css';
import Dropdown from 'react-dropdown'

class Settings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: null,
      isDeleting: null,
      setting: null,
      currency: '',
      amount: 0
    };
  }

  async componentDidMount() {
    try {
      const results = await this.getSetting();

      this.setState({
        setting: results,
        currency: results.currency,
        amount: results.amount,
      });
    }
    catch (e) {
      alert(e);
    }
  }

  getSetting() {
    return invokeApig({ path: `/settings/${this.props.match.params.id}` }, this.props.userToken);
  }

  validateForm() {
    return this.state.currency.length > 0 && this.state.amount > 0;
  }

  handleChange = (event) => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  currencyChanged = (options) => {
    this.setState({
      currency: options.value
    });
  }

  saveSetting(setting) {
    return invokeApig({
      path: `/settings/${this.props.match.params.id}`,
      method: 'PUT',
      body: setting,
    }, this.props.userToken);
  }

  handleSubmit = async (event) => {
    event.preventDefault();

    this.setState({ isLoading: true });

    try {

      await this.saveSetting({
        currency: this.state.currency,
        amount: this.state.amount
      });

      this.props.history.push('/');
    }
    catch (e) {
      alert(e);
      this.setState({ isLoading: false });
    }
  }

  deleteSetting() {
    return invokeApig({
      path: `/settings/${this.props.match.params.id}`,
      method: 'DELETE',
    }, this.props.userToken);
  }

  handleDelete = async (event) => {
    event.preventDefault();

    const confirmed = window.confirm('Are you sure you want to delete this setting?');

    if (!confirmed) {
      return;
    }

    this.setState({ isDeleting: true });

    try {
      await this.deleteSetting();
      this.props.history.push('/');
    }
    catch (e) {
      alert(e);
      this.setState({ isDeleting: false });
    }
  }

  render() {
    return (
      <div className="Settings">
        {this.state.setting &&
          (<form onSubmit={this.handleSubmit}>
            <label>Cryptocurrency to buy</label>

            <Dropdown options={getCurrencyOptions()} onChange={this.currencyChanged} value={getDisplayname(this.state.currency)} placeholder="Select an option" />

            <label>Euro</label>
            <FormGroup controlId="amount">
              <FormControl
                onChange={this.handleChange}
                value={this.state.amount}
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
              loadingText="Saving…" />
            <LoaderButton
              block
              bsStyle="danger"
              bsSize="large"
              isLoading={this.state.isDeleting}
              onClick={this.handleDelete}
              text="Delete"
              loadingText="Deleting…" />
          </form>)}
      </div>
    );
  }
}

export default withRouter(Settings);