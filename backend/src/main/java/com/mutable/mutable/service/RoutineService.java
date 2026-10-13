package com.mutable.mutable.service;

import com.mutable.mutable.model.ProductLog;
import com.mutable.mutable.model.RoutineLog;
import com.mutable.mutable.repository.ProductRepository;
import com.mutable.mutable.repository.RoutineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class RoutineService {

    @Autowired
    private RoutineRepository routineRepository;

    @Autowired
    private ProductRepository productRepository;

    public void createRoutineEntry(List<String> productArray, String userId, String routineName, String routineTime){

        UUID routineId = UUID.randomUUID();

        for(int i = 0; i < productArray.size(); i++){
            RoutineLog routinelog = new RoutineLog();
            routinelog.setUserId(userId);

            ProductLog product = productRepository.findByProductName(productArray.get(i));
            UUID skinCareProductId = product.getId();
            routinelog.setProductId(String.valueOf(skinCareProductId));
            routinelog.setProductName(productArray.get(i));
            routinelog.setRoutineTime(routineTime);
            System.out.println(routineName);
            routinelog.setRoutineName(routineName);
            routinelog.setRoutineId(routineId);
            routinelog.setStepOrder(i + 1);

            routineRepository.save(routinelog);
        }

    }

    public List<RoutineLog> getRoutinesByUserId(String userId) {
        List<RoutineLog> routines = routineRepository.findByUserId(userId);
        return routines;
    }

    @Transactional
    public void deleteRoutine(UUID routineId, String userId) {
        routineRepository.deleteByRoutineIdAndUserId(routineId, userId);
    }

    @Transactional
    public boolean updateRoutineEntry(UUID routineId, List<String> editedProductArray, String routineName, String routineTime, String userId){
        if(routineRepository.findByRoutineIdAndUserId(routineId, userId).isEmpty()){
            return false;
        }

        routineRepository.deleteByRoutineIdAndUserId(routineId, userId);

        for(int i = 0; i < editedProductArray.size(); i++){

            ProductLog product = productRepository.findById(UUID.fromString(editedProductArray.get(i))).orElse(null);

            RoutineLog row = new RoutineLog();
            row.setUserId(userId);
            row.setRoutineId(routineId);
            row.setRoutineName(routineName);
            row.setRoutineTime(routineTime);
            row.setProductId(editedProductArray.get(i));
            row.setProductName(product.getProductName());
            row.setStepOrder(i + 1);
            routineRepository.save(row);
        }
        return true;
    }
}
