import React, { useState } from "react";
import { Container, Row, Col, Dropdown, Button } from "react-bootstrap";
import DatePicker from "react-datepicker";
import moment from "moment";


import "./data-filter.css";
import "react-datepicker/dist/react-datepicker.css";

const DataFilter = ({ columns, onChange }) => {
   const [ enabledFilters, setEnabledFilters ] = useState([]);
   const [ addFilterButtonEnabled, setAddFilterButtonEnabled ] = useState(true);
   const [ showDatePickers, setShowDatePickers ] = useState(false);
   const [ showStringInput, setShowStringInput ] = useState(false);
   const [ resetColumnPicker, setResetColumnPicker ] = useState(false);
   const [ stringInputValue, setStringInputValue ] = useState("");
   const [ startDateValue, setStartDateValue ] = useState(null);
   const [ endDateValue, setEndDateValue ] = useState(null);
   const [ selectedColumn, setSelectedColumn ] = useState({});

   const onColumnPickerSelect = (selectedColumn) => {
      // we recieve the column.label that was selected
      //console.log("Column selected: ", selectedColumn);

      // clear old state values
      setStringInputValue("");
      setStartDateValue(null);
      setEndDateValue(null);

      // we lookup the column type from the columns array
      const column = columns.find(column => column.label === selectedColumn);

      setSelectedColumn(column);

      if (column.type === "date") {
         setShowDatePickers(true)
         setShowStringInput(false);
      } else {
         setShowDatePickers(false)
         setShowStringInput(true);
      }
   };

   const resetFilterSelector = () => {
      setResetColumnPicker(true);
      setShowDatePickers(false);
      setShowStringInput(false);
   };

   const ColumnPicker = ({columns, onColumnSelected, doReset }) => {
      const defaultDropdownCaption = "Select Filter Column";
      const [ dropdownCaption, setDropdownCaption ] = useState(defaultDropdownCaption)

      const columnSelected = (column) => {
         setDropdownCaption(column);
         onColumnSelected(column);
      };

      const onReset = () => {
         setDropdownCaption(defaultDropdownCaption);
      }

      return (
         <Dropdown onSelect={columnSelected}>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
               {dropdownCaption}
            </Dropdown.Toggle>

            <Dropdown.Menu>
               {columns.map((column) => {
                  if (column.type && column.type !== "link") {
                     return (<Dropdown.Item key={column.label} eventKey={column.label}>{column.label}</Dropdown.Item>);
                  } else {
                     return "";
                  }
               })}
            </Dropdown.Menu>
         </Dropdown>
      );
   };

   const onAddFilterClick = () => {
      const newFilter = {
         key: selectedColumn.key,
         label: selectedColumn.label,
         type: selectedColumn.type,
         value: stringInputValue,
         startDate: startDateValue,
         endDate: endDateValue,
      };

      const filters = [...enabledFilters];
      filters.push(newFilter);
      setEnabledFilters(filters);
      onChange(filters);
   };

   const removeFilter = (filter) => {
      return () => {
         const filters = enabledFilters.filter((f) => { 
            return f !== filter;
         });
         setEnabledFilters(filters);
         onChange(filters);
      };
   };

   return (
      <Container>
         <Row>
            <Col className="button-adjust">
               <ColumnPicker 
                  columns={columns} 
                  onColumnSelected={onColumnPickerSelect}
                  doReset={resetColumnPicker}/>
            </Col>
            <Col>
               { showStringInput ? (
                  <div>
                     <label htmlFor="string-input">Value:</label>
                     <input id="string-input" 
                        type="text" 
                        className="string-input"
                        value={stringInputValue}
                        onChange={e => setStringInputValue(e.target.value)} />
                  </div>
               ) : "" }
            </Col>
            <Col>
               { showDatePickers ? (
                  <div>
                     <label htmlFor="start-date-input">Start Date:</label>
                     <DatePicker 
                        id="start-date-input"
                        selected={startDateValue}
                        onChange={date => setStartDateValue(date)}
                     />
                  </div>
               ) : "" }
            </Col>
            <Col>
            { showDatePickers ? (
                  <div>
                     <label htmlFor="end-date-input">End Date:</label>
                     <DatePicker 
                        id="end-date-input" 
                        selected={endDateValue}
                        onChange={date => setEndDateValue(date)}
                     />
                  </div>
               ) : "" }
            </Col>
            <Col className="button-adjust">
               <Button disabled={!addFilterButtonEnabled} onClick={onAddFilterClick}>Add Filter</Button>
            </Col>
         </Row>
         {enabledFilters.map((filter, index) => {
            const filterKey = `${filter.key}-${index}`;
            return (
               <Row className="active-filter-row" key={filterKey}>
               <Col>
                  Selected Field: <b>{filter.label}</b>
               </Col>
               {filter.type !== "date" ? 
                  (<Col>
                     Value: <b>{filter.value}</b>
                  </Col>)
               : (
                  <Col>
                     Date Range: 
                        <b>{`${moment(filter.startDate).format("MM/DD/YYYY")} -> ${moment(filter.endDate).format("MM/DD/YYYY")}`}</b>
                  </Col>
               )}
               <Col>
                  <Button onClick={removeFilter(filter)}>Remove Filter</Button>
               </Col>
            </Row>
            );
         })}


      </Container>
   );
};

export default DataFilter;