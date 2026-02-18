
package com.example.buyer.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "auto_order_rules")
public class AutoOrderRule {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long productId;

    @Column(nullable = false)
    private String productTitle = "";

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal priceMin;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal priceMax;

    @Column(nullable = false)
    private Integer qty = 1;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal cap;

    @Column(nullable = false)
    private String status = "active";

    @Column(nullable = false)
    private Instant createdAt = Instant.now();

    public AutoOrderRule() {}

    public Long getId() { return id; }
    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }
    public String getProductTitle() { return productTitle; }
    public void setProductTitle(String productTitle) { this.productTitle = productTitle; }
    public BigDecimal getPriceMin() { return priceMin; }
    public void setPriceMin(BigDecimal priceMin) { this.priceMin = priceMin; }
    public BigDecimal getPriceMax() { return priceMax; }
    public void setPriceMax(BigDecimal priceMax) { this.priceMax = priceMax; }
    public Integer getQty() { return qty; }
    public void setQty(Integer qty) { this.qty = qty; }
    public BigDecimal getCap() { return cap; }
    public void setCap(BigDecimal cap) { this.cap = cap; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public boolean isActive() { return "active".equals(status); }
    public void setActive(boolean active) { this.status = active ? "active" : "inactive"; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
