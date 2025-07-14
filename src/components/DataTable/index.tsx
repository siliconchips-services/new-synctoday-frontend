import React from 'react';
import CommonTable from './components/CommonTable';
import CommonPagination from './components/CommonPagination';

interface ListingProps<T = any> {
  data: any[];
  columns: any[];
  payloadData?: T;
  setPayloadData?: React.Dispatch<React.SetStateAction<T>>;
  paginationData?: T;
  setPaginationData?: React.Dispatch<React.SetStateAction<T>>;
  tableLoading?: boolean;
  totalData?: number;
  getListFunc?: (params?: { current: number; pageSize: number }) => void;
  [key: string]: any;
}

const DataTable: React.FC<ListingProps> = (props) => {
  const {
    data,
    columns,
    tableLoading,
    totalData,
    payloadData,
    setPayloadData,
    paginationData,
    setPaginationData,
    getListFunc,
    ...rest
  } = props;

  return (
    <>
      <CommonTable
        data={data}
        columns={columns}
        tableLoading={tableLoading}
        {...rest}
      />
      {totalData > paginationData?.pageSize && (
        <CommonPagination
          totalData={totalData}
          payloadData={payloadData}
          setPayloadData={setPayloadData}
          paginationData={paginationData}
          setPaginationData={setPaginationData}
          getListFunc={getListFunc}
          {...rest}
        />
      )}
    </>
  );
};

export default DataTable;
