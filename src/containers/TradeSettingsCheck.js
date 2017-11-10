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
      if (!this.state.currency) {
        alert("Please select a currency");
        this.setState({ isChecking: false });
        return;
      }

      const localUrl = "http://localhost:5000/shouldBuy?"
      const baseUrl = "https://crypto-tradingapp-simulator.herokuapp.com/shouldBuy?"
      const parameters = "pair=" + this.state.currency + "&signal=" + this.state.spread + "&factor=" + this.state.buyFactor;
      const url = baseUrl + parameters;

      const response = await fetch(url);
      var data = await response.json();

      this.setState({ isChecking: false });

      if(data.result.shouldBuy){
        alert("YES " 
        + "\n high: " + data.result.candle.high
        + "\n low: " + data.result.candle.low
        + "\n close: " + data.result.candle.close
        + "\n high_gap: " + data.result.high_gap
        + "\n low_gap: " + data.result.low_gap
        + "\n factored_high_gap: " + data.result.factored_high_gap)
      }
      else{
        alert("NO " 
        + "\n high: " + data.result.candle.high
        + "\n low: " + data.result.candle.low
        + "\n close: " + data.result.candle.close
        + "\n high_gap: " + data.result.high_gap
        + "\n low_gap: " + data.result.low_gap
        + "\n factored_high_gap: " + data.result.factored_high_gap
      )}

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