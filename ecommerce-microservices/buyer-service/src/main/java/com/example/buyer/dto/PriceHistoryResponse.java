
package com.example.buyer.dto;

import java.math.BigDecimal;
import java.time.Instant;

public class PriceHistoryResponse {
    public Long id;
    public Long productId;
    public String productTitle;
    public BigDecimal price;
    public Instant recordedAt;

    public PriceHistoryResponse(Long id, Long productId, String productTitle, BigDecimal price, Instant recordedAt) {
        this.id = id;
        this.productId = productId;
        this.productTitle = productTitle;
        this.price = price;
        this.recordedAt = recordedAt;
    }
}
