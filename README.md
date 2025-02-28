# Financial Assistant Application

## Project Structure
```bash
financial-assistant/
├── backend/
│   ├── pom.xml
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       │   └── com/
│   │       │       └── cryptostream/
│   │       │           ├── CryptoStreamApplication.java
│   │       │           ├── config/
│   │       │           │   ├── KafkaConfig.java
│   │       │           │   └── WebSocketConfig.java
│   │       │           ├── controller/
│   │       │           │   └── CryptoDataController.java
│   │       │           ├── model/
│   │       │           │   └── CryptoData.java
│   │       │           ├── producer/
│   │       │           │   └── CryptoDataProducer.java
│   │       │           ├── consumer/
│   │       │           │   └── CryptoDataConsumer.java
│   │       │           └── service/
│   │       │               └── CryptoApiService.java
│   │       └── resources/
│   │           └── application.properties
└── frontend/
    ├── package.json
    ├── public/
    │   └── index.html
    └── src/
        ├── App.js
        ├── index.js
        ├── components/
        │   ├── CryptoChart.js
        │   ├── CryptoTable.js
        │   └── Dashboard.js
        └── services/
            └── WebSocketService.js
```