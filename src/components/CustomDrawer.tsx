import { Drawer } from "antd";
import React, { useEffect, useState } from "react";

export interface CustomDrawerProps {
  title?: string;
  size?: string;
  visible?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClose?: () => void;
  extraKeys?: any;
}

export function CustomDrawer(props: CustomDrawerProps) {
  const [title, setTitle] = useState(props.title);
  const [children, setChildren] = useState(props.children);
  const [visible, setVisible] = useState(props.visible);

  useEffect(() => {
    setTitle(props.title);
    setChildren(props.children);
    setVisible(props.visible);
  }, [props.title, props.children, props.visible]);

  return (
    <Drawer
      title={title}
      placement="right"
      maskClosable={false}
      size={props.size || "default"}
      onClose={() => {
        setVisible(false);
        if (props.onClose) {
          props.onClose();
        }
      }}
      visible={visible}
      {...props.extraKeys}
    >
      {children}
    </Drawer>
  );
}
