import React from 'react';
import {connect} from 'react-redux'

import {FLASK_APP_URL} from '../Constants';

import './Table.css';

class Table extends React.Component {

  constructor(props) {
    super(props);

    this.handleDelete = this.deleteDevice.bind(this);
    this.handleEdit = this.editDevice.bind(this);
    this.handleInput = this.handleInput.bind(this);

    this.EDIT_DEVICE_NAME = 'edit_device_name';
  }

  componentDidMount() {
    this.getDevices();
    this.interval = setInterval(() => this.getDevices(), 10000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  getDevices() {
    fetch(`${FLASK_APP_URL}/devices`)
    .then(response => response.json())
    .then(response => response.devices)
    .then(devices => 
      this.props.dispatch({
        type: 'GET_DEVICES',
        payload: devices
      }));
  }

  deleteDevice(event, ip_address, status) {
    event.preventDefault();

    fetch(`${FLASK_APP_URL}/device?ip_address=${ip_address}`, {method: 'DELETE'})
    .then(() => {
      if (status === 'Disconnected') {
        this.props.dispatch({type: 'DECREMENT_COUNT'});
      }
      this.getDevices();
    });
  }

  editDevice(event, device, type) {
    const body = {
      device_name: device.value.device_name,
      ip_address: device.value.ip_address
    }

    if(event.key === 'Enter') {
      fetch(`${FLASK_APP_URL}/device?${type}=${event.currentTarget.value}`, {
        method: 'PUT',
        body: JSON.stringify(body),
        headers: {'Content-Type': 'application/json'},
      }).then(() => {
        this.getDevices();

        this.props.dispatch({type: 'RESET_DATA'});

        device[`edit_${type}`] = !device[`edit_${type}`];

        this.props.dispatch({
          type: 'EDIT_DEVICE',
          payload: device
        });
      });
    }
  }

  handleInput(event, device, type) {
    const newValue = event.currentTarget.value;

    if (newValue !== '') {
      if (type === this.EDIT_DEVICE_NAME) {
        device.new_device_name = newValue;
      } else {
        device.new_ip_address = newValue;
      }
    
      this.props.dispatch({
        type: 'NEW_DEVICE_DATA',
        payload: device,
      });
    }
  }

  onEditClick(device, type) {
    device[type] = !device[type];

    if (type === this.EDIT_DEVICE_NAME) {
      device.edit_ip_address = false;
    } else {
      device.edit_device_name = false;
    }

    this.props.dispatch({
      type: 'EDIT_DEVICE',
      payload: device
    });
  }

  getCellStatus(status) {
    switch(status) {
      case 'Connected':
        return 'cell-status connected';
      case 'Disconnected':
        return 'cell-status disconnected';
      default:
        return 'cell-status';
    }
  }

  getButtonClasses(className, edit) {
    return edit ? `${className} hidden` : className;
  }

  render() {
    return(
      <table className="device-table">
        <thead>
          <tr>
            <th>Device Name</th>
            <th>IP Address</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {this.props.devices.map((value, index) => {
            return(
              <tr id={index} key={index}>
                <td className="cell-device-name">
                  <span className={value.edit_device_name ? 'hidden' : ''}>{value.value.device_name}</span>
                  <input className={!value.edit_device_name ? 'hidden': ''}
                         value={value.new_device_name}
                         onKeyPress={(e) => this.editDevice(e, value, 'device_name')}
                         onChange={(e) => this.handleInput(e, value, this.EDIT_DEVICE_NAME)}></input>
                  <button className={this.getButtonClasses('edit-device-name', value.edit_device_name)}
                          onClick={() => this.onEditClick(value, this.EDIT_DEVICE_NAME)}>Edit</button>
                </td>
                <td className="cell-ip-address">
                  <span className={value.edit_ip_address ? 'hidden' : ''}>{value.value.ip_address}</span>
                  <input value={value.new_ip_address}
                         className={!value.edit_ip_address ? 'hidden': ''}
                         onKeyPress={(e) => this.editDevice(e, value, 'ip_address')}
                         onChange={(e) => this.handleInput(e, value, 'edit_ip_address')}></input>
                    <button className={this.getButtonClasses('edit-ip-address', value.edit_ip_address)}
                            onClick={() => this.onEditClick(value, 'edit_ip_address')}>Edit</button>
                </td>
                <td className={this.getCellStatus(value.value.status)}>
                  <strong>{value.value.status}</strong>
                </td>
                <td className="cell-delete">
                  <button onClick={(e) => this.deleteDevice(e, value.value.ip_address, value.value.status)}>Delete</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }
}

const mapStateToProps = state => ({
  devices: state.deviceReducer.devices,
});

export default connect(mapStateToProps)(Table);
