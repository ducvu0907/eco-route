package com.ducvu.backend_java.dto.response;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OsmResponse {
  // represents response template of OpenStreetMap API
  // use this to convert lat/lon into readable address
  // or query location
  private Long placeId;
  private String licence;
  private String osmType;
  private Long osmId;
  private String lat;
  private String lon;
  private String classType;
  private String type;
  private Integer placeRank;
  private Double importance;
  private String addresstype;
  private String name;
  private String displayName;
  private String[] boundingbox;

  private String error; // exists if there are errors
}
