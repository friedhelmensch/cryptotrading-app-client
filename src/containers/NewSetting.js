import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {
  FormGroup,
  FormControl,
} from 'react-bootstrap';
import LoaderButton from '../components/LoaderButton';
import './NewSetting.css';
import { invokeApig } from '../libs/awsLib';

class NewSetting extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: null,
      apiKey: '',
      currency: '',
      amount : 0
    };
  }

  validateForm() {
    return this.state.apiKey.length > 0 && this.state.currency.length > 0 && this.state.amount > 0;
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
        apiKey : this.state.apiKey,
        currency : this.state.currency,
        amount : this.state.amount
      });
      this.props.history.push('/');
    }
    catch(e) {
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
          <FormGroup controlId="apiKey">
            <label>Api key</label>
            <FormControl
              onChange={this.handleChange}
              value={this.state.apiKey}
              componentClass="input" />
          </FormGroup>
          <label>Cryptocurrency to buy</label>
          <FormGroup controlId="currency">
            <FormControl
              onChange={this.handleChange}
              value={this.state.currency}
              componentClass="input" />
          </FormGroup>
          <label>Amount</label>
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
            disabled={ ! this.validateForm() }
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