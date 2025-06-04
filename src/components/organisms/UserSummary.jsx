import { UserInfo } from "../molecules/UserInfo";
import { useUserInfo } from "../../hooks/useUserInfo";
import { IconButton } from "../atoms";

import { FiRefreshCw } from "react-icons/fi";

export const UserSummary = ({ onChangeSede, refresh }) => {
  const { user } = useUserInfo(refresh);

  return (
    <div className="flex flex-col gap-4 rounded-lg bg-white p-5 border-md shadow-md">
      <div>
        <UserInfo {...user} />
        <br />
        <IconButton text="Cambiar Sede" icon={FiRefreshCw} onClick={() => onChangeSede()} />
      </div>
    </div>
  );
};