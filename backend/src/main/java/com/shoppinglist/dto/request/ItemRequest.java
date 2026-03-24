package com.shoppinglist.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ItemRequest {
    @NotBlank
    private String name;

    @NotNull
    @Positive
    private BigDecimal quantity;

    private String unit = "unidad";

    private String category;

    private BigDecimal estimatedPrice;

    private String notes;
}
