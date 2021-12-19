package com.mycompany.app.service.mapper;

import com.mycompany.app.domain.Comment;
import com.mycompany.app.service.dto.CommentDTO;
import java.util.Set;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Comment} and its DTO {@link CommentDTO}.
 */
@Mapper(componentModel = "spring", uses = { UserMapper.class })
public interface CommentMapper extends EntityMapper<CommentDTO, Comment> {
    @Mapping(target = "user", source = "user", qualifiedByName = "login")
    CommentDTO toDto(Comment s);

    @Named("titleSet")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "title", source = "title")
    Set<CommentDTO> toDtoTitleSet(Set<Comment> comment);
}
