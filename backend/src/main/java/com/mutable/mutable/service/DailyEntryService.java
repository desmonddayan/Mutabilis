package com.mutable.mutable.service;

import com.mutable.mutable.dto.EntryRequest;
import com.mutable.mutable.dto.PhotoRecord;
import com.mutable.mutable.dto.TrackPhoto;
import com.mutable.mutable.model.DailyEntryLog;
import com.mutable.mutable.model.PhotoScoreLog;
import com.mutable.mutable.repository.DailyEntryRepository;
import com.mutable.mutable.repository.PhotoScoreLogRepository;
import com.mutable.mutable.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;

import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;


@Service
public class DailyEntryService {
    @Autowired
    private DailyEntryRepository dailyEntryLogRepository;
    private ProductRepository productRepository;
    private GeminiFaceAnalysis geminiFaceAnalysis;
    private final RestClient restClient;

    @Autowired
    private PhotoScoreLogRepository photoScoreLogRepository;


    public DailyEntryService(GeminiFaceAnalysis geminiFaceAnalysis, @Value("${supabase.url}") String url, @Value("${supabase.secret.key}") String secretKey){
        this.geminiFaceAnalysis = geminiFaceAnalysis;
        this.restClient = RestClient.builder()
                .baseUrl(url)
                .defaultHeader("apikey", secretKey)
                .build();
    }

    public List<TrackPhoto> handleTrackPageFetch(LocalDate startDate, LocalDate endDate, String userId){
        return dailyEntryLogRepository.findByUserIdAndEntryDateBetweenOrderByEntryDateAsc(userId, startDate, endDate).stream().map(e -> new TrackPhoto(e.getEntryDate(), e.getMiddleFacePhotoPath())).toList();
    }
    @Transactional
    public void handleDailyEntryDelete(LocalDate date, String userId){
        dailyEntryLogRepository.deleteByUserIdAndEntryDate(userId, date);
    }

    private void scoreChangedPhotos(Map<String, String> changed, UUID dailyEntryId,
                                    String userId, LocalDate date) {
        for (Map.Entry<String, String> e : changed.entrySet()) {
            String slot = e.getKey();
            String path = e.getValue();
            if (path.contains("..") || !path.startsWith(userId + "/")) continue;

            try {
                byte[] imageBytes = download(path);
                PhotoRecord scores = geminiFaceAnalysis.analyzePhoto(imageBytes);

                PhotoScoreLog photoScoreLog = photoScoreLogRepository.findByUserIdAndEntryDateAndSlot(userId, date, slot);
                photoScoreLog.setSlot(slot);
                photoScoreLog.setUserId(userId);
                photoScoreLog.setEntryDate(date);
                photoScoreLog.setDailyEntryId(dailyEntryId);
                photoScoreLog.setAcneSeverity(scores.acneSeverity());
                photoScoreLog.setRedness(scores.redness());
                photoScoreLog.setTexture(scores.texture());
                photoScoreLog.setOiliness(scores.oiliness());
                photoScoreLog.setDryness(scores.dryness());
                photoScoreLog.setScars(scores.scars());
                photoScoreLog.setLesionEstimate(scores.lesionEstimate());
                photoScoreLog.setGeminiAnalysisNotes(scores.geminiAnalysisNotes());

                photoScoreLogRepository.save(photoScoreLog);
            } catch (Exception ex) {
                ex.printStackTrace();
            }
        }
    }

