import pymongo
from bson.objectid import ObjectId
from mongo_db import MONGO_DB_URL


# Use your MongoDB URL
client = pymongo.MongoClient(MONGO_DB_URL)
db = client.BigBrother
devices_col = db.devices

def find_device(device_info):
    device = devices_col.find_one(device_info)
    if device and device['_id']:
        del device['_id']
    return device

def find_many_devices(device_info):
    filtered_devices = []
    for device in devices_col.find(device_info):
        if device['_id']:
            del device['_id']
        filtered_devices.append(device)
    return filtered_devices

def find_all_devices():
    devices = []
    for device in devices_col.find():
        if device['_id']:
            del device['_id']
        devices.append(device)
    return devices

def create_device(device_info):
    device_info['status'] = 'Disconnected'
    device_info['disc_time'] = 0
    devices_col.insert_one(device_info)
    del device_info['_id']
    return device_info

def update_device(device_info, new_device_info):
    devices_col.update_one(device_info, {'$set': new_device_info})
    keys = list(new_device_info.keys())
    device_info[keys[0]] = new_device_info[keys[0]]
    return find_device(device_info)

def delete_device(device_info):
    device = devices_col.delete_one(device_info)
    return device_info

def disconnected_devices():
    devices = find_all_devices()
    disc_dev = [dev for dev in devices if dev['status'] == 'Disconnected']
    max_disc = {'device_name': '', 'disc_time': 0}
    if len(disc_dev) > 0:
        max_disc = sorted(disc_dev, key=lambda device: device['disc_time'], 
                        reverse=True)[0]
    return {'count': len(disc_dev), 
            'device_name': max_disc['device_name'],
            'ip_address': max_disc['ip_address'],
            'disc_time': max_disc['disc_time']
            }
