package dev.alexander.STS.entity;

import java.util.ArrayList;
import java.util.List;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "research_topic")
public class ResearchTopic {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "name")
    private String name;

    @ManyToOne
    @JoinColumn(name = "tutor_id", nullable = false)
    @JsonBackReference
    private Tutor tutor;

    @Column(name = "topic", nullable = false)
    private String topic;

    @Column(name = "capacity", nullable = false)
    private Integer capacity = 1;

    @OneToMany(mappedBy = "researchTopic", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Student> assignedStudents = new ArrayList<>();


    public ResearchTopic(String name, Tutor tutor) {
        this.name = name;
        this.tutor = tutor;
    }

}
