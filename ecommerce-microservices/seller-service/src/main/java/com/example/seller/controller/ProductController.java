package com.example.seller.controller;

import com.example.seller.client.PriceHistoryClient;
import com.example.seller.model.Product;
import com.example.seller.repo.ProductRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.net.URI;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class ProductController {

    private static final Logger log = LoggerFactory.getLogger(ProductController.class);

    private final ProductRepository repo;
    private final PriceHistoryClient priceHistoryClient;

    public ProductController(ProductRepository repo, PriceHistoryClient priceHistoryClient) {
        this.repo = repo;
        this.priceHistoryClient = priceHistoryClient;
    }

    @GetMapping("/health")
    public Map<String, Object> health() {
        return Map.of("ok", true, "service", "seller");
    }

    @GetMapping("/products")
    public List<Product> list() {
        return repo.findAll();
    }

    @PostMapping("/products")
    public ResponseEntity<Map<String, Object>> create(@RequestBody Product input) {
        if (input.getTitle() == null || input.getPrice() == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "title and price are required"));
        }

        Product saved = repo.save(input);

        // Record initial price (previousPrice=null)
        try {
            priceHistoryClient.postPriceHistory(
                    saved.getId(), saved.getTitle(), null, saved.getPrice(), Instant.now()
            );
        } catch (Exception e) {
            log.error("Failed to post initial price history for productId={}", saved.getId(), e);
            // decide: continue (eventual consistency) or return 202 with warning
        }

        URI location = URI.create("/api/products/" + saved.getId());
        return ResponseEntity.created(location)
                .body(Map.of("message", "Product created", "product", saved));
    }

    @PutMapping("/products/{id}")
    public ResponseEntity<Map<String, Object>> update(@PathVariable("id") Long id, @RequestBody Product input) {
        Optional<Product> productOpt = repo.findById(id);
        if (productOpt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("error", "Product not found"));
        }

        Product product = productOpt.get();
        BigDecimal oldPrice = product.getPrice();

        if (input.getTitle() != null) product.setTitle(input.getTitle());
        if (input.getPrice() != null) product.setPrice(input.getPrice());
        if (input.getQuantity() != null) product.setQuantity(input.getQuantity());

        Product updated = repo.save(product);

        // If price changed, record history
        if (input.getPrice() != null && (oldPrice == null || input.getPrice().compareTo(oldPrice) != 0)) {
            try {
                priceHistoryClient.postPriceHistory(
                        updated.getId(), updated.getTitle(), oldPrice, updated.getPrice(), Instant.now()
                );
            } catch (Exception e) {
                log.error("Failed to post price history for productId={}", updated.getId(), e);
                // Optionally include a warning in the response
                return ResponseEntity.ok(Map.of(
                        "message", "Product updated successfully (history pending)",
                        "product", updated
                ));
            }
        }

        return ResponseEntity.ok(Map.of("message", "Product updated successfully", "product", updated));
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") Long id) {
        if (!repo.existsById(id)) {
            return ResponseEntity.status(404).build();
        }
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}