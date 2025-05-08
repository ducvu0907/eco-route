package com.ducvu.backend_java.util;

import com.ducvu.backend_java.dto.response.OsmResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
@RequiredArgsConstructor
public class Helper {
  private final RestTemplate restTemplate;

  public OsmResponse reverseGeocode(Double lat, Double lon) {
    String apiUrl = String.format("https://nominatim.openstreetmap.org/reverse?lat=%f&lon=%f&format=json", lat, lon);
    ResponseEntity<OsmResponse> response = restTemplate.getForEntity(apiUrl, OsmResponse.class);
    return response.getBody();
  }

}
