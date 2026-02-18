
package com.example.seller;

import com.example.seller.model.Product;
import com.example.seller.repo.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.math.BigDecimal;

@SpringBootApplication
public class SellerServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(SellerServiceApplication.class, args);
    }

    @Bean
    CommandLineRunner seed(ProductRepository repo) {
        return args -> {
            if (repo.findAll().isEmpty()) {
                repo.save(new Product("Wireless Mouse", new BigDecimal("799.00")));
                repo.save(new Product("Mechanical Keyboard", new BigDecimal("2999.00")));
            }
        };
    }
}
