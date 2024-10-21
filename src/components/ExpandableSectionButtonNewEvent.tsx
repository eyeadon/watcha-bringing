import { ReactNode, useContext, useState } from "react";
import { PlusLg, DashLg } from "react-bootstrap-icons";
import { EventFormIsExpandedContext } from "../contexts/contexts";

interface Props {
  children: ReactNode;
  buttonLabelText: string;
}

const ExpandableSectionButton = ({ children, buttonLabelText }: Props) => {
  const cont = useContext(EventFormIsExpandedContext);

  const showDiv = cont.EventFormisExpanded ? children : null;

  const renderIcon = cont.EventFormisExpanded ? (
    <DashLg key="dashlg" color="white" />
  ) : (
    [<PlusLg key="pluslg" color="white" className="me-1" />, buttonLabelText]
  );

  return (
    <>
      <button
        type="button"
        className="btn btn-primary mb-3"
        onClick={() => cont.setIsExpanded(!cont.EventFormisExpanded)}
      >
        {renderIcon}
      </button>
      {showDiv}
    </>
  );
};

export default ExpandableSectionButton;
