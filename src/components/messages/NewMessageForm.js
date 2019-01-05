import React from 'react';
import { API_ROOT, HEADERS } from '../../constants';

class NewMessageForm extends React.Component {
  state = {
    text: '',
    conversation_id: this.props.conversation_id,
    user_id: this.props.user_id
  };

  componentWillReceiveProps = nextProps => {
    this.setState({ conversation_id: nextProps.conversation_id });
  };

  handleChange = e => {
    this.setState({ text: e.target.value });
  };

  handleSubmit = e => {
    e.preventDefault();

    fetch(API_ROOT + `/messages`, {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify(this.state)
    });
    this.setState({ text: '' });
  };


  render = () => {
    return (
      <div className="send-wrap">
        <form onSubmit={this.handleSubmit}>
          <textarea className="form-control send-message" rows="3" placeholder="Write a reply..."
            type="text"
            value={this.state.text}
            onChange={this.handleChange}
          ></textarea>
          <button className="text-right btn   send-message-btn pull-right" type="submit">Submit</button>
        </form>
      </div>
    );
  };
}

export default NewMessageForm;
