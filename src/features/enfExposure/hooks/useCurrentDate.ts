import { useEffect, useState } from "react";

// Returns the current date, updated every minute
export default function useCurrentDate() {
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => {
      setCurrentDate(new Date());
    }, 60 * 1000);
    return () => clearInterval(id);
  }, []);

  return currentDate;
}
