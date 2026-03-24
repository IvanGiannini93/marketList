package com.shoppinglist.dto.response;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class ListSummaryResponse {
    private Long id;
    private String name;
    private int totalItems;
    private int checkedItems;
    private BigDecimal estimatedTotal;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
