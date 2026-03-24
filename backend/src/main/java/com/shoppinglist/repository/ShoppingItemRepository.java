package com.shoppinglist.repository;

import com.shoppinglist.model.ShoppingItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ShoppingItemRepository extends JpaRepository<ShoppingItem, Long> {
    Optional<ShoppingItem> findByIdAndListId(Long id, Long listId);

    @Modifying
    @Query("DELETE FROM ShoppingItem i WHERE i.list.id = :listId AND i.checked = true")
    void deleteCheckedByListId(Long listId);
}
