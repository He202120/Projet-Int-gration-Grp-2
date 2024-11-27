from machine import Pin, Timer
import time

# Initialisation
sensor_pin = Pin(15, Pin.IN, Pin.PULL_UP)  # GPIO 15 pour le capteur
last_time = 0  # Dernier passage de l'aimant

# Callback pour détecter le passage de l'aimant
def sensor_callback(pin):
    global last_time
    current_time = time.ticks_ms()
    elapsed_time = time.ticks_diff(current_time, last_time)  # Temps entre 2 passages

    if elapsed_time > 50:  # Filtrage anti-rebond
        last_time = current_time
        print("Voiture détectée !")  # Message à afficher

# Attach interruption
sensor_pin.irq(trigger=Pin.IRQ_FALLING, handler=sensor_callback)

# Boucle principale pour maintenir le programme actif
try:
    while True:
        time.sleep(0.1)  # Petite pause pour éviter de surcharger le CPU
except KeyboardInterrupt:
    print("Programme arrêté.")