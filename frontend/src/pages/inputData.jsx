import ManualInput from "../components/calculate/manualInput";
import QuestionnaireForm from "../components/questionnaireForm";

export const InputData = () => {
  return (
    <div>
      <div className="main-header-wrapper">
        <div className="main-header">Input Data Page</div>
      </div>
      <QuestionnaireForm />
      <ManualInput />
    </div>
  );
};
