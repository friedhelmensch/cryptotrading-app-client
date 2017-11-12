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

        var checkStatus = "no buy";
        if (data.result.shouldBuy) checkStatus = "buy";
        this.changeElement(setting.id, checkStatus);
      
      }catch(ex){
        this.changeElement(setting.id, "error");
      } finally {
        counter++;
        if (counter === this.state.settings.length) this.setState({ isChecking: false });
      }
    }, this);

  }

  changeElement(id, checkStatus) {

    var settings = this.state.settings;
    var settingIndex = settings.findIndex(function (setting) {
      return setting.id === id;
    });

    var updatedSetting = update(settings[settingIndex], { checkStatus: { $set: checkStatus } });

    var newSettings = update(settings, {
      $splice: [[settingIndex, 1, updatedSetting]]
    });

    this.setState({ settings: newSettings });
  }

  renderSettingsList(settings) {
    return settings.map((setting) => (
      <ListGroupItem
        key={setting.currency}
        header={getDisplayname(setting.currency)}
        bsStyle={setting.checkStatus === "notChecked" ? "info" : setting.checkStatus === "buy" ? "success" : setting.checkStatus === "error" ? "warning" : "danger"}>
      </ListGroupItem>
    ));
  }

  render() {
    return !this.state.isLoading && (
      <div className="Profile">
        <form>
          <ListGroup>
            {!this.state.isLoading
              && this.renderSettingsList(this.state.settings)}
          </ListGroup>
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