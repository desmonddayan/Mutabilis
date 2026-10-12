package com.mutable.mutable.service;

import com.mutable.mutable.model.ProductLog;
import com.mutable.mutable.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public List<ProductLog> findSimilarProducts(String productName) {
        return productRepository.findSimilarProducts(productName);
    }
    public ProductLog addProduct(ProductLog productLog) {
        return productRepository.save(productLog);
    }
}
