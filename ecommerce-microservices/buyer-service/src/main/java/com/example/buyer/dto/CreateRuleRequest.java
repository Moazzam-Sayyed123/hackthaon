
package com.example.buyer.dto;

import java.math.BigDecimal;

public class CreateRuleRequest {
    public Long productId;
    public String productTitle;
    public BigDecimal priceMin;
    public BigDecimal priceMax;
    public Integer qty;
    public BigDecimal cap;
}
