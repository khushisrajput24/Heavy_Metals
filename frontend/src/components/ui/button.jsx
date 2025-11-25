export const Button = ({
  children,
  onClickHandler,
  type,
  colorVariant = "primary",
  disabled = false,
}) => {
  const baseStyle = {
    main: "px-4 py-2 rounded-lg font-medium my-2 flex items-center justify-center gap-2",
    support: "px-2 py-1 rounded-lg font-medium text-[12px] my-2",
  };

  const variants = {
    primary:
      "bg-[#0c7d72] text-white hover:bg-[#08554f] cursor-pointer hover:scale-105 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed",
    secondary:
      "bg-white border-2 border-[#0c7d72] text-gray-800 hover:bg-[#0c7d72] hover:text-white cursor-pointer hover:scale-105 transition-all duration-200 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed",
    "secondary-blue":
      "bg-white text-[#676f79] hover:bg-blue-600 hover:text-white cursor-pointer hover:scale-105 transition-all duration-200 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed",
    danger:
      "bg-red-600 text-white hover:bg-red-700 cursor-pointer hover:scale-105 transition-all duration-200 disabled:bg-red-300 disabled:cursor-not-allowed",
    success:
      "bg-green-600 text-white hover:bg-green-700 cursor-pointer hover:scale-105 transition-all duration-200 disabled:bg-green-300 disabled:cursor-not-allowed",
  };

  return (
    <button
      onClick={onClickHandler}
      className={`${variants[colorVariant]} ${baseStyle[type]}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
