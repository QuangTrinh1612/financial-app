package com.cryptostream.producer;

import com.cryptostream.model.CryptoData;
import com.cryptostream.service.CryptoApiService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Slf4j
public class CryptoDataProducer {

    private final CryptoApiService cryptoApiService;
    private final KafkaTemplate<String, CryptoData> kafkaTemplate;
    
    @Value("${kafka.topic.crypto}")
    private String topicName;

    public CryptoDataProducer(CryptoApiService cryptoApiService, 
                             KafkaTemplate<String, CryptoData> kafkaTemplate) {
        this.cryptoApiService = cryptoApiService;
        this.kafkaTemplate = kafkaTemplate;
    }

    @Scheduled(fixedDelayString = "${crypto.api.polling.interval}")
    public void fetchAndPublishCryptoData() {
        log.info("Fetching and publishing crypto data");
        
        List<CryptoData> cryptoDataList = cryptoApiService.fetchCryptoData();
        
        for (CryptoData data : cryptoDataList) {
            log.debug("Publishing crypto data: {}", data);
            kafkaTemplate.send(topicName, data.getSymbol(), data);
        }
        
        log.info("Published {} crypto data entries", cryptoDataList.size());
    }
}