import { OsmResponse } from "@/types/types";
import axios from "axios";
import { useState } from "react";

export const useReverseLocation = () => {
  const [data, setData] = useState<OsmResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const reverseLocation = async (lat: number, lon: number) => {
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
        headers: {
          "User-Agent": "'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36'"
        }
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
    reverseLocation,
  };
};

export const useSearchLocation = () => {
  const [data, setData] = useState<OsmResponse[]>([]);
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
        headers: {
          "User-Agent": "'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36'"
        }
      });
      console.log(response.data);
      setData(response.data);

    } catch (err) {
      setError("Failed to fetch location");

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
