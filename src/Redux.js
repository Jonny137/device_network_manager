import { createStore, combineReducers } from 'redux';

const initialDevicesState = {
  devices: [],
};

const initialCountState = {
  device_name: '',
  ip_address: '',
  disc_time: 0,
  count: 0,
};

function deviceReducer(state = initialDevicesState, action) {
  switch (action.type) {
    case 'ADD_DEVICE':
      return {
        devices: [...state.devices, action.payload]
      };
    case 'EDIT_DEVICE':
        return {
          devices: state.devices.map((device) => {
            if (device.value.ip_address === action.payload.value.ip_address) {
              device = action.payload;
            } else {
              device.edit_ip_address = false;
              device.edit_device_name = false;
            }
            return device;
          })
        };
    case 'NEW_DEVICE_DATA':
      return {
        devices: state.devices.map((device) => {
          if (device.value.ip_address === action.payload.value.ip_address) {
            device = action.payload;
          }
          return device;
        })
      };
    case 'RESET_DATA':
      return {
        devices: state.devices.map((device) => {
          device.new_ip_address = '';
          device.new_device_name = '';
          return device;
        })
      };
    case 'GET_DEVICES':
      action.payload = action.payload.map((device) => {
        let oldDevice;

        device.value = {...device};

        if (state.devices.length !== 0) {
          oldDevice = state.devices.find((d) => d.ip_address === device.ip_address);
        }
          
        device.edit_ip_address = oldDevice && oldDevice.edit_ip_address !== undefined ?
                                  oldDevice.edit_ip_address : false;
        device.edit_device_name = oldDevice && oldDevice.edit_device_name !== undefined ?
                                  oldDevice.edit_device_name : false;

        return device;
      });

      return {
        devices: action.payload
      };
    default:
      return state;
  }
}

function countReducer(state = initialCountState, action) {
  switch (action.type) {
    case 'COUNT':
      return action.payload;
    case 'DECREMENT_COUNT':
      return {
        ...state,
        count: state.count - 1
      };
    case 'INCREMENT_COUNT':
      return {
        ...state,
        count: state.count + 1
      };
    default:
      return state;
  }
}

const reducers = combineReducers({
  deviceReducer, countReducer
});

const store = createStore(reducers);

export default store;
