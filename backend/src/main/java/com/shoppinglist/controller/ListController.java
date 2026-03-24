package com.shoppinglist.controller;

import com.shoppinglist.dto.request.ListRequest;
import com.shoppinglist.dto.response.ListDetailResponse;
import com.shoppinglist.dto.response.ListSummaryResponse;
import com.shoppinglist.model.User;
import com.shoppinglist.service.ListService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lists")
@RequiredArgsConstructor
public class ListController {

    private final ListService listService;

    @GetMapping
    public ResponseEntity<List<ListSummaryResponse>> getAll(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(listService.getAllLists(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ListDetailResponse> getOne(@PathVariable Long id,
                                                     @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(listService.getList(id, user));
    }

    @PostMapping
    public ResponseEntity<ListDetailResponse> create(@Valid @RequestBody ListRequest request,
                                                     @AuthenticationPrincipal User user) {
        return ResponseEntity.status(HttpStatus.CREATED).body(listService.createList(request, user));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ListDetailResponse> update(@PathVariable Long id,
                                                     @Valid @RequestBody ListRequest request,
                                                     @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(listService.updateList(id, request, user));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, @AuthenticationPrincipal User user) {
        listService.deleteList(id, user);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/duplicate")
    public ResponseEntity<ListDetailResponse> duplicate(@PathVariable Long id,
                                                        @AuthenticationPrincipal User user) {
        return ResponseEntity.status(HttpStatus.CREATED).body(listService.duplicateList(id, user));
    }
}
