import React, { Component } from 'react';
import {
  FormGroup,
  FormControl,
} from 'react-bootstrap';
import LoaderButton from '../components/LoaderButton';
import NodeRSA from 'node-rsa';
import keyStore from '../keyStore.js';

class ProfileWritable extends Component {
    constructor(props) {
      super(props);
      this.state = {
        isLoading: false,
        apiKey: '',
        apiSecret: ''
      };
    }
    
    handleSubmit = async (event) => {
      event.preventDefault();
      this.setState({ isLoading: true });
  
      try {
        
        const encryptor = new NodeRSA();
        encryptor.importKey(keyStore.publicKey, "public");
        var encryptedApiKey = encryptor.encrypt(this.state.apiKey, "base64");
        var encryptedApiSecret = encryptor.encrypt(this.state.apiSecret, "base64");
        
        await this.props.saveProfile({
          apiKey: encryptedApiKey,
          apiSecret: encryptedApiSecret
        });
  
        await this.props.profileChanged();
  
      }
      catch (e) {
        alert(e);
        console.log(e);
        this.setState({ isLoading: false });
      }
    }
  
    validateForm() {
      return this.state.apiKey.length > 0 && this.state.apiSecret.length > 0;
    }
  
    handleChange = (event) => {
      this.setState({
        [event.target.id]: event.target.value
      });
    }
  
    render() {
      return (
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="apiKey">
            <label>API key</label>
            <FormControl
              onChange={this.handleChange}
              value={this.state.apiKey}
              componentClass="input" />
          </FormGroup>
          <FormGroup controlId="apiSecret">
            <label>API secret</label>
            <FormControl
              onChange={this.handleChange}
              value={this.state.apiSecret}
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
            loadingText="Saving" />
        </form>
      );
    }
  }

export default ProfileWritable;