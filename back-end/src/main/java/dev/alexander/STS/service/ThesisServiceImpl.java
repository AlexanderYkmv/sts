package dev.alexander.STS.service;

import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;
import dev.alexander.STS.entity.Thesis;
import dev.alexander.STS.repos.ThesisRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ThesisServiceImpl implements ThesisService {

    private final ThesisRepository thesisRepository;

    // student submits a new thesis
    @Override
    public Thesis saveThesis(Thesis thesis) {
        thesis.setStatus(Thesis.ThesisStatus.PENDING);
        thesis.setApprovedBy(null);
        return thesisRepository.save(thesis);
    }

    // student updates an existing thesis submission
    @Override
    public Thesis updateThesis(Thesis thesis) {
        Optional<Thesis> existingOpt =
                thesisRepository.findByStudentId(thesis.getStudent().getId());
        if (existingOpt.isEmpty()) {
            throw new IllegalStateException("No existing thesis found to update.");
        }
        Thesis existing = existingOpt.get();
        existing.setTitle(thesis.getTitle());
        existing.setFileName(thesis.getFileName());
        existing.setFileData(thesis.getFileData());

        existing.setStatus(Thesis.ThesisStatus.PENDING);
        existing.setApprovedBy(null);

        return thesisRepository.save(existing);
    }

    // vice dean review thesis
    public Thesis reviewThesis(Thesis thesis, Thesis.ThesisStatus status,
            dev.alexander.STS.entity.User viceDean) {
        thesis.setStatus(status);
        thesis.setApprovedBy(viceDean);
        return thesisRepository.save(thesis);
    }

    @Override
    public Optional<Thesis> getThesisById(int id) {
        return thesisRepository.findById(id);
    }

    @Override
    public Optional<Thesis> getThesisByStudentId(int studentId) {
        return thesisRepository.findByStudentId(studentId);
    }

    @Override
    public void deleteThesis(int id) {
        thesisRepository.deleteById(id);
    }

    @Override
    public List<Thesis> getAllTheses() {
        return thesisRepository.findAll();
    }
}