    public void updateDailyEntry(EntryRequest entryRequest, String userId){
        DailyEntryLog dailyEntryLog = dailyEntryLogRepository.findByUserIdAndEntryDate(userId, entryRequest.entryDate());

        dailyEntryLog.setRoutineIds(entryRequest.routineIds());
        dailyEntryLog.setDiaryEntry(entryRequest.diaryEntry());
        dailyEntryLog.setWaterCount(entryRequest.waterCount());
        dailyEntryLog.setWaterUnitState(entryRequest.waterUnitState());
        dailyEntryLog.setStressUnit(entryRequest.stressUnit());
        dailyEntryLog.setSleepCount(entryRequest.sleepCount());

        Map<String, String> changed = new LinkedHashMap<>();

        if(entryRequest.leftFacePhotoPath() != null){dailyEntryLog.setLeftFacePhotoPath(entryRequest.leftFacePhotoPath()); changed.put("left",  entryRequest.leftFacePhotoPath());}
        if(entryRequest.middleFacePhotoPath() != null){dailyEntryLog.setMiddleFacePhotoPath(entryRequest.middleFacePhotoPath());  changed.put("middle",  entryRequest.middleFacePhotoPath());}
        if(entryRequest.rightFacePhotoPath() != null){dailyEntryLog.setRightFacePhotoPath(entryRequest.rightFacePhotoPath()); changed.put("right",  entryRequest.rightFacePhotoPath());}

        DailyEntryLog saved = dailyEntryLogRepository.save(dailyEntryLog);
        scoreChangedPhotos(changed, dailyEntryLog.getId(), userId, entryRequest.entryDate());
    }

    public DailyEntryLog handleEntryFind(String userId, LocalDate date){
        return dailyEntryLogRepository.findByUserIdAndEntryDate(userId, date);
    }

    private byte[] download(String path){
        return restClient.get()
                .uri("/storage/v1/object/skin-photos/{path}", path)
                .retrieve()
                .body(byte[].class);
    }


    public void handleGeminiAnalysis(EntryRequest entryRequest, String userId) {
        Map<String, String> photoPaths = new LinkedHashMap<>();
        photoPaths.put("left", entryRequest.leftFacePhotoPath());
        photoPaths.put("middle", entryRequest.middleFacePhotoPath());
        photoPaths.put("right", entryRequest.rightFacePhotoPath());

        DailyEntryLog entryLog = new DailyEntryLog();

        entryLog.setUserId(userId);
        entryLog.setEntryDate(entryRequest.entryDate());
        entryLog.setRoutineIds(entryRequest.routineIds());
        entryLog.setDiaryEntry(entryRequest.diaryEntry());
        entryLog.setWaterCount(entryRequest.waterCount());
        entryLog.setWaterUnitState(entryRequest.waterUnitState());
        entryLog.setStressUnit(entryRequest.stressUnit());
        entryLog.setSleepCount(entryRequest.sleepCount());
        entryLog.setLeftFacePhotoPath(entryRequest.leftFacePhotoPath());
        entryLog.setMiddleFacePhotoPath(entryRequest.middleFacePhotoPath());
        entryLog.setRightFacePhotoPath(entryRequest.rightFacePhotoPath());

        DailyEntryLog dailySavedEntryLog = dailyEntryLogRepository.save(entryLog);

        UUID dailyEntryId = dailySavedEntryLog.getId();

        for (Map.Entry<String, String> entry : photoPaths.entrySet()){
            String slot =  entry.getKey();
            String path =   entry.getValue();

            if(path == null) continue;
            if(path.contains("..") || !path.startsWith(userId + "/")) continue;

            try{
                byte[] imageBytes = download(path);
                PhotoRecord scores = geminiFaceAnalysis.analyzePhoto(imageBytes);
                PhotoScoreLog photoScoreLog = new PhotoScoreLog();

                photoScoreLog.setSlot(slot);
                photoScoreLog.setUserId(userId);
                photoScoreLog.setEntryDate(entryRequest.entryDate());
                photoScoreLog.setDailyEntryId(dailyEntryId);
                photoScoreLog.setAcneSeverity(scores.acneSeverity());
                photoScoreLog.setRedness(scores.redness());
                photoScoreLog.setTexture(scores.texture());
                photoScoreLog.setOiliness(scores.oiliness());
                photoScoreLog.setDryness(scores.dryness());
                photoScoreLog.setScars(scores.scars());
                photoScoreLog.setLesionEstimate(scores.lesionEstimate());
                photoScoreLog.setGeminiAnalysisNotes(scores.geminiAnalysisNotes());

                photoScoreLogRepository.save(photoScoreLog);
            }catch(Exception e){
                e.printStackTrace();
            }
        }



    }
}
