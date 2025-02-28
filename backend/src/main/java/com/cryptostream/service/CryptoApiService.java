package com.cryptostream.service;

import com.cryptostream.model.CryptoData;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
public class CryptoApiService {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${crypto.api.url}")
    private String apiUrl;

    public CryptoApiService() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    public List<CryptoData> fetchCryptoData() {
        log.info("Fetching crypto data from API: {}", apiUrl);
        
        try {
            String response = restTemplate.getForObject(apiUrl, String.class);
            List<CryptoData> cryptoDataList = new ArrayList<>();
            
            JsonNode rootNode = objectMapper.readTree(response);
            JsonNode dataNode = rootNode.get("data");
            
            if (dataNode.isArray()) {
                Instant now = Instant.now();
                
                for (JsonNode node : dataNode) {
                    CryptoData cryptoData = objectMapper.treeToValue(node, CryptoData.class);
                    cryptoData.setTimestamp(now);
                    cryptoDataList.add(cryptoData);
                }
            }
            
            log.info("Fetched {} crypto coins data", cryptoDataList.size());
            return cryptoDataList;
        } catch (Exception e) {
            log.error("Error fetching crypto data: {}", e.getMessage(), e);
            return new ArrayList<>();
        }
    }
}