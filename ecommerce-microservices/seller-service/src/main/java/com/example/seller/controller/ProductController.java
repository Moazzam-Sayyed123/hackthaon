
package com.example.seller.controller;

import com.example.seller.model.Product;
import com.example.seller.repo.ProductRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ProductController {
    private final ProductRepository repo;
    public ProductController(ProductRepository repo) { this.repo = repo; }

    @GetMapping("/health")
    public Map<String, Object> health() {
        return Map.of("ok", true, "service", "seller");
    }

    @GetMapping("/products")
    public List<Product> list() { return repo.findAll(); }

    @PostMapping("/products")
    public ResponseEntity<Product> create(@RequestBody Product input) {
        if (input.getSku() == null || input.getTitle() == null || input.getPrice() == null) {
            return ResponseEntity.badRequest().build();
        }
        Product saved = repo.save(input);
        return ResponseEntity.status(201).body(saved);
    }
}
