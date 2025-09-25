package dev.alexander.STS.service;

import java.util.List;
import java.util.Optional;

import dev.alexander.STS.entity.Thesis;
import dev.alexander.STS.entity.User;

public interface ThesisService {
    Thesis saveThesis(Thesis thesis); // student submits

    Thesis updateThesis(Thesis thesis); // student updates

    Thesis reviewThesis(Thesis thesis, Thesis.ThesisStatus status, User viceDean); // vice dean
                                                                                   // review

    Optional<Thesis> getThesisById(int id);

    Optional<Thesis> getThesisByStudentId(int studentId);

    void deleteThesis(int id);

    List<Thesis> getAllTheses();
}
