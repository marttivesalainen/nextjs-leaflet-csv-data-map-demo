import { LatLngExpression } from "leaflet";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { readString } from "react-papaparse";

type Row = {
  latLng: LatLngExpression;
  radius: number;
};

type ValidCSVDataRow = [string, string, string];

const mapData = (result: unknown[]): Row[] => {
  return result
    .filter((row): row is ValidCSVDataRow => {
      if (!Array.isArray(row)) {
        return false;
      }

      if (
        typeof row[0] !== "string" ||
        typeof row[1] !== "string" ||
        typeof row[2] !== "string"
      ) {
        return false;
      }

      return true;
    })
    .map((row) => {
      return {
        latLng: [parseFloat(row[0]), parseFloat(row[1])],
        radius: parseInt(row[2]),
      };
    });
};

export const useData = () => {
  const [data, setData] = useState<Row[] | null>(null);

  useEffect(() => {
    const fetchCsv = async () => {
      const response = await fetch("/data.csv");
      const reader = response.body?.getReader();
      const result = await reader?.read();
      const decoder = new TextDecoder("utf-8");
      const csv = decoder.decode(result?.value);

      if (!response.body) {
        return null;
      }

      readString(csv, {
        worker: true,
        complete: (results) => setData(mapData(results.data)),
      });
    };

    fetchCsv();
  }, []);

  return data;
};
