import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {
  PageHeader,
  ListGroup,
  ListGroupItem
} from 'react-bootstrap';
import './Home.css';
import { invokeApig } from '../libs/awsLib';

class Home extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      settings: [],
    };
  }

  async componentDidMount() {
    
    if (this.props.userToken === null) {
      return;
    }
     
    this.setState({ isLoading: true });

    try {
      const results = await this.settings();
      this.setState({ settings: results });
    }
    catch(e) {;
      alert(e);
    }

    this.setState({ isLoading: false });
  }

  settings() {
    return invokeApig({ path: '/settings' }, this.props.userToken);
  }

  renderSettingsList(settings) {
    return [{}].concat(settings).map((setting, i) => (
      i !== 0
        ? ( <ListGroupItem
              key={setting.settingId}
              href={`/settings/${setting.settingId}`}
              onClick={this.handleSettingClick}
              header={this.getDisplayname(setting.currency)}>
                { "Invest: " + setting.amount }
            </ListGroupItem> )
        : ( <ListGroupItem
              key="new"
              href="/settings/new"
              onClick={this.handleSettingClick}>
                <h4><b>{'\uFF0B'}</b> Create a new Setting</h4>
            </ListGroupItem> )
    ));
  }

  handleSettingClick = (event) => {
    event.preventDefault();
    this.props.history.push(event.currentTarget.getAttribute('href'));
  }

getDisplayname(currency)
{
  if(currency == "XXBTZEUR") return "Bitcoin";
  if(currency == "XETHZEUR") return "Ether";
  if(currency == "DASHEUR") return "Dash";
  if(currency == "XZECZEUR") return "ZCash";
  if(currency == "BCHEUR") return "Bitcoin Cash (shitcoin)";
  if(currency == "XXMRZEUR") return "Monero";
  if(currency == "XLTCZEUR") return "Litecoin";
  if(currency == "XETCZEUR") return "Ether Classic (shitcoin)";
  if(currency == "XXRPZEUR") return "Ripple";
  if(currency == "XREPZEUR") return "Augur";
  return currency;
}

renderLander() {
  return (
    <div className="lander">
    <h1>Welcome</h1>
    <p>You can either login or sign up Yo.</p>
    </div>
    );
  }

  renderSettings() {
    return (
      <div className="settings">
        <PageHeader>Your Settings</PageHeader>
        <ListGroup>
          { ! this.state.isLoading
            && this.renderSettingsList(this.state.settings) }
        </ListGroup>
      </div>
    );
  }

  render() {
    return (
      <div className="Home">
        { this.props.userToken === null
          ? this.renderLander()
          : this.renderSettings() }
      </div>
    );
  }
}

export default withRouter(Home);