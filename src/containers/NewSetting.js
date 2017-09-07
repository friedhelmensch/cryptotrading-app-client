import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {
  FormGroup,
  FormControl,
} from 'react-bootstrap';
import LoaderButton from '../components/LoaderButton';
import './NewSetting.css';
import { invokeApig } from '../libs/awsLib';
import Dropdown from 'react-dropdown'
import { getDisplayname, getCurrencyOptions } from '../libs/currencyHelper';

class NewSetting extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: null,
      currency: '',
      amount: 0
    };
  }

  validateForm() {
    return this.state.currency.length > 0 && this.state.amount > 0;
  }

  currencyChanged = (options) => {
    this.setState({
      currency: options.value
    });
  }
  handleChange = (event) => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    this.setState({ isLoading: true });

    try {
      await this.createSetting({
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

  createSetting(setting) {
    return invokeApig({
      path: '/settings',
      method: 'POST',
      body: setting,
    }, this.props.userToken);
  }

  render() {
    return (
      <div className="NewSetting">
        <form onSubmit={this.handleSubmit}>
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
            text="Create"
            loadingText="Creating…" />
        </form>
      </div>
    );
  }
}

export default withRouter(NewSetting);