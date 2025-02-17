#include <Adafruit_Fingerprint.h>
#include <HardwareSerial.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <SD.h>
#include <SPI.h>
#include <Keypad.h>
#include <WiFiManager.h> 
#include <IOXhop_FirebaseESP32.h> 

HardwareSerial mySerial(1);
Adafruit_Fingerprint finger = Adafruit_Fingerprint(&mySerial);

const int relayPin = 2;
const int CS_PIN = 5; 
const byte ROWS = 4; 
const byte COLS = 4;
uint8_t p;

#define FIREBASE_HOST "your_firebase_host"
#define FIREBASE_authorization_key "your_firebase_key"
#define SCREEN_WIDTH 128 
#define SCREEN_HEIGHT 64
#define OLED_RESET    -1
#define MC18_SENSOR_PIN 4
#define ESP32CAM_PIN 15

Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

char keys[ROWS][COLS] = {
  {'1', '4', '7', '*'},
  {'2', '5', '8', '0'},
  {'3', '6', '9', '#'},
  {'A', 'B', 'C', 'D'}
};
byte rowPins[ROWS] = {32, 33, 25, 26};
byte colPins[COLS] = {27, 14, 12, 13};

Keypad keypad = Keypad(makeKeymap(keys), rowPins, colPins, ROWS, COLS);
char* password; 
char message[13];
bool Mc18_sensorState;

void display_oled(const char* n, int x, int y);
void enrollFingerprint();
void createFile();
char* getPassword();
void takeAphoto();

