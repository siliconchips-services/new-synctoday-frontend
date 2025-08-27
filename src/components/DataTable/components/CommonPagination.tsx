import React from 'react';

import { Pagination } from 'antd';
import { PaginationProps } from 'antd/lib';
import { CONSTANT } from '@/config/Constant';

interface PagingTypesProps<T = any> {
  totalData: number;
  payloadData: T;
  setPayloadData: React.Dispatch<React.SetStateAction<T>>;
  paginationData: T;
  setPaginationData: React.Dispatch<React.SetStateAction<T>>;
  getListFunc?: (params?: { current: number; pageSize: number }) => void;
  [key: string]: any;
}

const CommonPagination: React.FC<PagingTypesProps> = (props) => {
  const {
    totalData,
    payloadData,
    setPayloadData,
    paginationData,
    setPaginationData,
    getListFunc,
    ...rest
  } = props;

  const handlePageChange: PaginationProps['onChange'] = (current, pageSize) => {
    const updatedPagination = {
      current: current ?? paginationData?.current,
      pageSize: pageSize ?? paginationData?.pageSize,
    };
    setPaginationData(updatedPagination);

    setPayloadData({ ...payloadData, ...updatedPagination });

    getListFunc({ ...payloadData, ...updatedPagination });
  };

  return (
    <>
      {/* {totalData && totalData > 20 ? ( */}
      <div className="d-flex justify-content-end align-items-center mv-20">
        <Pagination
          defaultCurrent={1}
          total={totalData ?? 0}
          showSizeChanger={totalData > 0 ? true : false}
          showTotal={(total, range) => (
            <>
              <strong>
                {range[0]}-{range[1]}
              </strong>{' '}
              of total <strong>{total} items</strong>
            </>
          )}
          current={paginationData?.current}
          pageSize={paginationData?.pageSize}
          onChange={handlePageChange}
          responsive={true}
          pageSizeOptions={CONSTANT.PER_PAGE_RECORD}
          {...rest}
        />
      </div>
      {/* ) : null} */}
    </>
  );
};

export default CommonPagination;
