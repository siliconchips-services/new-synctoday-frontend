import { Dispatch, SetStateAction } from 'react';

interface MenuToggleProps {
  collapsed: boolean;
  SetCollapsed: Dispatch<SetStateAction<boolean>>;
}

const MenuToggle: React.FC<MenuToggleProps> = (props) => {
  const { collapsed, SetCollapsed } = props;

  return (
    <div
      className={`menuToggle ${collapsed ? 'icon collapsed' : 'icon'}`}
      onClick={() => SetCollapsed(!collapsed)}
    >
      <span></span>
      <span></span>
      <span></span>
    </div>
  );
};

export default MenuToggle;
