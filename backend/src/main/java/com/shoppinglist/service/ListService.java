package com.shoppinglist.service;

import com.shoppinglist.dto.request.ListRequest;
import com.shoppinglist.dto.response.ItemResponse;
import com.shoppinglist.dto.response.ListDetailResponse;
import com.shoppinglist.dto.response.ListSummaryResponse;
import com.shoppinglist.model.ShoppingItem;
import com.shoppinglist.model.ShoppingList;
import com.shoppinglist.model.User;
import com.shoppinglist.repository.ShoppingListRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ListService {

    private final ShoppingListRepository listRepository;

    public List<ListSummaryResponse> getAllLists(User user) {
        return listRepository.findByUserIdOrderByUpdatedAtDesc(user.getId())
                .stream()
                .map(this::toSummary)
                .toList();
    }

    public ListDetailResponse getList(Long id, User user) {
        ShoppingList list = findOwned(id, user);
        return toDetail(list);
    }

    public ListDetailResponse createList(ListRequest request, User user) {
        ShoppingList list = new ShoppingList();
        list.setName(request.getName());
        list.setUser(user);
        return toDetail(listRepository.save(list));
    }

    public ListDetailResponse updateList(Long id, ListRequest request, User user) {
        ShoppingList list = findOwned(id, user);
        list.setName(request.getName());
        return toDetail(listRepository.save(list));
    }

    public void deleteList(Long id, User user) {
        ShoppingList list = findOwned(id, user);
        listRepository.delete(list);
    }

    @Transactional
    public ListDetailResponse duplicateList(Long id, User user) {
        ShoppingList original = findOwned(id, user);
        ShoppingList copy = new ShoppingList();
        copy.setName(original.getName() + " (copia)");
        copy.setUser(user);

        for (ShoppingItem item : original.getItems()) {
            ShoppingItem newItem = new ShoppingItem();
            newItem.setName(item.getName());
            newItem.setQuantity(item.getQuantity());
            newItem.setUnit(item.getUnit());
            newItem.setCategory(item.getCategory());
            newItem.setEstimatedPrice(item.getEstimatedPrice());
            newItem.setNotes(item.getNotes());
            newItem.setChecked(false);
            newItem.setList(copy);
            copy.getItems().add(newItem);
        }

        return toDetail(listRepository.save(copy));
    }

    private ShoppingList findOwned(Long id, User user) {
        return listRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new RuntimeException("List not found"));
    }

    private ListSummaryResponse toSummary(ShoppingList list) {
        ListSummaryResponse dto = new ListSummaryResponse();
        dto.setId(list.getId());
        dto.setName(list.getName());
        dto.setTotalItems(list.getItems().size());
        dto.setCheckedItems((int) list.getItems().stream().filter(ShoppingItem::getChecked).count());
        dto.setEstimatedTotal(
                list.getItems().stream()
                        .filter(i -> i.getEstimatedPrice() != null)
                        .map(i -> i.getEstimatedPrice().multiply(i.getQuantity()))
                        .reduce(BigDecimal.ZERO, BigDecimal::add)
        );
        dto.setCreatedAt(list.getCreatedAt());
        dto.setUpdatedAt(list.getUpdatedAt());
        return dto;
    }

    private ListDetailResponse toDetail(ShoppingList list) {
        ListDetailResponse dto = new ListDetailResponse();
        dto.setId(list.getId());
        dto.setName(list.getName());
        dto.setItems(list.getItems().stream().map(this::toItemResponse).toList());
        dto.setCreatedAt(list.getCreatedAt());
        dto.setUpdatedAt(list.getUpdatedAt());
        return dto;
    }

    private ItemResponse toItemResponse(ShoppingItem item) {
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
