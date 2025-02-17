#include <WiFiManager.h> 
#include <FirebaseESP32.h>
#include "esp_camera.h"
#include "base64.h"
#include "time.h"

#define INPUT_PIN 15

const char* FIREBASE_HOST = "your_firebase_host";
const char* FIREBASE_AUTH = "your_firebase_key";

FirebaseConfig config;
FirebaseAuth auth;
FirebaseData firebaseData;

const char* ntpServer = "time.google.com";
const long gmtOffset_sec = 7 * 3600;  
const int daylightOffset_sec = 0;     

void setupCamera() {
  camera_config_t camera_config;
  camera_config.ledc_channel = LEDC_CHANNEL_0;
  camera_config.ledc_timer = LEDC_TIMER_0;
  camera_config.pin_d0 = 5;
  camera_config.pin_d1 = 18;
  camera_config.pin_d2 = 19;
  camera_config.pin_d3 = 21;
  camera_config.pin_d4 = 36;
  camera_config.pin_d5 = 39;
  camera_config.pin_d6 = 34;
  camera_config.pin_d7 = 35;
  camera_config.pin_xclk = 0;
  camera_config.pin_pclk = 22;
  camera_config.pin_vsync = 25;
  camera_config.pin_href = 23;
  camera_config.pin_sscb_sda = 26;
  camera_config.pin_sscb_scl = 27;
  camera_config.pin_pwdn = 32;
  camera_config.pin_reset = -1;
  camera_config.xclk_freq_hz = 20000000;
  camera_config.pixel_format = PIXFORMAT_JPEG;

  // Kích thước ảnh
  camera_config.frame_size = FRAMESIZE_VGA;
  camera_config.jpeg_quality = 10;
  camera_config.fb_count = 1;

  // Khởi động camera
  esp_err_t err = esp_camera_init(&camera_config);
  if (err != ESP_OK) {
    Serial.printf("Lỗi khởi động camera: %d\n", err);
    return;
  }
}

void setup() {
  Serial.begin(115200);

  WiFiManager wifiManager;
  wifiManager.autoConnect("ESP32_AP_CAM", "12345678");
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("Connected WiFi!");
  } else {
    Serial.println("Failed WiFi");
  }

  config.host = FIREBASE_HOST;
  config.signer.tokens.legacy_token = FIREBASE_AUTH;
  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);


  configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);
  delay(1000);

  setupCamera();
  pinMode(4, OUTPUT);
  pinMode(INPUT_PIN, INPUT_PULLDOWN);
}

void loop() {
  int state = digitalRead(INPUT_PIN);
  // Chụp ảnh
  if(state == HIGH){
    camera_fb_t* fb = NULL;
    fb = esp_camera_fb_get();
    esp_camera_fb_return(fb);
    fb = NULL;
    digitalWrite(4, HIGH);
    delay(10);
    fb = esp_camera_fb_get();
    if (!fb) {
      Serial.println("Không chụp được ảnh!");
      return;
    }
    delay(10);
    digitalWrite(4, LOW);

    String base64Image = base64::encode(fb->buf, fb->len);
    Firebase.setBool(firebaseData,"/canh_bao", true);

    struct tm timeinfo;
    if (getLocalTime(&timeinfo)) {
      char timeStr[30];
      strftime(timeStr, sizeof(timeStr), "%H:%M_%d-%m-%Y", &timeinfo);
      String data = base64Image;
      String path = "/failedAttempts/" + String(timeStr);
      if (Firebase.setString(firebaseData, path.c_str(), data)) {
        Serial.println("Gửi ảnh lên Firebase thành công!");
      } else {
        Serial.println("Lỗi khi gửi ảnh lên Firebase.");
      }
      delay(5000);
    } else {
      Serial.println("Không lấy được thời gian");
      delay(10);
    }
    Firebase.setBool(firebaseData,"/canh_bao", false);
   
    esp_camera_fb_return(fb);
    fb = NULL;
    delay(100);
    
    while(state == HIGH){
      state = digitalRead(INPUT_PIN);
      delay(100);
    }
  }
  delay(1000);
}
