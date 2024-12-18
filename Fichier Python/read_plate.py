import cv2
import easyocr
import numpy as np
import requests
import os
import time
from datetime import datetime  # Pour obtenir la date et l'heure actuelles

# Configuration
Parking_name = "Louvain Ephec"
idParking = "675efefe982debb80d30bf76"

def detect_and_read_plate_from_camera(image):
    """
    Détection et lecture de la plaque à partir d'une image capturée par la caméra.
    """
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Appliquer un flou pour réduire le bruit
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)

    # Détecter les contours avec Canny
    edges = cv2.Canny(blurred, 50, 150)

    # Trouver les contours
    contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    # Parcourir les contours pour trouver des zones potentielles de plaques
    potential_plates = []
    for contour in contours:
        x, y, w, h = cv2.boundingRect(contour)
        if 100 <= w <= 1000 and 20 <= h <= 500:
            plate_region = image[y:y+h, x:x+w]
            hsv_plate = cv2.cvtColor(plate_region, cv2.COLOR_BGR2HSV)
            lower_red1 = np.array([0, 100, 50])
            upper_red1 = np.array([10, 255, 255])
            lower_red2 = np.array([100, 100, 100])
            upper_red2 = np.array([180, 255, 255])

            mask_red1 = cv2.inRange(hsv_plate, lower_red1, upper_red1)
            mask_red2 = cv2.inRange(hsv_plate, lower_red2, upper_red2)
            mask_red = cv2.bitwise_or(mask_red1, mask_red2)
            red_pixel_count = cv2.countNonZero(mask_red)

            if 100 <= red_pixel_count <= 10000:
                potential_plates.append((x, y, w, h))

    if potential_plates:
        lowest_plate = max(potential_plates, key=lambda p: p[1])
        x, y, w, h = lowest_plate
        selected_plate_image = image[y:y+h, x:x+w]
        gray_plate_image = cv2.cvtColor(selected_plate_image, cv2.COLOR_BGR2GRAY)
        blurred_gray = cv2.GaussianBlur(gray_plate_image, (5, 5), 0)
        sharpened_gray = cv2.addWeighted(gray_plate_image, 2, blurred_gray, -1, 0)
        return sharpened_gray

    return None

def extract_text_from_plate_image(plate_image):
    """
    Extraire le texte de l'image de la plaque à l'aide d'EasyOCR.
    """
    if plate_image is not None:
        reader = easyocr.Reader(['fr', 'en'])
        resultats = reader.readtext(plate_image)

        texte_complet = ""
        caracteres_a_supprimer = ["-", ".", " ", "!", "[", "]", "&", "*", "(", ")", "$", "\'", "|", ","]

        for resultat in resultats:
            _, texte, _ = resultat
            for char in caracteres_a_supprimer:
                texte = texte.replace(char, "")
            texte_complet += texte

        if not texte_complet:  # Vérifier si le texte est vide
            print("Aucun texte détecté.")
            return None

        # Modifier le texte si nécessaire
        texte_complet_modifie = ""
        lettres = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
        i = 0
        ajouter_tiret_complet = texte_complet[0] in ['1', '2']

        while i < len(texte_complet):
            if i + 2 < len(texte_complet) and all(c in lettres for c in texte_complet[i:i+3]):
                if ajouter_tiret_complet:
                    texte_complet_modifie += "-" + texte_complet[i:i+3] + "-"
                else:
                    texte_complet_modifie += texte_complet[i:i+3] + "-"
                i += 3
            else:
                texte_complet_modifie += texte_complet[i]
                i += 1

        return texte_complet_modifie
    else:
        print("L'image de la plaque est vide ou invalide.")
        return None
    
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


def send_plate_to_db(plate_text):
    """
    Envoie la plaque détectée au backend.
    """
    url = 'http://localhost:5000/api/v1/update-parking'
    try:
        response = requests.post(url, json={'plate': plate_text})
        if response.status_code == 200:
            print(f"Succès : {response.json().get('message', 'Action réussie.')}")
            return True
        else:
            print(f"Erreur : {response.status_code} - {response.text}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"Erreur de connexion au serveur : {e}")
        return False

def capture_from_camera():
    """
    Capture une image depuis la caméra et détecte la plaque d'immatriculation.
    """
    cap = cv2.VideoCapture(1)  # Utiliser la caméra
    if not cap.isOpened():
        print("Erreur : Impossible d'accéder à la caméra.")
        return

    time.sleep(3)  # Attendre que la caméra soit prête
    ret, frame = cap.read()
    cap.release()

    if ret:

        plate_image = detect_and_read_plate_from_camera(frame)
        if plate_image is not None:
            plate_text = extract_text_from_plate_image(plate_image)
            if plate_text:
                print(f"Texte détecté : {plate_text}")

                # Envoi de la plaque au backend pour vérification et mise à jour du parking
                if send_plate_to_db(plate_text):  # Si la plaque est correctement enregistrée ou vérifiée
                    update_parking_data(idParking, plate_text)  # Mise à jour du parking
                    send_parking_data(Parking_name, plate_text)  # Envoi des données au parking
                else:
                    print("Échec de l'envoi de la plaque au backend.")
            else:
                print("Impossible de lire la plaque.")
        else:
            print("Aucune plaque détectée.")
    else:
        print("Erreur lors de la capture de l'image.")


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


