import { orsApiKey } from "@/config/config";
import { Feature, OrsApiResponse } from "@/types/types";
import axios from "axios";
import { useState } from "react";

export const useReverseLocation = () => {
  const [data, setData] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const reverseLocation = async (lat: number, lon: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("https://api.openrouteservice.org/geocode/reverse", {
        params: {
          "api_key": orsApiKey,
          "point.lon": lon,
          "point.lat": lat, 
        }
      });

      const feature = response.data?.features?.[0];
      setData(feature?.properties?.label ?? null);


    } catch (err) {
      setError("Failed to reverse locations");

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
  const [data, setData] = useState<Feature[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const searchLocation = async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("https://api.openrouteservice.org/geocode/search", {
        params: {
          "api_key": orsApiKey,
          "text": query,
          "size": 5
        }
      });

      const features = response.data?.features;
      const data = features;
      setData(data);

    } catch (err) {
      setError("Failed to search locations");

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
