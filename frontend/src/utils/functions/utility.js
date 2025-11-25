import { useNavigate } from "react-router-dom";

export function useViewReport() {
  const navigate = useNavigate();

  const viewReport = () => {
    navigate("/user/analysis");
  };

  return viewReport;
}
