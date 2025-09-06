package dev.alexander.STS.dto;

import dev.alexander.STS.entity.Feedback;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class FeedbackDto {
    private int id;
    private String content;
    private LocalDateTime createdAt;
    private SimpleUserDto author;

    public FeedbackDto(Feedback feedback) {
        this.id = feedback.getId();
        this.content = feedback.getContent();
        this.createdAt = feedback.getCreatedAt();
        this.author = new SimpleUserDto(feedback.getAuthor());
    }
}