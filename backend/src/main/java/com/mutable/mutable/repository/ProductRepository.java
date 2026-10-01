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

    @Query(value = """
        SELECT * FROM product_log
        WHERE similarity(name, :productSearchTerm) > 0.3
        ORDER BY similarity(name, :productSearchTerm) DESC
        LIMIT:limit
        """, nativeQuery = true)
    List<ProductLog> findSimilarProducts(@Param("limit") int limit, @Param("productSearchTerm") String productName);
}
