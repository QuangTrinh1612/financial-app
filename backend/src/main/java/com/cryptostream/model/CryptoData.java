package com.cryptostream.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CryptoData {
    private String id;
    private String symbol;
    private String name;
    
    @JsonProperty("priceUsd")
    private BigDecimal price;
    
    @JsonProperty("changePercent24Hr")
    private BigDecimal changePercent24h;
    
    private BigDecimal marketCapUsd;
    private BigDecimal volumeUsd24Hr;
    private Instant timestamp;
}