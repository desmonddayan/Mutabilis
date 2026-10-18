package com.mutable.mutable.service;

import com.mutable.mutable.dto.EntryRequest;
import com.mutable.mutable.dto.PhotoRecord;
import com.mutable.mutable.model.DailyEntryLog;
import com.mutable.mutable.repository.DailyEntryRepository;
import com.mutable.mutable.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.LinkedHashMap;
import java.util.Map;


@Service
public class DailyEntryService {
    @Autowired
    private DailyEntryRepository dailyEntryLogRepository;
    private ProductRepository productRepository;
    private GeminiFaceAnalysis geminiFaceAnalysis;
    private final RestClient restClient;

    public DailyEntryService(GeminiFaceAnalysis geminiFaceAnalysis, @Value("${supabase.url}") String url, @Value("${supabase.secret.key}") String secretKey){
        this.geminiFaceAnalysis = geminiFaceAnalysis;
        this.restClient = RestClient.builder()
                .baseUrl(url)
                .defaultHeader("apikey", secretKey)
                .build();
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

        for (Map.Entry<String, String> entry : photoPaths.entrySet()){
            String slot =  entry.getKey();
            String path =   entry.getValue();

            if(path == null) continue;
            if(path.contains("..") || !path.startsWith(userId + "/")) continue;

            try{
                byte[] imageBytes = download(path);
                PhotoRecord scores = geminiFaceAnalysis.analyzePhoto(imageBytes);


                entryLog.setUserId(userId);
                entryLog.setEntryDate(entryRequest.entryDate());
                entryLog.setRoutineIds(entryRequest.routineIds());
                entryLog.setDiaryEntry(entryRequest.diaryEntry());
                entryLog.setWaterCount(entryRequest.waterCount());
                entryLog.setWaterUnitState(entryRequest.waterUnitState());
                entryLog.setStressCount(entryRequest.stressCount());
                entryLog.setSleepCount(entryRequest.sleepCount());
                entryLog.setLeftFacePhotoPath(entryRequest.leftFacePhotoPath());
                entryLog.setMiddlePhotoPath(entryRequest.middleFacePhotoPath());
                entryLog.setRightFacePhotoPath(entryRequest.rightFacePhotoPath());
                entryLog.setAcneSeverity(scores.acneSeverity());
                entryLog.setRedness(scores.redness());
                entryLog.setTexture(scores.texture());
                entryLog.setOiliness(scores.oiliness());
                entryLog.setDryness(scores.dryness());
                entryLog.setScars(scores.scars());
                entryLog.setLesionEstimate(scores.lesionEstimate());
                entryLog.setGeminiAnalysisNotes(scores.geminiAnalysisNotes());


            }catch(Exception e){
                e.printStackTrace();
            }
        }
        dailyEntryLogRepository.save(entryLog);
    }
}
