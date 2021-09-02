import React, { useEffect, useState } from "react";
import { Range } from "../components/Range";
import { Spinner } from "../components/Spinner";
import { fetchMinMaxRange } from "../services";

export const RangeMinMax = () => {
  const [isLoading, setLoading] = useState(true);
  const [rangeData, setData] = useState(null);

  useEffect(() => {
    fetchMinMaxRange().then(
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
          isEditable
          isDraggable
        />
      }
      {
        isLoading && <Spinner />
      }
    </>
  );
}
