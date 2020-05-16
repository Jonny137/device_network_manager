import React from 'react';
import {connect} from 'react-redux';

import {FLASK_APP_URL} from '../Constants';

import './Header.css';

// eslint-disable-next-line
import * as datejs from 'datejs'

class Header extends React.Component {

  constructor(props) {
    super(props);

    this.addDevice = this.addDevice.bind(this);
    this.getDisconnected = this.geNumOfDisconnected.bind(this);
    this.formatDiscTime = this.formatDiscTime.bind(this);
  }

  componentDidMount() {
    this.geNumOfDisconnected();
    this.interval = setInterval(() => this.geNumOfDisconnected(), 10000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  addDevice(event) {
    event.preventDefault();

    const data = new FormData(document.getElementById('add-device'));
    const headerInputs = document.getElementsByClassName('header-input');

    fetch(`${FLASK_APP_URL}/device`, {method: 'POST', body: data})
    .then(response => response.json())
    .then((device) => {
      Array.prototype.forEach.call(headerInputs, (input) => input.value = '');

      this.props.dispatch({type: 'INCREMENT_COUNT'});
      this.props.dispatch({
      type: 'ADD_DEVICE',
      payload:
        {
          ...device,
          ...{
            value: {...device},
            edit_ip_address: false,
            edit_device_name: false,
          }
        },
      }
    )});
  }

  geNumOfDisconnected() {
    fetch(`${FLASK_APP_URL}/count_disconnected`)
    .then(response => response.json())
    .then((data) => {
      this.props.dispatch({
        type: 'COUNT',
        payload: {
          device_name: data.device_name,
          ip_address: data.ip_address,
          disc_time: data.disc_time,
          count: data.count
        },
      })});
  }

  formatDiscTime() {
    return (new Date()).clearTime().addSeconds(this.props.disc_time).toString('H:mm:ss');
  }

  render() {
    return(
      <header className="header">
        <div className="header-item">
          <form id="add-device" action="" method="post" onSubmit={this.addDevice}>
            <div>
              <label className="header-spacing">Device Name:</label>
              <input name="device_name" className="header-input header-spacing" type="text" required></input>
              <label className="header-spacing">IP Address:</label>
              <input name="ip_address" className="header-input header-spacing" type="text" required></input>
            </div>
            <button type="submit">Add</button>
          </form>
        </div>

        <div className="header-item">
          <table cellSpacing="0" cellPadding="0" className="header-table">
            <tbody>
              <tr>
                <td>Disconnected devices:</td>
                <td><span>{this.props.count}</span></td>
              </tr>
              <tr>
                <td>Longest disconnected device:</td>
                <td><span>{this.props.device_name} [{this.props.ip_address}] - {this.formatDiscTime()}</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </header>
    );
  }
}

const mapStateToProps = state => ({
  device_name: state.countReducer.device_name,
  ip_address: state.countReducer.ip_address,
  disc_time: state.countReducer.disc_time,
  count: state.countReducer.count,
});

export default connect(mapStateToProps)(Header);
