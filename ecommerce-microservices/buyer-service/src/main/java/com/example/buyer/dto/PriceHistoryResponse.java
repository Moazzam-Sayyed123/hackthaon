package com.example.buyer.dto;

import java.math.BigDecimal;
import java.time.Instant;

public class PriceHistoryResponse {

    private Long id;
    private Long productId;
    private String productTitle;
    private BigDecimal previousPrice;
    private BigDecimal newPrice;
    private Instant recordedAt;

    // Required by Jackson
    public PriceHistoryResponse() {}

    // Full-args constructor
    public PriceHistoryResponse(
            Long id,
            Long productId,
            String productTitle,
            BigDecimal previousPrice,
            BigDecimal newPrice,
            Instant recordedAt
    ) {
        this.id = id;
        this.productId = productId;
        this.productTitle = productTitle;
        this.previousPrice = previousPrice;
        this.newPrice = newPrice;
        this.recordedAt = recordedAt;
    }

    // Optionally, a constructor without previous/new if you sometimes return only metadata
    public PriceHistoryResponse(
            Long id,
            Long productId,
            String productTitle,
            Instant recordedAt
    ) {
        this.id = id;
        this.productId = productId;
        this.productTitle = productTitle;
        this.recordedAt = recordedAt;
    }

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public String getProductTitle() { return productTitle; }
    public void setProductTitle(String productTitle) { this.productTitle = productTitle; }

    public BigDecimal getPreviousPrice() { return previousPrice; }
    public void setPreviousPrice(BigDecimal previousPrice) { this.previousPrice = previousPrice; }

    public BigDecimal getNewPrice() { return newPrice; }
    public void setNewPrice(BigDecimal newPrice) { this.newPrice = newPrice; }

    public Instant getRecordedAt() { return recordedAt; }
    public void setRecordedAt(Instant recordedAt) { this.recordedAt = recordedAt; }
}