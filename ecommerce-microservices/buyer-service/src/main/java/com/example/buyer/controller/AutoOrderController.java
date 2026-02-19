
package com.example.buyer.controller;

import com.example.buyer.dto.CreateRuleRequest;
import com.example.buyer.dto.TriggerResponse;
import com.example.buyer.dto.WalletResponse;
import com.example.buyer.dto.PriceHistoryResponse;
import com.example.buyer.dto.PriceListResponse;
import com.example.buyer.model.AutoOrderRule;
import com.example.buyer.model.UserWallet;
import com.example.buyer.model.PriceHistory;
import com.example.buyer.repo.RuleRepository;
import com.example.buyer.repo.UserWalletRepository;
import com.example.buyer.repo.PriceHistoryRepository;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.util.*;

@RestController
@RequestMapping("/api")
public class AutoOrderController {
    private final RuleRepository repo;
    private final UserWalletRepository walletRepo;
    private final PriceHistoryRepository priceHistoryRepo;
    
    public AutoOrderController(RuleRepository repo, UserWalletRepository walletRepo, PriceHistoryRepository priceHistoryRepo) { 
        this.repo = repo;
        this.walletRepo = walletRepo;
        this.priceHistoryRepo = priceHistoryRepo;
    }

    @GetMapping("/health")
    public Map<String, Object> health() {
        return Map.of("ok", true, "service", "buyer");
    }

    @GetMapping("/auto-orders")
    public List<AutoOrderRule> list() { 
        return repo.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
    }

    @PostMapping("/auto-orders")
    public ResponseEntity<AutoOrderRule> create(@RequestBody CreateRuleRequest req) {
        if (req.productId == null || req.priceMin == null || req.priceMax == null || req.cap == null) {
            return ResponseEntity.badRequest().build();
        }
        AutoOrderRule r = new AutoOrderRule();
        r.setProductId(req.productId);
        r.setProductTitle(req.productTitle != null ? req.productTitle : "");
        r.setPriceMin(req.priceMin);
        r.setPriceMax(req.priceMax);
        r.setQty(req.qty == null ? 1 : req.qty);
        r.setCap(req.cap);
        r.setStatus("active");
        return ResponseEntity.status(201).body(repo.save(r));
    }

    @PostMapping("/auto-orders/{id}/trigger")
    public ResponseEntity<TriggerResponse> trigger(@PathVariable("id") Long id) {
        Optional<AutoOrderRule> ruleOpt = repo.findById(id);
        if (ruleOpt.isEmpty() || !ruleOpt.get().isActive()) return ResponseEntity.status(404).build();
        AutoOrderRule rule = ruleOpt.get();

        BigDecimal min = rule.getPriceMin();
        BigDecimal max = rule.getPriceMax();
        BigDecimal rnd = min.add(new BigDecimal(Math.random()).multiply(max.subtract(min)))
                            .setScale(2, RoundingMode.HALF_UP);
        BigDecimal total = rnd.multiply(BigDecimal.valueOf(rule.getQty())).setScale(2, RoundingMode.HALF_UP);

        TriggerResponse resp = new TriggerResponse();
        if (total.compareTo(rule.getCap()) > 0) {
            resp.status = "blocked";
            resp.reason = "Total exceeds cap";
            resp.unitPrice = rnd;
            resp.total = total;
            return ResponseEntity.status(409).body(resp);
        }

        resp.status = "ordered";
        resp.orderId = UUID.randomUUID().toString();
        resp.productId = rule.getProductId();
        resp.qty = rule.getQty();
        resp.unitPrice = rnd;
        resp.total = total;
        return ResponseEntity.ok(resp);
    }

