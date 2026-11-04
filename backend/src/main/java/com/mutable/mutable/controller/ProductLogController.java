package com.mutable.mutable.controller;

import com.mutable.mutable.RateLimiter;
import com.mutable.mutable.model.ProductLog;
import com.mutable.mutable.repository.ProductRepository;
import com.mutable.mutable.service.AnthropicAIService;
import com.mutable.mutable.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.List;

@RestController
@RequestMapping("/api/v1/products")
public class ProductLogController {
    @Autowired
    private ProductService productService;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private AnthropicAIService anthropicAIService;
    @Autowired
    private RateLimiter rateLimiter;


    @GetMapping("/search")
    public ResponseEntity<List<ProductLog>> productSearch(@RequestParam String productName, @AuthenticationPrincipal Jwt jwt) {
        List<ProductLog> productList = productService.findSimilarProducts(productName);
        String userId = jwt.getSubject();
        if (!rateLimiter.tryConsume("chat:" + userId, 10, Duration.ofHours(1))) {
            return ResponseEntity.status(429).body(List.of());
        }
        if(productList.isEmpty()){
            ProductLog productLog = anthropicAIService.claudeRequest(productName);
            return ResponseEntity.ok(List.of(productLog));
        }
        else{
            return ResponseEntity.ok().body(productList);
        }
    }

    @PostMapping("/add")
    public ResponseEntity<List<ProductLog>> addProduct(@RequestBody ProductLog productLog) {

        if(productLog.getId() == null){
            ProductLog saved = productService.addProduct(productLog);
            return ResponseEntity.ok(List.of(saved));
        }
        else{
            return ResponseEntity.ok(List.of());
        }
    }
}
