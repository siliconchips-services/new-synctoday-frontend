import React from 'react';

import { useStyle } from '@/config/Config';
import { Table } from 'antd';

interface ListingProps {
  data: any[];
  columns: any[];
  tableLoading: boolean;
  [key: string]: any;
}

const CommonTable: React.FC<ListingProps> = (props) => {
  const { data, columns, tableLoading, ...rest } = props;
  const { styles } = useStyle();

  return (
    <>
      <Table
        className={styles.customTable}
        dataSource={data}
        columns={columns}
        pagination={false}
        loading={tableLoading}
        scroll={{ x: 'max-content', y: 100 * 5 }}
        {...rest}
      />
    </>
  );
};

export default CommonTable;
