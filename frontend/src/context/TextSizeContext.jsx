import { createContext, useContext, useState, useEffect } from "react";

const TextSizeContext = createContext();

export const TextSizeProvider = ({ children }) => {
  const [textSize, setTextSize] = useState(16); // base = 16px

  const increase = () => setTextSize((p) => Math.min(p + 2, 26));
  const decrease = () => setTextSize((p) => Math.max(p - 2, 12));
  const reset = () => setTextSize(16);

  useEffect(() => {
    document.documentElement.style.fontSize = `${textSize}px`;
  }, [textSize]);

  return (
    <TextSizeContext.Provider value={{ increase, decrease, reset }}>
      {children}
    </TextSizeContext.Provider>
  );
};

export const useTextSize = () => useContext(TextSizeContext);
