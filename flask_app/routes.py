from flask import request

from app import app, ping_device
import database
from time import sleep


ping_device()

@app.route('/devices')
def get_data():
    return {'devices': database.find_all_devices()}

@app.route('/device', methods=['POST'])
def add_device():
    return database.create_device(request.form.to_dict())

@app.route('/device', methods=['DELETE'])
def remove_device():
    return database.delete_device(
        {'ip_address': request.args.get('ip_address')}
    )

@app.route('/count_disconnected')
def count_disconnected():
    return database.disconnected_devices()

@app.route('/device', methods=['PUT'])
def update_device():
    if request.args.get('ip_address') or request.args.get('device_name'):
        return database.update_device(request.json, request.args)
    else:
        return 404
