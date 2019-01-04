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


  //   return (
  //     <div className="newMessageForm">
  //       <form onSubmit={this.handleSubmit}>
  //         <label>New Message:</label>
  //         <br />
  //         <input
  //           type="text"
  //           value={this.state.text}
  //           onChange={this.handleChange}
  //         />
  //         <input type="submit" />
  //       </form>
  //     </div>
  //   );
  // };

  // <div class="send-wrap ">
  //
  //     <textarea class="form-control send-message" rows="3" placeholder="Write a reply..."></textarea>
  //
  //
  // </div>
  // <div class="btn-panel">
  //     <a href="" class=" col-lg-3 btn   send-message-btn " role="button"><i class="fa fa-cloud-upload"></i> Add Files</a>
  //     <a href="" class=" col-lg-4 text-right btn   send-message-btn pull-right" role="button"><i class="fa fa-plus"></i> Send Message</a>
  // </div>



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
