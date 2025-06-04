import { useState } from "react";
import { FaPlus } from "react-icons/fa";

export const FloatingActionMenu = ({ actions }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">

      {open &&
        actions.map((action, index) => (
          <button
            key={index}
            className="flex items-center gap-3 px-4 py-2 bg-slate-800 text-white rounded-lg shadow-md hover:bg-slate-700 transition-all"
            onClick={() => {
              setOpen(false);
              action.onClick();
            }}
          >
            {action.icon && <action.icon className="w-4 h-4" />}
            {action.text && <span className="text-sm">{action.text}</span>}
          </button>
        ))}


      <button
        className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xl hover:bg-blue-700 transition-all"
        onClick={() => setOpen((prev) => !prev)}
        title="Acciones rápidas"
      >
        <FaPlus className={`w-6 h-6 transform transition-transform ${open ? "rotate-45" : ""}`} />
      </button>
    </div>
  );
};


