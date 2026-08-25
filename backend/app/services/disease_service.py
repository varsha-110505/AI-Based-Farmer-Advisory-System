import sys
import os

ML_PATH = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "../../ml")
)

if ML_PATH not in sys.path:
    sys.path.append(ML_PATH)

from predict import predict_disease