import React, { Component } from 'react';
import LoaderButton from '../components/LoaderButton';
import './ProfileEdit.css';
import Dropdown from 'react-dropdown';
import { getDisplayname, getCurrencyOptions } from '../libs/currencyHelper';

class TradeSettingsCheck extends Component {
  constructor(props) {
    super(props);

    this.state = {
      spread: "3",
      buyFactor: "1.2"
    };
  }

  handleCheck = async (event) => {
    event.preventDefault();

    this.setState({ isChecking: true });

    try {
      alert("Soon you will see a result here for: \n" +
      "spread:             " + this.state.spread + "\n" +
      "buy factor:         " + this.state.buyFactor + "\n" +
      "cryptocurrency:     " + getDisplayname(this.state.currency));
      this.setState({ isChecking: false });
    }
    catch (e) {
      alert(e);
      this.setState({ isChecking: false });
    }
  }

  buyFactorChanged = (options) => {
    this.setState({
      buyFactor: options.value
    });
  }

  spreadChanged = (options) => {
    this.setState({
      spread: options.value
    });
  }

  currencyChanged = (options) => {
    this.setState({
      currency: options.value
    });
  }

  render() {
    return (
      <div className="Profile">
        <form>
          <label> Spread: </label>
          <Dropdown options={[{ value: "3" }, { value: "4" }, { value: "5" }, { value: "6" }, { value: "7" }]} onChange={this.spreadChanged} value={this.state.spread} placeholder="Select an option" />
          <label> Buy Factor: </label>
          <Dropdown options={[{ value: "1.2" }, { value: "1.3" }, { value: "1.4" }, { value: "1.5" }, { value: "1.6" }, { value: "1.7" }]} onChange={this.buyFactorChanged} value={this.state.buyFactor} placeholder="Select an option" />
          <label>Cryptocurrency to buy</label>
          <Dropdown options={getCurrencyOptions()} onChange={this.currencyChanged} value={getDisplayname(this.state.currency)} placeholder="Select an option" />
          <label></label>
          <LoaderButton
            block
            bsStyle="primary"
            bsSize="large"
            isLoading={this.state.isChecking}
            onClick={this.handleCheck}
            text="Check"
            loadingText="Checking..." />
        </form>
      </div>
    );
  }
}

export default TradeSettingsCheck;