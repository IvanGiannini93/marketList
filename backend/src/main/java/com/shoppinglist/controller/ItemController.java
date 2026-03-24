package com.shoppinglist.controller;

import com.shoppinglist.dto.request.ItemRequest;
import com.shoppinglist.dto.response.ItemResponse;
import com.shoppinglist.model.User;
import com.shoppinglist.service.ItemService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/lists/{listId}/items")
@RequiredArgsConstructor
public class ItemController {

    private final ItemService itemService;

    @PostMapping
    public ResponseEntity<ItemResponse> add(@PathVariable Long listId,
                                            @Valid @RequestBody ItemRequest request,
                                            @AuthenticationPrincipal User user) {
        return ResponseEntity.status(HttpStatus.CREATED).body(itemService.addItem(listId, request, user));
    }

    @PutMapping("/{itemId}")
    public ResponseEntity<ItemResponse> update(@PathVariable Long listId,
                                               @PathVariable Long itemId,
                                               @Valid @RequestBody ItemRequest request,
                                               @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(itemService.updateItem(listId, itemId, request, user));
    }

    @DeleteMapping("/{itemId}")
    public ResponseEntity<Void> delete(@PathVariable Long listId,
                                       @PathVariable Long itemId,
                                       @AuthenticationPrincipal User user) {
        itemService.deleteItem(listId, itemId, user);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{itemId}/toggle")
    public ResponseEntity<ItemResponse> toggle(@PathVariable Long listId,
                                               @PathVariable Long itemId,
                                               @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(itemService.toggleItem(listId, itemId, user));
    }

    @DeleteMapping("/checked")
    public ResponseEntity<Void> clearChecked(@PathVariable Long listId,
                                             @AuthenticationPrincipal User user) {
        itemService.clearChecked(listId, user);
        return ResponseEntity.noContent().build();
    }
}
