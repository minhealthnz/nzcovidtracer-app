import { selectUser } from "@domain/user/selectors";
import { matchDeeplink } from "@linking/matchers";
import { useHandleLink } from "@linking/useHandleLink";
import { navigationRef } from "@navigation/navigation";
import { useSelector } from "react-redux";

import { NHIScreen } from "../screens";

export function LinkNHI() {
  const user = useSelector(selectUser);
  const nhi = user?.nhi;

  useHandleLink(
    {
      matcher: matchDeeplink("nhi"),
    },
    () => {
      if (nhi) {
        navigationRef.current?.navigate(NHIScreen.View);
      } else {
        navigationRef.current?.navigate(NHIScreen.Privacy);
      }
    },
  );

  return null;
}
