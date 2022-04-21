import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Navbar, Nav, Dropdown, Button } from "react-bootstrap";
import DataGrid from "./components/data-grid/data-grid";
import DataFilter from "./components/data-filter/data-filter";
import moment from "moment";

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
   const [mockedData, setMockedData] = useState([]);
   const [filteredData, setFilteredData] = useState([]);
   const [summaryGridData, setSummaryGridData] = useState([]);
   
   const dataGridColumns = [
      { label: "View", key: "view", type: "link" },
      { label: "Title", key: "title", type: "string" },
      { label: "Division", key: "division", type: "string" },
      { label: "Project Owner", key: "project_owner", editable: true, type: "string" },
      { label: "Budget", key: "budget", format: "currency", editable: true, type: "number" },
      { label: "Status", key: "status", editable: true, type: "string" },
      { label: "Created", key: "created", type: "date" },
      { label: "Modified", key: "modified", type: "date"},
   ];

   const summaryGridColumns = [
      { label: "Total Projects", key: "total_projects", type: "string" },
      { label: "", key: "s1", type: "span" },
      { label: "", key: "s2", type: "span" },
      { label: "", key: "s3", type: "span" },
      { label: "Budget", key: "budget_total", format: "currency", type: "number" },
      { label: "", key: "s4", type: "span" },
      { label: "", key: "s5", type: "span" },
      { label: "", key: "s6", type: "span" },
   ];
   
   const fetchMockedData = () => {
      fetch('/mocked-data.json')
         .then(response => {
            if (!response.ok) {
               throw new Error("HTTP error " + response.status);
            }
            return response.json();
         })
         .then(json => {
            // add a unique key to each object in the mocked data,
            // convert date strings to real Date objects for later
            const indexedData = json.map((item, index) => {
               item.key = `${item.title}-${index}`;
               return item;
            });
            setMockedData(indexedData);
            setFilteredData(indexedData);
            setSummaryGridData(calculateSummaryGridData(indexedData));
         })
         .catch(function (e) {
            console.log("Error loading mocked data", e);
         });
   };

   useEffect(fetchMockedData, []);

   const calculateSummaryGridData = (data) => {
      //calculate summary grid data
      return [{
         total_projects: data.length,
         budget_total: data.reduce(function(sum, project) {
            return sum + project.budget;
          }, 0)
      }];
   };

   const onFilterChangeHandler = (filters) => {
      let data = [...mockedData];

      filters.map((filter, index) => {
         data = data.filter((project) => {
            if (filter.type !== "date") {
               return project[filter.key].includes(filter.value);
            } else {
               return moment(project[filter.key], "MM/DD/YYYY").isBetween(filter.startDate, filter.endDate);
            }
         });
      });

      setFilteredData(data);
      setSummaryGridData(calculateSummaryGridData(data));
   };
   
   return (
      <div className="App">
         <Container>
            <Container>
               <Navbar bg="light" expand="lg" className="main-toolbar">
                  <Navbar.Brand href="#home">Project Dashboard</Navbar.Brand>
                  <Navbar.Toggle aria-controls="basic-navbar-nav" />
                  <Nav.Link href="#home"><Button>Create Project...</Button></Nav.Link>
                  <Dropdown>
                     <Dropdown.Toggle variant="success" id="dropdown-basic">
                        Export Data
                     </Dropdown.Toggle>

                     <Dropdown.Menu>
                        <Dropdown.Item href="#/action-1">PDF</Dropdown.Item>
                        <Dropdown.Item href="#/action-2">Excel</Dropdown.Item>
                     </Dropdown.Menu>
                  </Dropdown>
               </Navbar>
            </Container>
            <Row className="filter-section">
               <Col>
                  <DataFilter 
                     columns={dataGridColumns}
                     onChange={onFilterChangeHandler}
                  />
               </Col>
            </Row>
            <Row>
               <Col>
                  <DataGrid
                     keyName="key"
                     columns={dataGridColumns}
                     data={filteredData}
                  />
               </Col>
            </Row>
            <Row>
               <Col>
                  <DataGrid
                     keyName="key"
                     columns={summaryGridColumns}
                     data={summaryGridData}
                  />
               </Col>
            </Row>
         </Container>
      </div>
   );
}

export default App;
