import { ReactNode, useContext } from "react";
import { DashLg, PlusLg } from "react-bootstrap-icons";
import Button from "react-bootstrap/Button";
import Collapse from "react-bootstrap/Collapse";
import { EventFormIsExpandedContext } from "../contexts/contexts";

interface Props {
  children: ReactNode;
  buttonLabelText: string;
}

const ExpandableSectionButton = ({ children, buttonLabelText }: Props) => {
  const context = useContext(EventFormIsExpandedContext);

  const showDiv = context.eventFormisExpanded ? children : null;

  const renderIcon = context.eventFormisExpanded ? (
    <DashLg key="dashlg" color="white" />
  ) : (
    [<PlusLg key="pluslg" color="white" className="me-1" />, buttonLabelText]
  );

  return (
    <>
      {/* <button
        type="button"
        className="btn btn-primary mb-3"
        onClick={() => cont.setIsExpanded(!cont.EventFormisExpanded)}
      > */}
      <Button
        className="mb-3"
        variant="primary"
        type="button"
        onClick={() =>
          context.setEventFormIsExpanded(!context.eventFormisExpanded)
        }
      >
        {renderIcon}
      </Button>
      <Collapse in={context.eventFormisExpanded}>
        <div>{showDiv}</div>
      </Collapse>
    </>
  );
};

export default ExpandableSectionButton;
