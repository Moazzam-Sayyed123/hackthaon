
package com.example.buyer.dto;

import java.math.BigDecimal;
import java.time.Instant;

public class PriceHistoryResponse {
    public Long id;
    public Long productId;
    public String productTitle;
    public Instant recordedAt;

    public PriceHistoryResponse(Long id, Long productId, String productTitle, BigDecimal price, Instant recordedAt) {
        this.id = id;
        this.productId = productId;
        this.productTitle = productTitle;
        this.recordedAt = recordedAt;
    }
        public BigDecimal previousPrice;
        public BigDecimal newPrice;
}
        public PriceHistoryResponse() {}

        public PriceHistoryResponse(Long id, Long productId, String productTitle, BigDecimal previousPrice, BigDecimal newPrice, Instant recordedAt) {
            this.id = id;
            this.productId = productId;
            this.productTitle = productTitle;
            this.previousPrice = previousPrice;
            this.newPrice = newPrice;
            this.recordedAt = recordedAt;
        }
