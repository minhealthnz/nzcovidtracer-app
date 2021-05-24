import { selectUser } from "@domain/user/selectors";
import { useHandleLink } from "@navigation/hooks/useHandleLink";
import { navigationRef } from "@navigation/navigation";
import { useSelector } from "react-redux";

import { NHIScreen } from "../screens";

export function LinkNHI() {
  const user = useSelector(selectUser);
  const nhi = user?.nhi;

  useHandleLink("nhi", () => {
    if (nhi) {
      navigationRef.current?.navigate(NHIScreen.View);
    } else {
      navigationRef.current?.navigate(NHIScreen.Privacy);
    }
  });

  return null;
}
