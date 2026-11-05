import React, { useState, useEffect } from "react";

export const DataFetcher: React.FC = () => {
  const [data, setData] = useState<any>(null);
  // Настройки запроса
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  };

  useEffect(() => {
    fetch("https://example.com", requestOptions)
      .then((res) => res.json())
      .then((result) => setData(result));
  }, [requestOptions]); // Ссылочная зависимость

  return <div>{data ? JSON.stringify(data) : "Loading..."}</div>;
};
