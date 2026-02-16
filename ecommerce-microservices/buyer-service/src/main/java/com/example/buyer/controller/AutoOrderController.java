
package com.example.buyer.controller;

import com.example.buyer.dto.CreateRuleRequest;
import com.example.buyer.dto.TriggerResponse;
import com.example.buyer.model.AutoOrderRule;
import com.example.buyer.repo.RuleRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;

@RestController
@RequestMapping("/api")
public class AutoOrderController {
    private final RuleRepository repo;
    public AutoOrderController(RuleRepository repo) { this.repo = repo; }

    @GetMapping("/health")
    public Map<String, Object> health() {
        return Map.of("ok", true, "service", "buyer");
    }

    @GetMapping("/auto-orders")
    public List<AutoOrderRule> list() { return repo.findAll(); }

    @PostMapping("/auto-orders")
    public ResponseEntity<AutoOrderRule> create(@RequestBody CreateRuleRequest req) {
        if (req.productId == null || req.priceMin == null || req.priceMax == null || req.cap == null) {
            return ResponseEntity.badRequest().build();
        }
        AutoOrderRule r = new AutoOrderRule();
        r.setProductId(req.productId);
        r.setPriceMin(req.priceMin);
        r.setPriceMax(req.priceMax);
        r.setQty(req.qty == null ? 1 : req.qty);
        r.setCap(req.cap);
        return ResponseEntity.status(201).body(repo.save(r));
    }

    @PostMapping("/auto-orders/{id}/trigger")
    public ResponseEntity<TriggerResponse> trigger(@PathVariable Long id) {
        var ruleOpt = repo.findById(id);
        if (ruleOpt.isEmpty() || !ruleOpt.get().isActive()) return ResponseEntity.status(404).build();
        var rule = ruleOpt.get();

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
}
