import React, { useState } from 'react';
import { Button, Tooltip, Popconfirm } from 'antd';
import type { ButtonProps } from 'antd';
import { LoadingOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { CONSTANT } from '@/config/Constant';

export type IconButtonProps = {
  size?: 'small' | 'medium' | 'large';
  btnType?: 'iconOnly' | 'textOnly' | 'iconText';
  color?: 'red' | 'green' | 'blue' | 'primary' | 'secondary';
  icon?: React.ReactNode;
  text?: string;
  tooltip?: string;
  onClick?: () => Promise<void> | void;
  confirmBeforeClick?: boolean;
  confirmMessage?: string;
  className?: string;
  disabled?: any;
};

const convertToAntSize = (
  size: 'small' | 'medium' | 'large',
): ButtonProps['size'] => {
  if (size === 'medium') return 'middle';
  return size;
};

const IconButton: React.FC<IconButtonProps> = ({
  size = 'medium',
  btnType = 'iconText',
  color = 'secondary',
  icon,
  text,
  tooltip,
  onClick,
  confirmBeforeClick = false,
  confirmMessage = 'Are you sure you want to delete this record?',
  className,
  disabled,
  ...rest
}) => {
  const antSize = convertToAntSize(size);
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);

  const renderContent = () => {
    const currentIcon = loading ? <LoadingOutlined /> : icon;

    if (btnType === 'iconOnly') return currentIcon;
    if (btnType === 'textOnly') return text;
    return (
      <>
        {currentIcon}
        {text && <span style={{ marginLeft: 6 }}>{text}</span>}
      </>
    );
  };

  const handleClick = async () => {
    if (confirmBeforeClick) {
      setOpen(true);
    } else {
      try {
        setLoading(true);
        await new Promise((resolve) => {
          setTimeout(resolve, CONSTANT.SET_TIMEOUT);
        });
        await onClick?.();
      } finally {
        setLoading(false);
      }
    }
  };

  const handleConfirm = async () => {
    setConfirmLoading(true);
    try {
      await onClick?.();
    } finally {
      setConfirmLoading(false);
      setOpen(false);
    }
  };

  const handleCancel = () => setOpen(false);

  const button = (
    <Tooltip
      title={!loading ? (tooltip ?? text) : null}
      trigger="hover"
      placement="top"
      zIndex={5}
    >
      <Button
        size={antSize}
        type="text"
        className={`${color} ${btnType} ${className ?? ''}`}
        shape="round"
        icon={btnType === 'iconOnly' ? undefined : undefined}
        onClick={handleClick}
        disabled={disabled}
        {...rest}
      >
        {renderContent()}
      </Button>
    </Tooltip>
  );

  return confirmBeforeClick ? (
    <Popconfirm
      title={confirmMessage}
      icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
      open={open}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
      okButtonProps={{ loading: confirmLoading }}
      okText="Delete"
      cancelText="Cancel"
      okType="danger"
    >
      {button}
    </Popconfirm>
  ) : (
    button
  );
};

export default IconButton;
