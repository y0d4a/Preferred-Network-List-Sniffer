import datetime
import json
import time

import firebase_admin
from firebase_admin import db, credentials

from parser import parse_traffic_file

CONFIG_FILE = json.load(open("sniffer.config"))


def upload_to_firebase(node):
    """
    Upload sniffed data to firebase database using `update` function.
    """
    data = parse_traffic_file()
    db.reference(f"/{node}").update(data)


def send_data():
    """
    Sends sniffed data (SSID + timestamp) to a Firebase database.
    """
    # Get databaseUrl key from config file.
    database_url = list(CONFIG_FILE.keys())[0]

    # Load Firebase credentials.
    cred = credentials.Certificate("firebase_credentials.json")

    # Create a new app instance using the loaded credentials and database name.
    firebase_admin.initialize_app(cred, {database_url: CONFIG_FILE[database_url]})

    # Timestamp is used to name the main node for storing data. The format is 'year + month + day', e.q. 20231202.
    timestamp = datetime.datetime.now().strftime("%Y%m%d")
    while True:
        upload_to_firebase(timestamp)
        time.sleep(CONFIG_FILE["database_wait_time"])


send_data()