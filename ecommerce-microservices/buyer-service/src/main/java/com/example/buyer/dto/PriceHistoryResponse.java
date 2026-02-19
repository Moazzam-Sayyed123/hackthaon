package com.example.buyer.dto;

import java.math.BigDecimal;
import java.time.Instant;

public class PriceHistoryResponse {

    private Long id;
    private Long productId;
    private String productTitle;
    private BigDecimal oldPrice;
    private BigDecimal newPrice;
    private Instant lastUpdateDateTime;

    // Required by Jackson
        public PriceHistoryResponse() {}

    // Full-args constructor
        public PriceHistoryResponse(
                Long id,
                Long productId,
                String productTitle,
                BigDecimal oldPrice,
                BigDecimal newPrice,
                Instant lastUpdateDateTime
        ) {
            this.id = id;
            this.productId = productId;
            this.productTitle = productTitle;
            this.oldPrice = oldPrice;
            this.newPrice = newPrice;
            this.lastUpdateDateTime = lastUpdateDateTime;
        }

    // (no-arg and full-arg constructors provided)

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public String getProductTitle() { return productTitle; }
    public void setProductTitle(String productTitle) { this.productTitle = productTitle; }

        public BigDecimal getOldPrice() { return oldPrice; }
        public void setOldPrice(BigDecimal oldPrice) { this.oldPrice = oldPrice; }

    public BigDecimal getNewPrice() { return newPrice; }
    public void setNewPrice(BigDecimal newPrice) { this.newPrice = newPrice; }

        public Instant getLastUpdateDateTime() { return lastUpdateDateTime; }
        public void setLastUpdateDateTime(Instant lastUpdateDateTime) { this.lastUpdateDateTime = lastUpdateDateTime; }
}