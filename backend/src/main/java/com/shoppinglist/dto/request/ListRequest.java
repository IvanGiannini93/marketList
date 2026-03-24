package com.shoppinglist.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ListRequest {
    @NotBlank
    private String name;
}
