import React from "react";
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    CardBody,
    Card
} from "reactstrap";
import { AgGridReact } from "ag-grid-react";
import { LicenseManager } from "ag-grid-enterprise";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
//import { AllModules } from "@ag-grid-enterprise/all-modules";
import ChildMessageRenderer from "./ChildMessageRenderer";
import "./styles.css";
import("../node_modules/ag-grid-community/src/styles/ag-grid.scss");
import("../node_modules/ag-grid-community/src/styles/ag-theme-balham/sass/ag-theme-balham.scss");
LicenseManager.setLicenseKey("<enterprisekey>");

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            columnDefs: [
                {
                    field: "athlete",
                    cellRenderer: "agGroupCellRenderer",
                    headerCheckboxSelection: true,
                    headerCheckboxSelectionFilteredOnly: true,
                    checkboxSelection: true
                },
                { field: "age" },
                { field: "calls" },
                {
                    field: "country"
                },
                {
                    field: "year"
                },
                {
                    field: "date"
                },
                {
                    field: "sport"
                },
                {
                    field: "gold"
                },
                {
                    field: "silver"
                },
                {
                    field: "bronze"
                },
                {
                    field: "total"
                },
                {
                    headerName: "Child/Parent",
                    field: "button",
                    cellRenderer: "childMessageRenderer",
                    colId: "params",
                    width: 180
                }
            ],
            defaultColDef: {
                enableValue: true,
                enableRowGroup: true,
                enablePivot: true,
                sortable: true,
                /*filter: true,
                checkboxSelection: true,*/
                filter: "agTextColumnFilter",
                editable: true,
                resizable: true
            },
            detailCellRendererParams: {
                detailGridOptions: {
                    columnDefs: [
                        { field: "callId" },
                        { field: "direction" },
                        { field: "number" },
                        {
                            field: "duration",
                            valueFormatter: "x.toLocaleString() + 's'"
                        },
                        { field: "switchCode" }
                    ],
                    defaultColDef: {
                        enableValue: true,
                        enablePivot: true,
                        sortable: true,
                        filter: "agTextColumnFilter",
                        /*filter: true,
                        checkboxSelection: true,
                        filter: "agTextColumnFilter",*/
                        resizable: true
                    }
                },
                getDetailRowData: function (params) {
                    params.data.callRecords = [
                        {
                            callId: Math.random() * 100,
                            direction: 'LEFT',
                            number: Math.random() * 100,
                            switchCode: Math.random(),
                            duration: Math.random()

                        },
                        {
                            callId: Math.random() * 1000,
                            direction: 'RIGHT',
                            number: Math.random() * 1000,
                            switchCode: Math.random(),
                            duration: Math.random()

                        }
                    ]
                    params.successCallback(params.data.callRecords);
                },
                template:
                    '<div style="height: 100%; background-color: #edf6ff; padding: 20px; box-sizing: border-box;">' +
                    '  <div style="height: 10%;">Call Details</div>' +
                    '  <div ref="eDetailGrid" style="height: 90%;"></div>' +
                    "</div>"
            },
            rowData: [],
            rowHeight: 50,
            excelStyles: [
                {
                    id: "indent-1",
                    alignment: { indent: 1 },
                    dataType: "string"
                }
            ],
            searchResult: null,
            sideBar: {
                toolPanels: [
                    "columns",
                    {
                        id: "filters",
                        labelKey: "filters",
                        labelDefault: "Filters",
                        iconKey: "menu",
                        toolPanel: "agFiltersToolPanel"
                    }
                ],
                defaultToolPanel: ""
            },
            context: { componentParent: this },
            frameworkComponents: {
                childMessageRenderer: ChildMessageRenderer
            },
            indexRow: null
        };
    }

    componentDidMount() {
        fetch(
            "https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/olympicWinners.json"
        )
            .then(result => result.json())
            .then(rowData => this.setState({ rowData }));
    }

    toggleModal = () => {
        this.setState({ modal: !this.state.modal });
    };

    // Export Exel
    onBtnExportDataAsExcel = () => {
        this.gridApi.exportDataAsExcel();
    };

    // Expand row and apper another table
    onFirstDataRendered = params => {
        params.api.sizeColumnsToFit();
    };

    // general search
    onQuickFilterChanged = () => {
        this.gridApi.setQuickFilter(document.getElementById("quickFilter").value);
    };

    // clear filters
    clearFilters = () => {
        this.gridApi.setFilterModel(null);
        this.gridApi.onFilterChanged();
    };

    methodFromParent = index => {
        this.toggleModal();
        this.setState({
            indexRow: index
        });
    };

    render() {
        console.log(this.gridApi);
        return (
            <>
                {/* Modal */}
                <Modal isOpen={this.state.modal} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}>Modal title</ModalHeader>
                    <ModalBody>
                        <Card>
                            <CardBody>{this.state.indexRow}</CardBody>
                        </Card>
                    </ModalBody>
                </Modal>
                <div className="data-table">
                    <div style={{ marginBottom: "30px" }}>
                        <label> Search : </label>
                        <input
                            type="text"
                            onInput={this.onQuickFilterChanged}
                            id="quickFilter"
                            placeholder="Quick filter..."
                        />
                    </div>
                    <div style={{ margin: "30px 0" }}>
                        <button onClick={this.onBtnExportDataAsExcel}>Export Data</button>
                        <input
                            type="file"
                            onChange={this.fileHandler}
                            ref={this.fileInput}
                            onClick={event => {
                                event.target.value = null;
                            }}
                            style={{ padding: "10px" }}
                        />
                        <button onClick={this.clearFilters}>Clear Filters</button>
                    </div>

                    <div
                        id="myGrid"
                        className="ag-theme-balham"
                        style={{ height: "500px", width: "100%" }}
                    >
                        <AgGridReact
                            onGridReady={params => (this.gridApi = params.api)}
                            rowSelection="multiple"
                            columnDefs={this.state.columnDefs}
                            defaultColDef={this.state.defaultColDef}
                            sideBar={this.state.sideBar}
                            groupSelectsChildren={true}
                            pagination={true}
                            paginationPageSize={this.state.paginationPageSize}
                            paginateChildRows={true}
                            autoGroupColumnDef={this.state.autoGroupColumnDef}
                            rowData={this.state.rowData}
                            excelStyles={this.state.excelStyles}
                            masterDetail={true}
                            onFirstDataRendered={this.onFirstDataRendered}
                            detailCellRendererParams={this.state.detailCellRendererParams}
                            floatingFilter={true}
                            cacheQuickFilter={true}
                            isExternalFilterPresent={this.isExternalFilterPresent}
                            doesExternalFilterPass={this.doesExternalFilterPass}
                            suppressMenuHide={true}
                            frameworkComponents={this.state.frameworkComponents}
                            context={this.state.context}
                            rowHeight={this.state.rowHeight}
                        />
                    </div>
                </div>
            </>
        );
    }
}
