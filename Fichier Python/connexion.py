import threading
import serial
from read_plate import detect_and_read_plate

def process_plate(image_path):
    detect_and_read_plate(image_path)
    print("Plate detection finished.")

# Configurez le port série
pico_port = 'COM4'
baud_rate = 9600

try:
    with serial.Serial(pico_port, baud_rate, timeout=1) as ser:
        print(f"Listening on {pico_port}...")
        while True:
            # Lire les données envoyées par le Pico
            if ser.in_waiting > 0:
                message = ser.readline().decode('utf-8').strip()
                if message == 'CAR_DETECTED':
                    print("Vehicle detected!")

                    # Démarrer un thread pour exécuter la fonction en parallèle
                    thread = threading.Thread(target=process_plate, args=('C:\\Users\\Martin\\Desktop\\3eme Ephec\\PythonInt\\voiture7.jpg',))
                    thread.start()

                    # Le programme continue pendant que la fonction de détection s'exécute dans le thread
                    print("Detection in progress in a separate thread.")

                    # Si vous avez besoin d'attendre que le thread termine avant de passer à l'étape suivante :
                    thread.join()
                    print("Plate detection finished, continuing.")
except serial.SerialException as e:
    print(f"Error: {e}")