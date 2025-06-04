import { useModal, useServices } from "src/hooks";
import { RecentOrders, ServiceGrid, UserSummary } from "../organisms";
import { DashboardTemplate } from "../templates";
import { Modal } from "../atoms";
import { CambiarDeSede } from "../molecules";
import { getSedes } from "src/api";
import { useEffect, useState } from "react";
export const DashboardPage = () => {

  const [sedes, setSedes] = useState()
  const [refreshUser, setRefreshUser] = useState(false);
  const { services } = useServices();
  const { isOpen, openModal, closeModal, content, title, actions, size } = useModal();

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

  return (
    <DashboardTemplate>
      <div className="flex w-full h-full bg-gray-100 p-2">
        <div className="flex w-full gap-3">

          <div className="flex flex-col w-2/3 gap-3">
            <UserSummary
              refresh={refreshUser}
              onChangeSede={() => {
                openModal({
                  title: "Cambiar de sede",
                  content: <CambiarDeSede sedes={sedes} closeModal={closeModal} onSaved={() => setRefreshUser(prev => !prev)} />,
                  size: 'xl',
                })
              }} />
            <div >
              <ServiceGrid services={services} />
            </div>
          </div>

          <RecentOrders />
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} title={title} actions={actions} size={size}>
        {content}
      </Modal>
    </DashboardTemplate>
  );
};
