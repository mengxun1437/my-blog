import { Table } from "antd";
import React, { useEffect, useState } from "react";

export interface CustomTableProps {
  columns: any[];
  dataSource: any[];
  pagination?: any;
  style?: React.CSSProperties;
  extraKeys?: any;
}

export function CustomTable(props: CustomTableProps) {
  const [dataSources, setDataSources] = useState(props.dataSource);
  const [pagination, setPagination] = useState(props.pagination);

  useEffect(() => {
    setDataSources(props.dataSource);
    setPagination(props.pagination);
  }, [props]);

  return (
    <React.Fragment>
      <Table
        columns={props.columns}
        dataSource={dataSources}
        pagination={pagination}
        style={props.style}
        {...props.extraKeys}
      />
    </React.Fragment>
  );
}
