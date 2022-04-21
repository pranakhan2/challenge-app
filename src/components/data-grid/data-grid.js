import React, { useState } from 'react';
import { Button } from "react-bootstrap";

import "./data-grid.css";

const DataGrid = ({ columns, data, keyName }) => {
  
   const currencyFormatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
   });

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
                  return (<tr key={row[keyName]}>
                     {columns.map((column) => {
                        if (column.type && column.type === "link") {
                           return (<td key={column.key}><Button variant="link">{column.label}</Button></td>);
                        } else {
                           let columnValue = row[column.key];
                           columnValue = (column.format && column.format === "currency" ? currencyFormatter.format(columnValue) : columnValue);
                           return (<td key={column.key}>{columnValue}</td>);
                        }
                     })}
                  </tr>);
               })}
            </tbody>
         </table>
      </div>
   );
};

export default DataGrid;