from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/', methods=['POST'])
def detect_car():
    data = request.get_json()
    if data and data.get("status") == "Voiture détectée":
        print("Voiture détectée via le Pico !")
        return jsonify({"response": "Détection reçue"}), 200
    return jsonify({"response": "Requête invalide"}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)  # Écoute sur le réseau local
