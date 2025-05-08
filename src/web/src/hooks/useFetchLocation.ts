import { OsmResponse } from "@/types/types";
import axios from "axios";
import { useState } from "react";

export const useReverse = () => {
  const [data, setData] = useState<OsmResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const reverseGeocode = async (lat: number, lon: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("https://nominatim.openstreetmap.org/reverse", {
        params: {
          lat,
          lon,
          format: "json",
          addressdetails: 1,
        },
      });
      setData(response.data);

    } catch (err) {
      setError("Failed to fetch address");

    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    reverseGeocode,
  };
};

export const useSearch = () => {
  const [data, setData] = useState<OsmResponse[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const searchLocation = async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("https://nominatim.openstreetmap.org/search", {
        params: {
          q: query,
          format: "json",
          addressdetails: 1,
          limit: 5,
        },
      });
      setData(response.data);

    } catch (err) {
      setError("Failed to fetch locations");

    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    searchLocation,
  };
};
