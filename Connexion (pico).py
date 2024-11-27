import network
import urequests  # Bibliothèque pour HTTP
from machine import Pin
import time

# Configuration Wi-Fi
SSID = 'Pouf'  # Remplace par le nom de ton réseau Wi-Fi
PASSWORD = 'jppdetoi'  # Mot de passe Wi-Fi
SERVER_URL = 'http://192.168.127.17:5000'  # Adresse de l'ordinateur

# Initialisation du capteur
sensor_pin = Pin(15, Pin.IN, Pin.PULL_UP)
last_time = 0

# Connexion Wi-Fi
print("Connexion au Wi-Fi...")
wifi = network.WLAN(network.STA_IF)
wifi.active(True)
wifi.connect(SSID, PASSWORD)

while not wifi.isconnected():
    print("Connexion en cours...")
    time.sleep(1)

print("Connecté au Wi-Fi :", wifi.ifconfig())

# Fonction pour envoyer une requête HTTP
def send_detection():
    try:
        response = urequests.post(SERVER_URL, json={"status": "Voiture détectée"})
        print("Requête envoyée, réponse :", response.text)
        response.close()
    except Exception as e:
        print("Erreur lors de l'envoi :", e)

# Callback pour la détection de voiture
def sensor_callback(pin):
    global last_time
    current_time = time.ticks_ms()
    elapsed_time = time.ticks_diff(current_time, last_time)

    if elapsed_time > 50:  # Filtrage anti-rebond
        last_time = current_time
        print("Voiture détectée ! Envoi d'une requête...")
        send_detection()

# Attacher l'interruption au capteur
sensor_pin.irq(trigger=Pin.IRQ_FALLING, handler=sensor_callback)

# Boucle principale (le Pico reste actif)
while True:
    time.sleep(0.1)