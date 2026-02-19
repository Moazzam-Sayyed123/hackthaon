package com.example.seller.controller;

import com.example.seller.model.Product;
import com.example.seller.repo.ProductRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.math.BigDecimal;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class ProductController {

    private final ProductRepository repo;

    public ProductController(ProductRepository repo) {
        this.repo = repo;
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
    public ResponseEntity<Product> create(@RequestBody Product input) {
        if (input.getTitle() == null || input.getPrice() == null) {
            return ResponseEntity.badRequest().build();
        }
        Product saved = repo.save(input);
        // Record initial price in buyer service price history (previousPrice = null)
        try {
            postPriceHistory(saved.getId(), saved.getTitle(), null, saved.getPrice());
        } catch (Exception e) {
            System.err.println("Failed to post price history: " + e.getMessage());
        }
        return ResponseEntity.status(201).body(saved);
    }

    @PutMapping("/products/{id}")
    public ResponseEntity<Product> update(@PathVariable("id") Long id, @RequestBody Product input) {
        Optional<Product> productOpt = repo.findById(id);
        if (productOpt.isEmpty()) {
            return ResponseEntity.status(404).build();
        }
        Product product = productOpt.get();
        BigDecimal oldPrice = product.getPrice();
        if (input.getTitle() != null) product.setTitle(input.getTitle());
        if (input.getPrice() != null) product.setPrice(input.getPrice());
        if (input.getQuantity() != null) product.setQuantity(input.getQuantity());
        Product updated = repo.save(product);
        // If price changed, record history and return success message
        try {
            if (input.getPrice() != null && (oldPrice == null || input.getPrice().compareTo(oldPrice) != 0)) {
                postPriceHistory(updated.getId(), updated.getTitle(), oldPrice, updated.getPrice());
            }
        } catch (Exception e) {
            System.err.println("Failed to post price history: " + e.getMessage());
        }
        return ResponseEntity.ok(updated);
    }

    private void postPriceHistory(Long productId, String title, BigDecimal previousPrice, BigDecimal newPrice) throws IOException, InterruptedException {
        try {
            String prev = (previousPrice == null) ? "null" : previousPrice.toPlainString();
            String json = String.format("{\"productId\":%d,\"productTitle\":\"%s\",\"previousPrice\":%s,\"newPrice\":%s}", productId, title.replace("\"","\\\""), prev, newPrice.toPlainString());
            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("http://localhost:4002/api/price-history"))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(json))
                    .build();
            client.send(request, HttpResponse.BodyHandlers.discarding());
        } catch (Exception ex) {
            throw ex;
        }
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