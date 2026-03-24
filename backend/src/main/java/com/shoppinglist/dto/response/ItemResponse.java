package com.shoppinglist.dto.response;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class ItemResponse {
    private Long id;
    private String name;
    private BigDecimal quantity;
    private String unit;
    private String category;
    private BigDecimal estimatedPrice;
    private String notes;
    private Boolean checked;
    private LocalDateTime createdAt;
}
