import flask
from flask import request
import numpy as np
import pandas as pd
import sklearn
import pickle

pkl_filename = "/home/sidsrivastava/api/pickle_model.pkl"
with open(pkl_filename, 'rb') as file:
    pickle_model = pickle.load(file)

app = flask.Flask(__name__)
app.config["DEBUG"] = True

@app.route('/', methods=['GET'])
def home():
   if 'string' in request.args:
        string = request.args['string']
        pred = pickle_model.predict([string])
        return pred[0]
   return "None"


if __name__ == '__main__':
    app.run()