void setup() {
  Serial.begin(115200);
  pinMode(relayPin, OUTPUT);
  if(!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
    for(;;); 
  }
  display.clearDisplay();
  display.setTextColor(WHITE);
  mySerial.begin(57600, SERIAL_8N1, 16, 17);
  finger.begin(57600);
  delay(5);
  if (finger.verifyPassword()) {
    Serial.println("tim thay cam bien van tay");
  } else {
    Serial.println("Khong thay cam bien van tay");
    display_oled("!AS608", 25, 20);
    while (1) { delay(1); }
  }
  if (!SD.begin(CS_PIN)) {
    Serial.println("loi SD!");
    display_oled("!SD", 25, 20);
    while (1) { delay(1); }
  }
  WiFiManager wifiManager;
  wifiManager.autoConnect("ESP32_AP", "12345678");
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("Connected WiFi!");
  } else {
    Serial.println("Failed WiFi");
  }
  Firebase.begin(FIREBASE_HOST, FIREBASE_authorization_key); 
  pinMode(MC18_SENSOR_PIN, INPUT_PULLUP);
  pinMode(ESP32CAM_PIN, OUTPUT);
  createFile();
  password = getPassword();
  memset(message, 0, 13);
  Serial.println(password);
}
void loop() {
  static int loginKeypadWarning = 0;
  char key = keypad.getKey();
  char input_password[6]; 
  Mc18_sensorState = digitalRead(MC18_SENSOR_PIN) == LOW ;
  if (Mc18_sensorState) {
    display_oled("Closed", 25, 20);
    Firebase.setBool("cua", true);
    login();
  }else {
    display_oled("Opened", 20, 25);
    Serial.println("dang gui false");
    Firebase.setBool("cua", false);
    Serial.println("da gui false");
  }
  if (key == 'A') {
    Serial.println("Password:");
    memset(input_password, 0, sizeof(input_password)); 
    int password_length = 0;
    display_oled("Password:", 15, 10);
    while (password_length < 6) {
        key = keypad.getKey();
        if (key >= '0' && key <= '9') {
            delay(200); 
            input_password[password_length] = key;
            Serial.println(input_password); 
            password_length++; 
            input_password[password_length] = '\0'; 
            display_oled(input_password, 4, 4);
            delay(200); 
        }
      }
    if (strcmp(input_password, password) == 0) {
      Serial.println("ok");
      loginKeypadWarning = 0;
      bool status = true;
      display_oled("1:Enroll  2:Unlock  3:ChangePW4:Delete", 0, 0);
      while(status){
        key = keypad.getKey();
        switch (key) {
        case '1':
          enrollFingerprint();
          status = false;
          break;
        case '2':
          digitalWrite(relayPin, HIGH);
          display_oled("Unlock", 30, 20);
          delay(5000);
          digitalWrite(relayPin, LOW);
          status = false;
          break;
        case '3':
          memset(input_password, 0, sizeof(input_password)); 
          password_length = 0; 
          display_oled("Enter     New PW:", 30, 20); 
          while (password_length < 6) {
            key = keypad.getKey();
            if (key >= '0' && key <= '9') {
              delay(200);
              input_password[password_length] = key;
              password_length++;
              input_password[password_length] = '\0'; 
              display_oled(input_password, 4, 4); 
              delay(200);
            }
          }
          changePassword(input_password);
          memset(password, 0, sizeof(password));
          memcpy(password, input_password, 6);
          status = false;
          break;
        case '4':
          Delete();
          status = false;
          break;
        default:
          break;
        }
      }
    } else{
      Serial.println("!ok");
      loginKeypadWarning++;
      if(loginKeypadWarning >= 3){
        takeAphoto();
        loginKeypadWarning = 0;
      }
    }
    Serial.println(loginKeypadWarning);
  }
  Serial.println(key);
  unlockByFirebase();
  delay(500); 
}
void enrollFingerprint() { //enroll fingerprint
  int id = 0;
  char key;
  while (true) {
    display_oled("Nhap ID   (1-127):", 15, 20);
    while (true) {
      key = keypad.getKey();
      if (key) {
        delay(200);
        if (key == '*') {
          if (id >= 1 && id <= 127) {
            break; 
          }
          display_oled("Wrong ID", 30, 25);
          id = 0;
          delay(1000);
        } else if (key >= '0' && key <= '9') {
          id = id * 10 + (key - '0');
          String id_str = String(id);
          display_oled(id_str.c_str(), 15, 20);
        }
      }
    }
    if (id >= 1 && id <= 127) {
      p = finger.loadModel(id);
      if (p == FINGERPRINT_OK) {
        display_oled("Retry ID", 20, 30);
        delay(1500);
        return;
      }else {
        break;
      } 
    }
  }
  display_oled("Finger 1", 20, 30);
  delay(2000);
  p = finger.getImage();
  while (p != FINGERPRINT_OK) {
    display_oled("Retry", 20, 30);
    delay(1000);
    p = finger.getImage();
  }
  p = finger.image2Tz(1);
  if (p == FINGERPRINT_OK) {
  } else {
  }
  display_oled("Finger 2", 20, 30);
  delay(2000);
  p = finger.getImage();
  while (p != FINGERPRINT_OK) {
    display_oled("Retry", 20, 30);
    delay(1000);
    p = finger.getImage();
  }
  p = finger.image2Tz(2);
  if (p == FINGERPRINT_OK) {
  } else {
  }
  p = finger.createModel();
  if (p == FINGERPRINT_OK) {
  } else {
    display_oled("Error", 40, 25);
    delay(1500);
    return;
  }                                                                                                                                                                               
  p = finger.storeModel(id);
  if (p == FINGERPRINT_OK) {
    display_oled("Complete", 20, 25);
    delay(1500);
  } else {
    display_oled("Error", 40, 25);
    delay(1500);
  }
  memset(message, 0, 13);
}
void login(){ //fingerprint login
  static int loginWarning = 0;
  p = finger.getImage();
  if(p == FINGERPRINT_OK){
    p = finger.image2Tz();

    if(p == FINGERPRINT_OK){
      if (finger.fingerSearch() == FINGERPRINT_OK) {
        String fingerID = String(finger.fingerID);
        digitalWrite(relayPin, HIGH);
        display_oled("Unlock", 30, 20);
        Firebase.setBool("khoa", true);
        Firebase.setString("id_mo_cua", fingerID); 
        delay(5000);
        digitalWrite(relayPin, LOW);
        display_oled("Lock", 30, 20);
        Firebase.setBool("khoa", false);
        for(int j = 0 ; j < 4; j++){
          Mc18_sensorState = digitalRead(MC18_SENSOR_PIN) == LOW ;
          if (Mc18_sensorState) {
            Firebase.setBool("cua", true);
          }else {
            Firebase.setBool("cua", false);
          }
          delay(1000);
        }
        loginWarning = 0;
        Firebase.setString("id_mo_cua", "Null"); 
        memset(message, 0, 13);
      } else {
        display_oled("Retry", 20, 30);
        loginWarning++;
        if(loginWarning >= 3){
          takeAphoto();
          loginWarning = 0;
        }
        delay(1000);
      }
    }
    Serial.println(loginWarning);
  }else {
    return;
  }
}
void Delete(){ //delete saved fingerprints
  int id = 0;
  char key;
  display_oled("Nhap ID   (1-127):", 15, 20);
  while (true) {
    key = keypad.getKey(); 
    if (key) {
      delay(200); 
      if (key == '*') { 
        if (id >= 1 && id <= 127) {
          break; 
        }
        display_oled("Wrong ID", 30, 25);
        id = 0;
        delay(1000);
        break; 
      } else if (key >= '0' && key <= '9') {
        id = id * 10 + (key - '0'); 
        String id_str = String(id);
        display_oled(id_str.c_str(), 15, 20);
      }
    }
  }
  if (id >= 1 && id <= 127) {
    p = finger.deleteModel(id);
    if (p == FINGERPRINT_OK) {
      display_oled("Complete", 20, 25);
    } else {
      display_oled("Error", 30, 25);
    }
  }
}
void display_oled(const char* n, int x = 0, int y = 0){ //display oled
  display.clearDisplay();
  display.setTextSize(2);
  display.setCursor(x,y);    
  display.println(n);
  display.display();      
}
void createFile() { //create file to save password
  File file;
  if (SD.exists("/password.txt")) { 
    Serial.printf("File da ton tai: password.txt");
  } else {
    file = SD.open("/password.txt", FILE_WRITE);
    if (!file) {
      Serial.println("Khong the tao file!");
    } else {
      file.printf("password, 000000\n");
      Serial.println("File password.txt da duoc tao");
      file.close(); 
    }
  }
}
void changePassword(const char* newPassword){ //change password
  File file = SD.open("/password.txt", FILE_WRITE);
  if(!file){
        Serial.println("Không thể mở file để ghi.");
        display_oled("Error", 20, 25);
        delay(1500);
        return;
    }
  file.printf("password,%s\n", newPassword);
  file.close();
  display_oled("Complete", 20, 25);
  delay(1500);
  Serial.println("Da thay doi password");
}
char* getPassword() { //get password from SD card
  File file = SD.open("/password.txt", FILE_READ);
  if (!file) {
    Serial.println("khong the mo file ");
    return ""; 
  }
  static char password[7] = "";  
  while (file.available()) {
    String line = file.readStringUntil('\n');  
    if (line.startsWith("password,")) {        
      int commaIndex = line.indexOf(',');    
      line.substring(commaIndex + 1).toCharArray(password, sizeof(password));  
      password[sizeof(password)-1] = '\0';  
      break; 
    }
  }
  file.close();

  return password;
}
void unlockByFirebase() {  // Turn relay on or off
  bool unlock;
  unlock = Firebase.getBool("khoa");
  if (unlock) {
    digitalWrite(relayPin, HIGH);
  } else {
    digitalWrite(relayPin, LOW);
  }
}
void takeAphoto() { // send HIGH signal
  digitalWrite(ESP32CAM_PIN, HIGH);
  delay(2500);
  digitalWrite(ESP32CAM_PIN, LOW);
}
