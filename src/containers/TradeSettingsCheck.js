import React, { Component } from 'react';
import LoaderButton from '../components/LoaderButton';
import './ProfileEdit.css';
import { getDisplayname } from '../libs/currencyHelper';
import { invokeApig } from '../libs/awsLib';
import {
  ListGroup,
  ListGroupItem
} from 'react-bootstrap';
import update from 'immutability-helper';
import ReactTable from "react-table";
import "react-table/react-table.css";

class TradeSettingsCheck extends Component {
  constructor(props) {
    super(props);

    this.state = {
      settings: []
    };
  }

  async componentDidMount() {
    try {
      this.setState({ isLoading: true });
      const loadedSettings = await this.loadSettings();
      var settings = loadedSettings.map((loadedSetting) => {
        return {
          currency: loadedSetting.currency,
          checkStatus: "notChecked",
          id: loadedSetting.settingId
        }
      });
      const profile = await this.loadProfile();
      this.setState(
        {
          settings: settings,
          spread: profile.spread,
          buyFactor: profile.buyFactor,
          isLoading: false
        });
    }
    catch (e) {
      alert(e);
    }
  }

  loadSettings() {
    return invokeApig({ path: '/settings' }, this.props.userToken);
  }

  loadProfile() {
    return invokeApig({ path: `/profile` }, this.props.userToken);
  }

  handleReset = async (event) => {
    const loadedSettings = await this.loadSettings();
    var settings = loadedSettings.map((loadedSetting) => {
      return {
        currency: loadedSetting.currency,
        checkStatus: "notChecked",
        id: loadedSetting.settingId
      }
    });
    this.setState(
      {
        settings: settings
      });
  }

  handleCheck = async (event) => {

    this.setState({ isChecking: true });
    var counter = 0;
    this.state.settings.forEach(async function (setting) {
      try {
        const baseUrl = "https://crypto-tradingapp-simulator.herokuapp.com/shouldBuy?"
        const parameters = "pair=" + setting.currency + "&signal=" + this.state.spread + "&factor=" + this.state.buyFactor;
        const url = baseUrl + parameters;
        const response = await fetch(url);
        var data = await response.json();

        var updatedSetting = {
          currency: setting.currency,
          id: setting.currency,
          shouldBuy: "" + data.result.shouldBuy,
          high: data.result.candle.high.toFixed(2),
          low: data.result.candle.low.toFixed(2),
          close: data.result.candle.close.toFixed(2),
          high_gap: data.result.high_gap.toFixed(2),
          low_gap: data.result.low_gap.toFixed(2),
          factored_high_gap: data.result.factored_high_gap.toFixed(2)
        }

        this.changeElement(setting.id, updatedSetting)

      } catch (ex) {
        var updatedSetting = {
          currency: setting.currency,
          id: setting.currency,
          shouldBuy: "error",
          high: "error",
          low: "error",
          close: "error",
          high_gap: "error",
          low_gap: "error",
          factored_high_gap: "error",
        }
        this.changeElement(setting.id, updatedSetting)
      } finally {
        counter++;
        if (counter === this.state.settings.length) this.setState({ isChecking: false });
      }
    }, this);

  }

  changeElement(id, updatedSetting) {

    var settings = this.state.settings;
    var settingIndex = settings.findIndex(function (setting) {
      return setting.id === id;
    });

    var newSettings = update(settings, {
      $splice: [[settingIndex, 1, updatedSetting]]
    });

    this.setState({ settings: newSettings });
  }

  render() {
    return !this.state.isLoading && (
      <div className="Profile">
        <form>
          <ReactTable
            data={this.state.settings}
            showPagination={false}
            columns={[
              {
                Header: "Currency",
                accessor: d => getDisplayname(d.currency),
                id: d => d.currency
              },
              {
                Header: "Buy?",
                accessor: "shouldBuy"
              }, {
                Header: "High",
                accessor: "high"
              },
              {
                Header: "Low",
                accessor: "low"
              },
              {
                Header: "Close",
                accessor: "close"
              },
              {
                Header: "High_Gap",
                accessor: "high_gap"
              },
              {
                Header: "Low_Gap",
                accessor: "low_gap"
              },
              {
                Header: "Factored_High",
                accessor: "factored_high_gap"
              }
            ]}
            defaultPageSize={this.state.settings.length}
            className="-striped -highlight"
          />
          <ListGroup>
            <ListGroupItem
              key="1"
              header={"Spread: " + this.state.spread}>
            </ListGroupItem>
            <ListGroupItem
              key="2"
              header={"Buy factor: " + this.state.buyFactor}>
            </ListGroupItem>
          </ListGroup>
          <LoaderButton
            block
            bsStyle="primary"
            bsSize="large"
            isLoading={this.state.isChecking}
            onClick={this.handleCheck}
            text="Check"
            loadingText="Checking..." />
          <LoaderButton
            block
            bsStyle="primary"
            bsSize="large"
            onClick={this.handleReset}
            text="Reset" />
        </form>
      </div>
    );
  }
}

export default TradeSettingsCheck;