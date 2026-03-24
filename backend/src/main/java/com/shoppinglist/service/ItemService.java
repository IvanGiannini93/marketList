package com.shoppinglist.service;

import com.shoppinglist.dto.request.ItemRequest;
import com.shoppinglist.dto.response.ItemResponse;
import com.shoppinglist.model.ShoppingItem;
import com.shoppinglist.model.ShoppingList;
import com.shoppinglist.model.User;
import com.shoppinglist.repository.ShoppingItemRepository;
import com.shoppinglist.repository.ShoppingListRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ItemService {

    private final ShoppingItemRepository itemRepository;
    private final ShoppingListRepository listRepository;

    public ItemResponse addItem(Long listId, ItemRequest request, User user) {
        ShoppingList list = findOwnedList(listId, user);
        ShoppingItem item = new ShoppingItem();
        mapRequest(item, request);
        item.setList(list);
        return toResponse(itemRepository.save(item));
    }

    public ItemResponse updateItem(Long listId, Long itemId, ItemRequest request, User user) {
        findOwnedList(listId, user);
        ShoppingItem item = itemRepository.findByIdAndListId(itemId, listId)
                .orElseThrow(() -> new RuntimeException("Item not found"));
        mapRequest(item, request);
        return toResponse(itemRepository.save(item));
    }

    public void deleteItem(Long listId, Long itemId, User user) {
        findOwnedList(listId, user);
        ShoppingItem item = itemRepository.findByIdAndListId(itemId, listId)
                .orElseThrow(() -> new RuntimeException("Item not found"));
        itemRepository.delete(item);
    }

    public ItemResponse toggleItem(Long listId, Long itemId, User user) {
        findOwnedList(listId, user);
        ShoppingItem item = itemRepository.findByIdAndListId(itemId, listId)
                .orElseThrow(() -> new RuntimeException("Item not found"));
        item.setChecked(!item.getChecked());
        return toResponse(itemRepository.save(item));
    }

    @Transactional
    public void clearChecked(Long listId, User user) {
        findOwnedList(listId, user);
        itemRepository.deleteCheckedByListId(listId);
    }

    private ShoppingList findOwnedList(Long listId, User user) {
        return listRepository.findByIdAndUserId(listId, user.getId())
                .orElseThrow(() -> new RuntimeException("List not found"));
    }

    private void mapRequest(ShoppingItem item, ItemRequest request) {
        item.setName(request.getName());
        item.setQuantity(request.getQuantity());
        item.setUnit(request.getUnit() != null ? request.getUnit() : "unidad");
        item.setCategory(request.getCategory());
        item.setEstimatedPrice(request.getEstimatedPrice());
        item.setNotes(request.getNotes());
    }

    private ItemResponse toResponse(ShoppingItem item) {
        ItemResponse dto = new ItemResponse();
        dto.setId(item.getId());
        dto.setName(item.getName());
        dto.setQuantity(item.getQuantity());
        dto.setUnit(item.getUnit());
        dto.setCategory(item.getCategory());
        dto.setEstimatedPrice(item.getEstimatedPrice());
        dto.setNotes(item.getNotes());
        dto.setChecked(item.getChecked());
        dto.setCreatedAt(item.getCreatedAt());
        return dto;
    }
}
