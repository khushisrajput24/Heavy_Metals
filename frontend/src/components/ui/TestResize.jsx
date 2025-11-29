import { useTextSize } from "../../context/TextSizeContext.jsx";

export const TextResize = () => {
  const { increase, decrease, reset } = useTextSize();

  return (
    <div className="text-resize-container flex gap-3 items-center">
      <button onClick={decrease} className="changer">
        -A
      </button>
      <button onClick={reset} className="changer">
        A
      </button>
      <button onClick={increase} className="changer">
        +A
      </button>
    </div>
  );
};
