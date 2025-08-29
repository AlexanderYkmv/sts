package dev.alexander.STS.service;

import java.util.List;
import java.util.Optional;
import dev.alexander.STS.entity.Thesis;

public interface ThesisService {
    Thesis saveThesis(Thesis thesis);
    Thesis updateThesis(Thesis thesis);
    Optional<Thesis> getThesisById(int id);
    Optional<Thesis> getThesisByStudentId(int studentId);
    void deleteThesis(int id);
    List<Thesis> getAllTheses();
}