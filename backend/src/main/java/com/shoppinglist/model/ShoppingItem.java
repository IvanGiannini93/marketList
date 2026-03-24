package com.shoppinglist.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "shopping_items")
@Data
@NoArgsConstructor
public class ShoppingItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "list_id", nullable = false)
    private ShoppingList list;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private BigDecimal quantity = BigDecimal.ONE;

    @Column(length = 50)
    private String unit = "unidad";

    @Column(length = 100)
    private String category;

    @Column(name = "estimated_price", precision = 10, scale = 2)
    private BigDecimal estimatedPrice;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(nullable = false)
    private Boolean checked = false;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}
