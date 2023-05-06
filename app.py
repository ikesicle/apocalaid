from flask import *
import json

app = Flask(__name__)

"""
Apocalaid JSON format

{
    hospitals: [
        {
            location: LatLong,
            doctors: [
                {
                    name: str
                    specialty: str
                }
            ],
            capacity: int,
            patients: [
                {
                    name: str,
                    injuryclass: int 0-6,
                    reqspecialty: str
                }
            ]
        }
    ],
    hazardpts: [
        {
            location: LatLong,
            hazardtype: str,
            hazardradius: num
        }
    ]
}

"""
@app.route("/")
def patient():
    return render_template("index.html")

@app.route("/doctor")
def doctor():
    return render_template("doctor.html")

@app.route("/data")
def data():
    jason = json.load(open("jason.json"))
    return jason
