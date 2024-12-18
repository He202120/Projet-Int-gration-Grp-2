import cv2
import easyocr
import numpy as np
import requests
import re
from datetime import datetime  # Pour obtenir la date et l'heure actuelles

Parking_name = "Louvain Ephec"  # Nom du parking
idParking = "675efefe982debb80d30bf76"

def preprocess_image(img):
    # Convertir l'image en niveaux de gris
    img_gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    # Appliquer un seuil pour augmenter le contraste de l'image
    _, img_threshold = cv2.threshold(img_gray, 150, 255, cv2.THRESH_BINARY)
    return img_threshold

def detect_and_read_plate(image_path):
    # Charger l'image
    img = cv2.imread(image_path)
    if img is None:
        print(f"Erreur : Impossible de lire l'image {image_path}.")
        return

    # Prétraitement de l'image
    preprocessed_img = preprocess_image(img)

    # Initialiser EasyOCR
    reader = easyocr.Reader(['en'], gpu=False)

    # Lire le texte à partir de l'image prétraitée
    result = reader.readtext(preprocessed_img)

    if result:
        text_parts = []
        for (bbox, text, prob) in result:
            text = text.strip()  # Nettoyage de base
            text_parts.append(text)

        # Fusionner les résultats
        raw_plate_text = "".join(text_parts).replace(" ", "").upper()

        # Ajouter un tiret entre lettres et chiffres  
        plate_text = re.sub(r"([A-Z]+)(\d+)", r"\1-\2", raw_plate_text)

        # Ajouter "1-" au début si ce n'est pas déjà présent
        if not plate_text.startswith("1-"):
            plate_text = "1-" + plate_text

        print(f"Plaque détectée : {plate_text} (Précision : {prob * 100:.2f}%)")

        # Envoi de la plaque au backend pour vérifier si elle existe dans la base de données
        verifok = check_plate_in_db(plate_text)
        if verifok:
            return True
        else:
            return False
    else:
        print("Aucune plaque détectée.")
        return False
#---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
def check_plate_in_db(plate_text):
    # URL de l'API de vérification de la plaque
    url = 'http://localhost:5000/api/v1/check-plate'

    try:
        # Envoi de la requête POST au backend avec la plaque détectée
        response = requests.post(url, json={'plate': plate_text})
        
        # Gestion des réponses
        if response.status_code == 200:
            print(f"Succès : {response.json().get('message', 'Action réussie.')}")  # Affichage du message du backend
            
            # Envoi des données supplémentaires au backend
            send_parking_data(Parking_name, plate_text)
            update_parking_data(idParking, plate_text)
            
            return True
        elif response.status_code == 404:
            print("Erreur : Plaque non trouvée dans la base de données.")
            return False
        else:
            print(f"Erreur lors de la vérification de la plaque : {response.status_code} - {response.text}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"Erreur de connexion au serveur : {e}")
#---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
def send_parking_data(parking_name, plate_text):
    # URL de l'API pour l'envoi des données du parking
    url = 'http://localhost:5000/api/v1/parking-data'

    # Obtenir la date et l'heure actuelles
    now = datetime.now()
    date_str = now.strftime('%Y-%m-%d')  # Format : Année-Mois-Jour
    time_str = now.strftime('%H:%M:%S')  # Format : Heure:Minute:Seconde

    # Préparer les données à envoyer
    data = {
        'parking_name': parking_name,
        'date': date_str,
        'time': time_str,
        'plate': plate_text
    }

    try:
        # Envoi de la requête POST avec les données
        response = requests.post(url, json=data)
        if response.status_code == 200:
            print("Données du parking envoyées avec succès.")
        else:
            print(f"Erreur lors de l'envoi des données du parking : {response.status_code} - {response.text}")
    except requests.exceptions.RequestException as e:
        print(f"Erreur de connexion pour l'envoi des données : {e}")

#---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
def update_parking_data(parking_id, plate_text):
    # URL de l'API pour l'envoi des données du parking
    url = 'http://localhost:5000/api/v1/update-parking'

    # Obtenir la date et l'heure actuelles
    now = datetime.now()
    date_str = now.strftime('%Y-%m-%d')  # Format : Année-Mois-Jour
    time_str = now.strftime('%H:%M:%S')  # Format : Heure:Minute:Seconde

    # Préparer les données à envoyer
    data = {
        'parking_id': parking_id,
        'plate': plate_text
    }

    try:
        # Envoi de la requête POST avec les données
        response = requests.post(url, json=data)
        if response.status_code == 200:
            print("Données du parking update avec succès.")
        else:
            print(f"Erreur lors de l'update des données du parking : {response.status_code} - {response.text}")
    except requests.exceptions.RequestException as e:
        print(f"Erreur de connexion pour l'envoi des données : {e}")
