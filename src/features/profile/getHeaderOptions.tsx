import { selectCurrentRouteName } from "@features/device/selectors";
import { AccessibleHeaderTitle } from "@navigation/hooks/AccessibleHeaderTitle";
import { useFocusView } from "@navigation/hooks/useFocusView";
import { StackHeaderTitleProps } from "@react-navigation/stack";
import { TabScreen } from "@views/screens";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

export function getHeaderOptions() {
  return {
    headerTitle: (props: StackHeaderTitleProps) => <HeaderTitle {...props} />,
  };
}

function HeaderTitle(props: StackHeaderTitleProps) {
  const { t } = useTranslation();

  const currentRouteName = useSelector(selectCurrentRouteName);

  const { focusView, ref } = useFocusView();

  useEffect(() => {
    if (currentRouteName === TabScreen.MyData) {
      focusView();
    }
  }, [currentRouteName, focusView]);

  return (
    <AccessibleHeaderTitle {...props} ref={ref}>
      {t("screenTitles:myProfile")}
    </AccessibleHeaderTitle>
  );
}
