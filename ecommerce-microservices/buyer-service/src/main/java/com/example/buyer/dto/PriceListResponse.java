package com.example.buyer.dto;

import java.math.BigDecimal;
import java.util.List;

public class PriceListResponse {
    public Long productId;
    public String productTitle;
    public List<BigDecimal> prices;

    public PriceListResponse(Long productId, String productTitle, List<BigDecimal> prices) {
        this.productId = productId;
        this.productTitle = productTitle;
        this.prices = prices;
    }
}
