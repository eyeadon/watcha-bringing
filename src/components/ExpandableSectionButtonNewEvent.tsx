import { ReactNode, useContext } from "react";
import { DashLg, PlusLg } from "react-bootstrap-icons";
import { Button } from "react-bootstrap";
import { Collapse } from "react-bootstrap";
import { EventFormIsExpandedContext } from "../contexts/contexts.js";
import { useAuth0 } from "@auth0/auth0-react";

interface Props {
  children: ReactNode;
  buttonLabelText: string;
}

const ExpandableSectionButton = ({ children, buttonLabelText }: Props) => {
  const context = useContext(EventFormIsExpandedContext);

  const showDiv = context.eventFormIsExpanded ? children : null;

  const renderIcon = context.eventFormIsExpanded ? (
    <DashLg key="dashlg" color="white" />
  ) : (
    [<PlusLg key="pluslg" color="white" className="me-1" />, buttonLabelText]
  );

  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return (
    isAuthenticated && (
      <>
        {/* <button
        type="button"
        className="btn btn-primary mb-3"
        onClick={() => cont.setIsExpanded(!cont.EventFormIsExpanded)}
      > */}
        <Button
          className="mb-3"
          variant="primary"
          type="button"
          onClick={() =>
            context.setEventFormIsExpanded(!context.eventFormIsExpanded)
          }
        >
          {renderIcon}
        </Button>
        <Collapse in={context.eventFormIsExpanded}>
          <div>{showDiv}</div>
        </Collapse>
      </>
    )
  );
};

export default ExpandableSectionButton;
