package com.mutable.mutable.service;

import com.mutable.mutable.model.ProductLog;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

@Service
public class AnthropicAIService {

    private RestClient restClient;

    public AnthropicAIService(@Value("${anthropic.api.key}") String apiKey){
        this.restClient = RestClient.builder()
                .baseUrl("https://api.anthropic.com")
                .defaultHeader("x-api-key", apiKey)
                .defaultHeader("anthropic-version", "2023-06-01")
                .defaultHeader("Content-Type", "application/json")
                .build();
    }

    public ProductLog claudeRequest(String productDescription){
        String requestBody = """
            {
            "model": "claude-sonnet-5",
            "max_tokens": 4096,
            "messages": [{
                "role": "user",
                "content": "You are a skincare product database and you will gather data on '%s'. Given a description identify the most likely product. For the productName use the official product name. For the brand name use the company name. For the productCategory use one of: cleanser, moisturiser, serum, toner, sunscreen, exfoliant, mask, treatment. For fragranceFree give a boolean value of true if it is fragrance free and false otherwise. For keyIngredients list 3-5 active ingredients separated by commas, if there are less than 3-5 only list the ones found. For comedogenic give a boolean value of true if it has ingredients that are comedogenic and false otherwise. For coreCloggingIngredients list 1-5 core clogging ingredients separated by commas, if there are less than 1-5 only list the ones found, or put N/A. For optimalStorageEnvironment state where the product should be stored to preserve its quality. For skinTypeSuitability use one of: normal, dry, oily, combination, sensitive. For recommendedUsageFrequency state in days how often it should be used, such as once a week or every day and etc. For purging give a boolean value of true if it is commonly known to purge and false otherwise. For purgingPeriod list as a range the number of days the product is commonly known to cause purging for, if it does not cause purging state 0 as the value. For weatherCompatability state what weather conditions it is optimal in such as in drier or more humid environments. For sunCompatability state if the sun is harsher on the skin when this product is used and to use sunscreen or limit exposure to the sun. For suitableCombinationIngredients list 3-5 ingredients that work well in combination with this product and its active ingredients separated by commas, if there are less than 3-5 only list the ones found. For poorCombinationIngredients list 3-5 ingredients that should not be used in combination with this search product and its active ingredients separated by commas, for example if the product contains benzoyl peroxide list retinoids, if there are less than 3-5 only list the ones found. For compatabilityWithPregnancyAndBreastFeeding state whether pregnant or breast feeding people should not use the product if it is dangerous to them, and say it is not otherwise. For additionalNotes include any additional notes that users of the product should be aware of that was not already listed."
            }],
            "output_config": {
            "format": {
                "type": "json_schema",
                    "schema": {
                        "type": "object",
                        "properties": {
                            "productName": {"type": "string"},
                            "brand": {"type": "string"},
                            "productCategory": {"type": "string"},
                            "fragranceFree": {"type": "boolean"},
                            "keyIngredients": {"type": "string"},
                            "comedogenic": {"type": "boolean"},
                            "coreCloggingIngredients": {"type": "string"},
                            "optimalStorageEnvironment": {"type": "string"},
                            "skinTypeSuitability": {"type": "string"},
                            "recommendedUsageFrequency": {"type": "string"},
                            "purging": {"type": "boolean"},
                            "purgingPeriod": {"type": "string"},
                            "weatherCompatability": {"type": "string"},
                            "sunCompatability": {"type": "string"},
                            "suitableCombinationIngredients": {"type": "string"},
                            "poorCombinationIngredients": {"type": "string"},
                            "compatabilityWithPregnancyAndBreastFeeding": {"type": "string"},
                            "additionalNotes": {"type": "string"}
                        },
                           "required": [
                                       "productName", "brand", "productCategory", "fragranceFree",
                                       "keyIngredients", "comedogenic", "coreCloggingIngredients",
                                       "optimalStorageEnvironment", "skinTypeSuitability",
                                       "recommendedUsageFrequency", "purging", "purgingPeriod",
                                       "weatherCompatability", "sunCompatability",
                                       "suitableCombinationIngredients", "poorCombinationIngredients",
                                       "compatabilityWithPregnancyAndBreastFeeding", "additionalNotes"
                                        ],
                           "additionalProperties": false
                    }
                }
            }
            }
        """.formatted(productDescription);

        try{
            String response = restClient.post()
                    .uri("v1/messages")
                    .body(requestBody)
                    .retrieve()
                    .body(String.class);

            return parseAIResponse(response);
        } catch(RestClientException e){
            throw new RuntimeException("AI Service Unavailable: " + e.getMessage());
        }
    }

    private ProductLog parseAIResponse(String responseBody){
        try{
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode rootNode = objectMapper.readTree(responseBody);
            JsonNode contentArray = rootNode.get("content");

            String aiText = null;
            for (JsonNode block : contentArray) {
                if ("text".equals(block.get("type").stringValue())) {
                    aiText = block.get("text").stringValue();
                    break;
                }
            }

            if (aiText == null) {
                throw new RuntimeException("No text block found in AI response");
            }


            JsonNode productJSON = objectMapper.readTree(aiText);

            ProductLog productLog = new ProductLog();
            productLog.setProductName(productJSON.get("productName").stringValue());
            productLog.setBrand(productJSON.get("brand").stringValue());
            productLog.setProductCategory(productJSON.get("productCategory").stringValue());
            productLog.setFragranceFree(productJSON.get("fragranceFree").asBoolean());
            productLog.setKeyIngredients(productJSON.get("keyIngredients").stringValue());
            productLog.setComedogenic(productJSON.get("comedogenic").asBoolean());
            productLog.setCoreCloggingIngredients(productJSON.get("coreCloggingIngredients").stringValue());
            productLog.setOptimalStorageEnvironment(productJSON.get("optimalStorageEnvironment").stringValue());
            productLog.setSkinTypeSuitability(productJSON.get("skinTypeSuitability").stringValue());
            productLog.setRecommendedUsageFrequency(productJSON.get("recommendedUsageFrequency").stringValue());
            productLog.setPurging(productJSON.get("purging").asBoolean());
            productLog.setPurgingPeriod(productJSON.get("purgingPeriod").stringValue());
            productLog.setWeatherCompatability(productJSON.get("weatherCompatability").stringValue());
            productLog.setSunCompatability(productJSON.get("sunCompatability").stringValue());
            productLog.setSuitableCombinationIngredients(productJSON.get("suitableCombinationIngredients").stringValue());
            productLog.setPoorCombinationIngredients(productJSON.get("poorCombinationIngredients").stringValue());
            productLog.setCompatabilityWithPregnancyAndBreastFeeding(productJSON.get("compatabilityWithPregnancyAndBreastFeeding").stringValue());
            productLog.setAdditionalNotes(productJSON.get("additionalNotes").stringValue());

            return productLog;
        } catch(Exception e){
            throw new RuntimeException("False to parse AI response: " + e.getMessage());
        }
    }

}
