import { useState, useEffect } from "react";
import api from "../api/api";

export default function useDropdownData(url) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await api.get(url);
        setData(response.data);
      } catch (error) {
        console.error(`Error fetching from ${url}`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading };
}
