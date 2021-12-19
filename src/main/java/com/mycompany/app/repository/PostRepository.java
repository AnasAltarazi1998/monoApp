package com.mycompany.app.repository;

import com.mycompany.app.domain.Post;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Post entity.
 */
@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    @Query("select post from Post post where post.owner.login = ?#{principal.username}")
    List<Post> findByOwnerIsCurrentUser();

    @Query(
        value = "select distinct post from Post post left join fetch post.comments left join fetch post.reactions",
        countQuery = "select count(distinct post) from Post post"
    )
    Page<Post> findAllWithEagerRelationships(Pageable pageable);

    @Query("select distinct post from Post post left join fetch post.comments left join fetch post.reactions")
    List<Post> findAllWithEagerRelationships();

    @Query("select post from Post post left join fetch post.comments left join fetch post.reactions where post.id =:id")
    Optional<Post> findOneWithEagerRelationships(@Param("id") Long id);
}
