package com.cryptostream.consumer;

import com.cryptostream.model.CryptoData;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class CryptoDataConsumer {

    private final SimpMessagingTemplate messagingTemplate;

    public CryptoDataConsumer(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @KafkaListener(topics = "${kafka.topic.crypto}", groupId = "${spring.kafka.consumer.group-id}")
    public void consume(CryptoData cryptoData) {
        log.debug("Received crypto data: {}", cryptoData);
        
        // Forward data to WebSocket clients
        messagingTemplate.convertAndSend("/topic/crypto", cryptoData);
        
        // Also send to a specific topic for this cryptocurrency
        messagingTemplate.convertAndSend("/topic/crypto/" + cryptoData.getSymbol(), cryptoData);
        
        log.info("Forwarded crypto data for {} to websocket clients", cryptoData.getSymbol());
    }
}