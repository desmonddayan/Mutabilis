package com.mutable.mutable.service;

import com.google.genai.Client;
import com.google.genai.gaos.models.interactions.*;
import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
import com.mutable.mutable.dto.PhotoRecord;
import com.mutable.mutable.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import tools.jackson.databind.ObjectMapper;

import java.util.*;


@Service
public class GeminiFaceAnalysis {
    @Autowired
    private ProductRepository productRepository;

    private static final String prompt = "Score only this photo and only what is visible, using the schema descriptions. Describe, don't diagnose.";
    private final Client client;
    private final ObjectMapper mapper;
    private final CreateModelInteractionResponseFormat format;

    public GeminiFaceAnalysis(@Value("${gemini.api.key}") String apiKey, ObjectMapper mapper) {
        this.client = Client.builder().apiKey(apiKey).build();
        this.mapper = mapper;
        this.format = buildFormat(buildRequestSchema());
    }

    public Map<String, Object> buildRequestSchema(){

        Map<String, Object> acneSeverityMap = new HashMap<>();
        acneSeverityMap.put("type", "integer");
        acneSeverityMap.put("description", "Overall acne severity visible in THIS photo, integer 0-10. " +
                "0 = clear, no visible blemishes. " +
                "1-2 = a few tiny spots or isolated comedones (blackheads or whiteheads), no inflammation. " +
                "3-4 = several small spots, mostly non-inflamed, possibly 1-2 mildly red pimples. " +
                "5-6 = many spots across the area, several clearly red or inflamed papules or pustules. " +
                "7-8 = numerous inflamed lesions, some large or clustered, widespread across the area. " +
                "9-10 = very extensive inflamed lesions with deep, nodular or cystic-looking bumps. " +
                "Score only what is visible. Do not infer what is hidden by shadow, hair or makeup.");

        Map<String, Object> rednessMap = new HashMap<>();
        rednessMap.put("type", "integer");
        rednessMap.put("description", "Redness or irritation of the skin, integer 0-10, excluding the red of individual pimples. " +
                "0 = even skin tone, no redness. " +
                "1-3 = faint pinkness in small areas. " +
                "4-6 = clearly visible red patches or diffuse flushing. " +
                "7-8 = strong redness across much of the area. " +
                "9-10 = intense, widespread redness. " +
                "Do not count redness caused by obvious lighting, flash, sunburn tint or filters if you can tell.");

        Map<String, Object> textureMap = new HashMap<>();
        textureMap.put("type", "integer");
        textureMap.put("description", "Skin surface unevenness, integer 0-10. " +
                "0 = smooth. " +
                "1-3 = slight roughness or a few small bumps. " +
                "4-6 = noticeably uneven with many small bumps or visible congestion. " +
                "7-10 = pronounced bumpiness or rough, uneven surface across most of the area. " +
                "Count only bumps and surface irregularity, not color.");

        Map<String, Object> oilinessMap = new HashMap<>();
        oilinessMap.put("type", "integer");
        oilinessMap.put("description", "Visible shine or oiliness, integer 0-10. " +
                "0 = matte. " +
                "1-3 = slight shine on the nose or forehead only. " +
                "4-6 = clear shine across the T-zone or cheeks. " +
                "7-10 = strong, widespread shine. " +
                "Lighting and flash strongly affect this, so score lower when the shine looks like a light reflection.");

        Map<String, Object> drynessMap = new HashMap<>();
        drynessMap.put("type", "integer");
        drynessMap.put("description", "Visible dryness, integer 0-10. " +
                "0 = none. " +
                "1-3 = slight dullness or tightness. " +
                "4-6 = visible dry patches or fine flaking. " +
                "7-10 = pronounced flaking, scaling or cracked-looking skin. " +
                "Score only visible signs, not guessed sensation.");

        Map<String, Object> scarsMap = new HashMap<>();
        scarsMap.put("type", "integer");
        scarsMap.put("description", "Post-acne marks and scarring, integer 0-10. " +
                "0 = none visible. " +
                "1-3 = a few faint flat marks (red or brown spots left by past pimples). " +
                "4-6 = multiple obvious marks, or mild indented scars. " +
                "7-10 = many pronounced marks or clearly pitted or raised scars. " +
                "Marks are flat discoloration, not active pimples, so do not count active lesions here.");

        Map<String, Object> lesionEstimateMap = new HashMap<>();
        lesionEstimateMap.put("type", "integer");
        lesionEstimateMap.put("description", "Rough count of distinct active spots visible in THIS photo, as an integer. " +
                "0 if none. Count each separate pimple or comedone once. " +
                "If there are more than 30, return 30. " +
                "This is an approximate estimate only.");

        Map<String, Object> geminiAnalysisNotesMap = new HashMap<>();
        geminiAnalysisNotesMap.put("type", "string");
        geminiAnalysisNotesMap.put("description", "One or two short factual sentences describing what is visible, such as the area affected. " +
                "Describe only what you can see. Do not name medical conditions");

        Map<String, Object> propertiesMap = new HashMap<>();
        propertiesMap.put("acneSeverity", acneSeverityMap);
        propertiesMap.put("redness", rednessMap);
        propertiesMap.put("texture", textureMap);
        propertiesMap.put("oiliness", oilinessMap);
        propertiesMap.put("dryness", drynessMap);
        propertiesMap.put("scars", scarsMap);
        propertiesMap.put("lesionEstimate", lesionEstimateMap);
        propertiesMap.put("geminiAnalysisNotes", geminiAnalysisNotesMap);

        Map<String, Object> schemaMap = new HashMap<>();
        schemaMap.put("type", "object");
        schemaMap.put("properties", propertiesMap);
        schemaMap.put("required", List.of("acneSeverity", "redness", "texture", "oiliness", "dryness", "scars", "lesionEstimate", "geminiAnalysisNotes"));
        return schemaMap;
    }
    private CreateModelInteractionResponseFormat buildFormat(Map<String, Object> requestSchemaMap){
        return CreateModelInteractionResponseFormat.of(
                ResponseFormat.of(
                        TextResponseFormat.builder()
                                .mimeType(TextResponseFormatMimeType.APPLICATION_JSON)
                                .schema(requestSchemaMap)
                                .build()
                )
        );
    }
    public PhotoRecord analyzePhoto(byte[] imageBytes) {
        String base64Image = Base64.getEncoder().encodeToString(imageBytes);

        Content textContent = TextContent.builder().text(prompt).build();
        Content imageContent = ImageContent.builder()
                .data(base64Image)
                .mimeType(ImageContentMimeType.IMAGE_JPEG)
                .build();

        CreateModelInteraction params = CreateModelInteraction.builder()
                .model(Model.of("gemini-3.8-flash"))
                .input(InteractionsInput.ofContent(Arrays.asList(textContent, imageContent)))
                .responseFormat(format)
                .build();

        Interaction interaction = client.interactions
                .create(CreateInteractionRequestBody.of(params))
                .interaction()
                .orElseThrow(() -> new IllegalStateException("No Response from Gemini"));

        String json = interaction.outputText()
                .filter(s -> !s.isBlank())
                .orElseThrow(() -> {
                    System.err.println("Gemini raw response: " + interaction);
                    return new IllegalStateException("Gemini returned no text");
                });

        return mapper.readValue(json, PhotoRecord.class);
    }
}