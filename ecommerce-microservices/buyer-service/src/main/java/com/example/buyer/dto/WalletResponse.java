
package com.example.buyer.dto;

import java.math.BigDecimal;

public class WalletResponse {
    public Long id;
    public String userId;
    public String userEmail;
    public BigDecimal walletBalance;

    public WalletResponse(Long id, String userId, String userEmail, BigDecimal walletBalance) {
        this.id = id;
        this.userId = userId;
        this.userEmail = userEmail;
        this.walletBalance = walletBalance;
    }
}
