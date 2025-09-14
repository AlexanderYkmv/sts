package dev.alexander.STS.entity;

import java.util.List;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "thesis")
@Data
public class Thesis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @Column(name = "title")
    private String title;

    @Column(name = "major")
    private String major;

    @Column(name = "file_name")
    private String fileName;

    @Lob
    @Column(name = "file_data", columnDefinition = "LONGBLOB")
    private byte[] fileData;

    @OneToOne
    @JoinColumn(name = "student_id", nullable = false, unique = true)
    private Student student;

    @ManyToOne
    @JoinColumn(name = "approved_by")
    private User approvedBy;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private ThesisStatus status;


    @OneToMany(mappedBy = "thesis", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Feedback> feedbacks;

    public enum ThesisStatus {
        PENDING, APPROVED, REJECTED
    }
}
