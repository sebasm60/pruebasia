import { ScreenTitle } from "../atoms";
import { DispensacionManualForm } from "../organisms";

export const DiespencacionManualTemplate = ({ title }) => {
  return (
    <div className="flex flex-col h-full bg-white">
      <ScreenTitle title={title} />

      <div className="flex-1 flex justify-center items-center">
        <DispensacionManualForm />
      </div>
    </div>
  );
};
