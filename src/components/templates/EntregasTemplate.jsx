import { useEntregas } from "src/hooks/useEntregas";
import { IconButton, Modal, ScreenTitle } from "../atoms";
import { DataTable } from "../organisms/DataTable";
import moment from "moment/moment";
import { FaEye, FaSearch } from "react-icons/fa";
import { InputField, InputSelect } from "../molecules";
import { useEffect, useState } from "react";
import { getSedes } from "src/api";
import { MdCancel, MdModeEdit } from "react-icons/md";

import { ViewUpdateEntrega } from "../molecules/modales/ViewUpdateEntrega";
import Swal from 'sweetalert'
import { useModal } from "src/hooks";

export const EntregasTemplate = ({ title }) => {
  const [sedes, setSedes] = useState()
  const { data: entregas = [], isLoading, isError, error, convenios } = useEntregas();
  const { isOpen, openModal, closeModal, content, title: titleModal, actions, size } = useModal();

  useEffect(() => {
    const obtenerSedes = async () => {
      const sedesRaw = await getSedes()
      const sedesFormateadas = sedesRaw.map(sede => ({
        value: sede.IdSede,
        label: sede.Nombre
      }));
      setSedes(sedesFormateadas);
    };
    obtenerSedes();
  }, []);

  const columns = [
    {
      header: 'Número',
      accessorKey: 'prefijoEntrega',
    },
    {
      header: 'Fecha',
      accessorKey: 'Fh_Ing',
      cell: info => moment(info.getValue()).format('LLL')
    },
    {
      header: 'Convenio',
      accessorKey: 'Convenio.Nombre',
    },
    {
      header: 'Id Paciente',
      accessorKey: 'Paciente.IdPaciente',
    },
    {
      header: 'Tipo id',
      accessorKey: 'Paciente.IdTipoId',
    },
    {
      header: 'Nombre Paciente',
      accessorKey: 'Paciente.Nombre',
    },
    {
      header: 'Sede',
      accessorKey: 'Sede.IdSede',
    },
    {
      header: 'Usuario',
      accessorKey: 'IdUser_Ing',
    },
    {
      header: 'Rol',
      accessorKey: 'Rol.Nombre',
    },
    {
      header: 'Acciones',
      id: 'acciones',
      cell: ({ row }) => (
        <div className="flex gap-2 justify-center">
          <button
            onClick={() =>
              openModal({
                title: "Resumen de Entrega",
                size: "lg",
                content: (
                  <ViewUpdateEntrega
                  />
                ),
              })
            }
            className="bg-blue-600 hover:bg-blue-700 text-white p-1.5 rounded shadow-md"
            title="Consultar"
          >
            <FaEye />
          </button>

          <button
            // onClick={() => console.log('Editar', row.original)}
            onClick={() =>
              openModal({
                title: "Editar Entrega",
                size: "lg",
                content: (
                  <ViewUpdateEntrega
                    isUpdate
                  />
                ),
              })
            }
            className="bg-yellow-500 hover:bg-yellow-600 text-white p-1.5 rounded shadow-md"
            title="Editar"
          >
            <MdModeEdit />

          </button>
          <button
            onClick={() => {
              Swal({
                title: `Anular entrega`,
                text: `¿Está seguro de anular la entrega?`,
                icon: "info",
                dangerMode: true,
                closeOnClickOutside: false,
                closeOnEsc: false,
              }).then((confirm) => {
                if (confirm.isConfirmed) {
                  console.log('Sí');
                  // Aquí va tu lógica de anulación
                }
              });
            }}
            className="bg-red-600 hover:bg-red-700 text-white p-1.5 rounded shadow-md"
            title="Anular"
          >
            <MdCancel />
          </button>
        </div>
      )
    }
  ];

  if (isLoading) {
    return <div className="flex-1 flex justify-center items-center">Cargando entregas...</div>;
  }

  if (isError) {
    return <div className="flex-1 flex justify-center items-center text-red-600">Error: {error.message}</div>;
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <ScreenTitle title={title} />
      <div className="flex-1 flex justify-center items-center p-3 flex-col">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-2 w-full">
          <InputField

            label="Id paciente"
            className="col-span-1"
          />

          <InputField
            label="Nombre paciente"
            className="col-span-1"
          />

          <InputSelect
            placeholder="Convenio"
            options={convenios}
            className="col-span-1"
          />

          <InputSelect
            placeholder="Sede"
            options={sedes}
            className="col-span-1"
          />

          <InputField
            label="Fecha de inicio"
            type="date"
            className="col-span-1"
          />

          <InputField
            label="Fecha final"
            type="date"
            className="col-span-1"
          />

          <div className="col-span-full flex justify-end">
            <IconButton
              icon={FaSearch}
              text="Buscar"
              onClick={() => console.log("Buscar")}
            />
          </div>
        </div>

        <DataTable data={entregas.data} columns={columns} caption={'Tabla De Entregas'} />
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} title={titleModal} actions={actions} size={size}>
        {content}
      </Modal>
    </div>
  );
};
