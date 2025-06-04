import { useState } from "react";
import { InputSelect } from "../forms"
import { FaSave } from "react-icons/fa";
import { IconButton } from "src/components/atoms";

export const CambiarDeSede = ({ sedes, closeModal, onSaved }) => {

  const [sedeSeleccionada, setSedeSeleccionada] = useState(null);

  const guardarEnLocalStorage = () => {
    if (sedeSeleccionada) {
      localStorage.setItem("SedeUsers", sedeSeleccionada.label);
      localStorage.setItem("SedeID", sedeSeleccionada.value);
      onSaved?.();
      closeModal()
    } else {
      alert("Primero debes seleccionar una sede");
    }
  };

  return (
    <div className="p-2 flex flex-col gap-3 w-96">
      <InputSelect
        placeholder='Sedes'
        options={sedes}
        value={sedeSeleccionada?.value}
        setValue={(value) => {
          const selected = sedes.find(s => s.value === value);
          setSedeSeleccionada(selected);
        }}
        className='w-full'
      />

      <IconButton
        text="Cambiar sede"
        icon={FaSave}
        type="button"
        onClick={() => { guardarEnLocalStorage() }}
        disabled={!sedeSeleccionada}
      />
    </div>
  )
}
