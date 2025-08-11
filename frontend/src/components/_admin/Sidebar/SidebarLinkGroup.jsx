import { ReactNode, useState } from "react";

const SidebarLinkGroup = ({ children, activeCondition }) => {
  const [open, setOpen] = useState(activeCondition);

  const handleClick = () => {
    setOpen(!open);
  };

  return <ul>
    <li>{children(handleClick, open)}</li>
  </ul>;
};

export default SidebarLinkGroup;
