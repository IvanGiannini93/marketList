package com.shoppinglist.repository;

import com.shoppinglist.model.ShoppingList;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ShoppingListRepository extends JpaRepository<ShoppingList, Long> {
    List<ShoppingList> findByUserIdOrderByUpdatedAtDesc(Long userId);
    Optional<ShoppingList> findByIdAndUserId(Long id, Long userId);
}
