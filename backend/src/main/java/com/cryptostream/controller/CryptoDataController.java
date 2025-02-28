package com.cryptostream.controller;

import com.cryptostream.model.CryptoData;
import com.cryptostream.service.CryptoApiService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/crypto")
@CrossOrigin(origins = "*")
@Slf4j
public class CryptoDataController {

    private final CryptoApiService cryptoApiService;

    public CryptoDataController(CryptoApiService cryptoApiService) {
        this.cryptoApiService = cryptoApiService;
    }

    @GetMapping
    public List<CryptoData> getCryptoData() {
        log.info("REST request for crypto data");
        return cryptoApiService.fetchCryptoData();
    }
}