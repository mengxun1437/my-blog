import { Modal } from "antd";
import React, { useEffect, useState } from "react";

export interface CustomModalProps {
  title?: string;
  visible?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onOk?: () => void;
  onCancel?: () => void;
  extraKeys?: any;
}

export function CustomModal(props: CustomModalProps) {
  const [title, setTitle] = useState(props.title);
  const [visible, setVisible] = useState(props.visible);
  const [children, setChildren] = useState(props.children);

  useEffect(() => {
    setTitle(props.title);
    setChildren(props.children);
    setVisible(props.visible);
  }, [props.title, props.children, props.visible]);

  return (
    <Modal
      title={title}
      style={{ top: 20, ...props.style }}
      visible={visible}
      maskClosable={false}
      onOk={() => {
        setVisible(false);
        if (props.onOk) {
          props.onOk();
        }
      }}
      onCancel={() => {
        setVisible(false);
        if (props.onCancel) {
          props.onCancel();
        }
      }}
    >
      {children}
    </Modal>
  );
}
