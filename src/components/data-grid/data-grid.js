import React, { useState } from 'react';
import { Button } from "react-bootstrap";

import "./data-grid.css";

const DataGrid = ({ columns, data, keyName, onChange }) => {
   const [ editMode, setEditMode ] = useState(false);
   const [ editModeRow, setEditModeRow ] = useState(null);

   const currencyFormatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
   });

   const handleRowClick = (row) => {
      return () => {
         setEditModeRow(row);
         setEditMode(true);
      }; 
   };

   const handleRowChange = (e) => {
      const { name, value } = e.target;
      setEditModeRow(prevState => ({
          ...prevState,
          [name]: value
      }));
  };

   const handleRowSave = () => {
      data = data.map((item) => {
         return (item.key === editModeRow.key ? editModeRow : item);
      });
      setEditMode(false);
      onChange(data);
   };

   const generateDisplayRow = (row) => {
      return (
         <tr key={row[keyName]} onClick={handleRowClick(row)}>
            {columns.map((column, index) => {
            if (column.type && column.type === "link") {
               return (<td key={column.key}><Button variant="link">{column.label}</Button></td>);
            } else if (column.type && column.type === "span") {
               return (<td key={column.key}>&nbsp;&nbsp;&nbsp;&nbsp;</td>);
            } else {
               let columnValue = row[column.key];
               columnValue = (column.format && column.format === "currency" ? currencyFormatter.format(columnValue) : columnValue);
               return (<td key={column.key}>{columnValue}</td>);
            }
         })}
      </tr>);
   };

   const generateEditRow = (row) => {
      return (
         <tr key={row[keyName]} onClick={handleRowClick(row)}>
            {columns.map((column, index) => {
            if (column.type && column.type === "link") {
               return (<td key={column.key}><Button variant="link" onClick={handleRowSave}>Save</Button></td>);
            } else if (column.type && column.type === "span") {
               return (<td key={column.key}>&nbsp;&nbsp;&nbsp;&nbsp;</td>);
            } else {
               let columnValue = row[column.key];
               if (column.editable && column.editable === true) {
                  return (
                     <td key={column.key}>
                        <input type="text"
                           name={column.key}
                           value={editModeRow[column.key]}
                           onChange={handleRowChange}
                        />
                     </td>
                  );
               } else {
                  columnValue = (column.format && column.format === "currency" ? currencyFormatter.format(columnValue) : columnValue);
                  return (<td key={column.key}>{columnValue}</td>);
               }
            }
         })}
      </tr>);
   };

   return (
      <div className="scroll-box">
         <table className="data-grid">
            <thead>
               <tr>
                  {columns.map((column) => (
                     <th key={column.key}>{column.label}</th>
                  ))}
               </tr>
            </thead>
            <tbody>
               {data.map((row) => {
                  if (editMode && row.key === editModeRow.key) {
                     return generateEditRow(row);
                  } else {
                     return generateDisplayRow(row);
                  }
               })}
            </tbody>
         </table>
      </div>
   );
};

export default DataGrid;