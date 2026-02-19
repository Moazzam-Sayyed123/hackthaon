
package com.example.buyer.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "price_history")
public class PriceHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long productId;

    @Column
    private String productTitle;

    @Column(name = "old_price", precision = 12, scale = 2)
    private BigDecimal oldPrice;

    @Column(name = "new_price", precision = 12, scale = 2)
    private BigDecimal newPrice;

    @Column(name = "last_update_date_time", nullable = false)
    private Instant lastUpdateDateTime = Instant.now();

    public PriceHistory() {}

    public PriceHistory(Long productId, String productTitle, BigDecimal oldPrice, BigDecimal newPrice) {
        this.productId = productId;
        this.productTitle = productTitle;
        this.oldPrice = oldPrice;
        this.newPrice = newPrice;
    }

    public Long getId() { return id; }
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