    @DeleteMapping("/auto-orders/{id}")
    public ResponseEntity<Void> deleteRule(@PathVariable("id") Long id) {
        if (!repo.existsById(id)) {
            return ResponseEntity.status(404).build();
        }
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // Wallet endpoints
    @GetMapping("/wallet/{userId}")
    public ResponseEntity<WalletResponse> getWallet(@PathVariable("userId") String userId) {
        Optional<UserWallet> walletOpt = walletRepo.findByUserId(userId);
        if (walletOpt.isEmpty()) {
            // Create default wallet if not exists
            UserWallet newWallet = new UserWallet(userId, userId);
            UserWallet saved = walletRepo.save(newWallet);
            return ResponseEntity.ok(new WalletResponse(saved.getId(), saved.getUserId(), saved.getUserEmail(), saved.getWalletBalance()));
        }
        UserWallet wallet = walletOpt.get();
        return ResponseEntity.ok(new WalletResponse(wallet.getId(), wallet.getUserId(), wallet.getUserEmail(), wallet.getWalletBalance()));
    }

    @PostMapping("/wallet/{userId}/add")
    public ResponseEntity<WalletResponse> addWalletBalance(@PathVariable("userId") String userId, @RequestBody Map<String, Object> body) {
        try {
            Number amtNum = (Number) body.get("amount");
            // payment mode is accepted but not required for now
            Object mode = body.get("mode");
            if (amtNum == null) return ResponseEntity.badRequest().build();
            java.math.BigDecimal amt = new java.math.BigDecimal(amtNum.toString());
            Optional<UserWallet> walletOpt = walletRepo.findByUserId(userId);
            UserWallet wallet;
            if (walletOpt.isEmpty()) {
                wallet = new UserWallet(userId, userId);
                wallet.setWalletBalance(amt);
            } else {
                wallet = walletOpt.get();
                wallet.setWalletBalance(wallet.getWalletBalance().add(amt));
                wallet.setUpdatedAt(Instant.now());
            }
            UserWallet saved = walletRepo.save(wallet);
            return ResponseEntity.ok(new WalletResponse(saved.getId(), saved.getUserId(), saved.getUserEmail(), saved.getWalletBalance()));
        } catch (Exception ex) {
            return ResponseEntity.status(500).build();
        }
    }

    // Price History endpoints
    @GetMapping("/price-history/product/{productId}")
    public ResponseEntity<List<PriceHistoryResponse>> getPriceHistory(@PathVariable("productId") Long productId) {
        List<PriceHistory> history = priceHistoryRepo.findByProductId(productId, Sort.by(Sort.Direction.DESC, "lastUpdateDateTime"));
        List<PriceHistoryResponse> response = new ArrayList<>();
        for (PriceHistory ph : history) {
            response.add(new PriceHistoryResponse(ph.getId(), ph.getProductId(), ph.getProductTitle(), ph.getOldPrice(), ph.getNewPrice(), ph.getLastUpdateDateTime()));
        }
        return ResponseEntity.ok(response);
    }

    @PostMapping("/price-history")
    public ResponseEntity<PriceHistoryResponse> recordPrice(@RequestBody PriceHistory priceHistory) {
        PriceHistory saved = priceHistoryRepo.save(priceHistory);
        return ResponseEntity.status(201).body(new PriceHistoryResponse(saved.getId(), saved.getProductId(), saved.getProductTitle(), saved.getOldPrice(), saved.getNewPrice(), saved.getLastUpdateDateTime()));
    }

    @GetMapping("/getPriceHistory/{productId}")
    public ResponseEntity<PriceListResponse> getPriceList(@PathVariable("productId") Long productId) {
        List<PriceHistory> history = priceHistoryRepo.findByProductId(productId, Sort.by(Sort.Direction.DESC, "lastUpdateDateTime"));
        List<BigDecimal> prices = new ArrayList<>();
        String productTitle = "";
        for (PriceHistory ph : history) {
            prices.add(ph.getNewPrice());
            if (productTitle.isEmpty() && ph.getProductTitle() != null) {
                productTitle = ph.getProductTitle();
            }
        }
        return ResponseEntity.ok(new PriceListResponse(productId, productTitle, prices));
    }
}

