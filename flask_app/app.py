from flask import Flask
from flask_cors import CORS, cross_origin

import database
import subprocess, sys
from datetime import timedelta

import time
import atexit

import os
import stat

st = os.stat('app.py')
os.chmod('app.py', st.st_mode | stat.S_IEXEC)

from apscheduler.schedulers.background import BackgroundScheduler

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

def ping_device():
    global on_start
    devices = database.find_all_devices()
    disc_dev = [dev for dev in devices if dev['status'] == 'Disconnected']
    if len(disc_dev) == 0:
        on_start = 0
    for device in devices:
        try:
            response = subprocess.call('ping ' + device['ip_address'], 
                                        shell=True)
            if response == 0:
                database.update_device(device, {'status': 'Connected', 
                                       'disc_time': 0})
            else:
                database.update_device(device, {'status': 'Disconnected', 
                                                'disc_time': 15 * on_start})
        except Exception as e:
            print(e)
    on_start += 1

scheduler = BackgroundScheduler()
scheduler.add_job(func=ping_device, trigger='interval', seconds=15)
on_start = 0
scheduler.start()

# Shut down the scheduler when exiting the app
atexit.register(lambda: scheduler.shutdown())

import routes
