import React, { useEffect, useState } from "react";
import { Range } from "../components/Range";
import { Spinner } from "../components/Spinner";
import { fetchFixedRange } from "../services";

export const RangeFixed = () => {
  const [isLoading, setLoading] = useState(true);
  const [rangeData, setData] = useState(null);

  useEffect(() => {
    fetchFixedRange().then(
      res => setData(res)
    ).catch(
      err => console.error(err)
    ).finally(
      () => setLoading(false)
    );
  }, []);

  return (
    <>
      {
        rangeData &&
        <Range
          min={rangeData.min}
          max={rangeData.max}
          isEditable={false}
          isDraggable={false}
          pointsRange={rangeData.values}
        />
      }
      {
        isLoading && <Spinner />
      }
    </>
  );
}
