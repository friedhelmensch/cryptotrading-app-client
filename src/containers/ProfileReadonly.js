import React, { Component } from 'react';
import {
  FormGroup,
  FormControl,
} from 'react-bootstrap';
import LoaderButton from '../components/LoaderButton';

class ProfileReadonly extends Component {
    constructor(props) {
      super(props);
  
      this.state = {
        apiKey: this.props.apiKey,
        apiSecret: this.props.apiSecret,
      };
    }
  
    handleDelete = async (event) => {
      event.preventDefault();
  
      const confirmed = window.confirm('Are you sure you want to delete these api keys?');
  
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
  
    render() {
      return (
        <div className="Profile">
          <form>
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
              isLoading={this.state.isLoading}
              onClick={this.handleDelete}
              text="Delete"
              loadingText="Deleting" />
          </form>
        </div>
      );
    }
  }

  export default ProfileReadonly;