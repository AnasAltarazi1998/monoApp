package com.mycompany.app.service.mapper;

import com.mycompany.app.domain.Post;
import com.mycompany.app.service.dto.PostDTO;
import java.util.Set;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Post} and its DTO {@link PostDTO}.
 */
@Mapper(componentModel = "spring", uses = { UserMapper.class, CommentMapper.class })
public interface PostMapper extends EntityMapper<PostDTO, Post> {
    @Mapping(target = "owner", source = "owner", qualifiedByName = "login")
    @Mapping(target = "comments", source = "comments", qualifiedByName = "titleSet")
    @Mapping(target = "reactions", source = "reactions", qualifiedByName = "loginSet")
    PostDTO toDto(Post s);

    @Mapping(target = "removeComments", ignore = true)
    @Mapping(target = "removeReaction", ignore = true)
    Post toEntity(PostDTO postDTO);
}
