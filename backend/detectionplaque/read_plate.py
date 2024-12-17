import cv2
import easyocr
import numpy as np
import requests
import re

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
        # Cette expression permet d'ajouter un tiret entre les lettres et les chiffres
        plate_text = re.sub(r"([A-Z]+)(\d+)", r"\1-\2", raw_plate_text)

        print(f"Plaque détectée : {plate_text} (Précision : {prob * 100:.2f}%)")

        # Envoi de la plaque au backend pour vérifier si elle existe dans la base de données
        check_plate_in_db(plate_text)
    else:
        print("Aucune plaque détectée.")


def check_plate_in_db(plate_text):
    # URL de l'API de vérification de la plaque
    url = 'http://localhost:5000/api/v1/check-plate'

    try:
        # Envoi de la requête POST au backend avec la plaque détectée
        response = requests.post(url, json={'plate': plate_text})
        
        # Gestion des réponses
        if response.status_code == 200:
            print(f"Succès : {response.json().get('message', 'Action réussie.')}")
        elif response.status_code == 404:
            print("Erreur : Plaque non trouvée dans la base de données.")
        else:
            print(f"Erreur lors de la vérification de la plaque : {response.status_code} - {response.text}")
    except requests.exceptions.RequestException as e:
        print(f"Erreur de connexion au serveur : {e}")


if __name__ == "__main__":
    detect_and_read_plate('C:\\final\\Projet-Integration-Grp-2\\backend\\detectionplaque\\voiture.jpg')