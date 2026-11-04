package com.mutable.mutable.repository;

import com.mutable.mutable.model.ProductLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProductRepository extends JpaRepository<ProductLog, UUID> {

    ProductLog findByProductName(String productName);

    @Query(value = """
        SELECT * FROM product_log
        WHERE similarity(product_name, :productSearchTerm) > 0.3
        ORDER BY similarity(product_name, :productSearchTerm) DESC
        LIMIT 3
        """, nativeQuery = true)
    List<ProductLog> findSimilarProducts(@Param("productSearchTerm") String productName);
}
