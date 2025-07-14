import React, { forwardRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

interface DataGridProps {
  columnDefs: any[];
  rowData: any[];
  pagination?: boolean;
  pageSize?: number;
  height?: number;
}

const DataGrid = forwardRef<AgGridReact, DataGridProps>(
  (
    { columnDefs, rowData, pagination = true, pageSize = 10, height = 500 },
    ref,
  ) => {
    return (
      <div className="ag-theme-alpine" style={{ height, width: '100%' }}>
        <AgGridReact
          ref={ref}
          columnDefs={columnDefs}
          rowData={rowData}
          pagination={pagination}
          paginationPageSize={pageSize}
        />
      </div>
    );
  },
);

export default DataGrid;
