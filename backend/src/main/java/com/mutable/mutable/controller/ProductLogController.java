package com.mutable.mutable.controller;

import com.mutable.mutable.model.ProductLog;
import com.mutable.mutable.service.AnthropicAIService;
import com.mutable.mutable.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/product")
public class ProductLogController {
    @Autowired
    private ProductService productService;
    @Autowired
    private AnthropicAIService anthropicAIService;


    @GetMapping("/search")
    public ResponseEntity<List<ProductLog>> productSearch(@RequestParam String productName) {
        List<ProductLog> productList = productService.findSimilarProducts(productName);

        if(productList.isEmpty()){
            ProductLog productLog = anthropicAIService.claudeRequest(productName);
            productService.addProduct(productLog);
            return ResponseEntity.ok(List.of());
        }
        else{
            return ResponseEntity.ok().body(productList);
        }
    }
}
