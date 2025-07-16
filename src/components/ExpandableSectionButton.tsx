import { useAuth0 } from "@auth0/auth0-react";
import { ReactNode, useState } from "react";
import { PlusLg, DashLg } from "react-bootstrap-icons";
import { Button } from "react-bootstrap";
import { Collapse } from "react-bootstrap";

interface Props {
  children: ReactNode;
  buttonLabelText: string;
}

const ExpandableSectionButton = ({ children, buttonLabelText }: Props) => {
  const [isExpanded, setIsExpanded] = useState(false); // false -> + icon

  const showDiv = isExpanded ? children : null;

  const renderIcon = isExpanded ? (
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
        onClick={() => setIsExpanded(!isExpanded)}
      > */}
        <Button
          className="mb-3"
          variant="primary"
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {renderIcon}
        </Button>
        <Collapse in={isExpanded}>
          <div>{showDiv}</div>
        </Collapse>
      </>
    )
  );
};

export default ExpandableSectionButton;
