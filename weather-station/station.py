from sense_hat import SenseHat
import ssl
import time
import paho.mqtt.client as mqtt
import requests
import json

sense = SenseHat()
sense.clear()

host = "{CONVEX_BACKEND_URL}"

def get_id():
  try: 
    id = open("id.txt", "r").read()
    return id
  except:
    return None
  
def validate_parameter():
  if lat == "" or lon == "":
    print("Latitude and Longitude are required")
    return False
  return True

def get_parameters():
  if name == "" and desc == "":
    return {
      "lat": lat,
      "lon": lon
    }
  elif name == "":
    return {
      "lat": lat,
      "lon": lon,
      "description": desc
    }
  elif desc == "":
    return {
      "lat": lat,
      "lon": lon,
      "name": name
    }
  else:
    return {
      "lat": lat,
      "lon": lon,
      "name": name,
      "description": desc
    }
  
def register_device():
  try:
    response = requests.post(host+"/devices", json=get_parameters())
    if(response.status_code != 201):
      print(response.json())
      return None
    id = response.json()["id"]
    open("id.txt", "w").write(id)
    return id
  except:
    return None

# The callback function of connection
def on_connect(client, userdata, flags, rc):
    print(f"Connected with result code {rc}")


lat = 0.00 # Latitude on WGS Decimal Degree Format (Number)
lon =  0.00 # Longitude on WGS Decimal Degree Format (Number)
name = "{NODE_NAME}" # Name of device (optional)
desc = "{NODE_DESCRIPTION}" # Description of device (optional)

def main():
  id = get_id()
  if id == None and validate_parameter() == True:
    print("No ID, fetching ID and registering device")
    id = register_device()
  else:
    print("ID established")
    print(id)

  temps = []
  humids = []
  press = []

  client = mqtt.Client()
  client.username_pw_set("{ABLY_API_KEY}")
  client.tls_set(certfile=None,
                keyfile=None,
                cert_reqs=ssl.CERT_REQUIRED)
  client.on_connect = on_connect

  client.connect("mqtt.ably.io", 8883, 60)
  client.loop_start()
  while True:
      temp = sense.get_temperature()
      client.publish("/readings/temp", json.dumps({"device":id, "reading": temp}), 1)
      temps.append(temp)

      pres = sense.get_pressure()
      client.publish("/readings/pressure", json.dumps({"device":id, "reading": pres}), 1)
      press.append(pres)

      hum = sense.get_humidity()
      client.publish("/readings/humidity", json.dumps({"device":id, "reading":hum}), 1)
      humids.append(hum)

      if(len(temps) >= 30 and len(press) >= 30 and len(humids) >= 30):
        tempAvg = sum(temps)/len(temps)
        presAvg = sum(press)/len(press)
        humAvg = sum(humids)/len(humids)
        info = client.publish("/readings/average", json.dumps({"device":id, "temp": tempAvg, "humidity": humAvg, "pressure": presAvg}), 1)
        info.wait_for_publish()
        temps.clear()
        press.clear()
        humids.clear()
        print("Published data to DB")

      print("Published data readings: "+str(len(temps)))
      time.sleep(10)

main()