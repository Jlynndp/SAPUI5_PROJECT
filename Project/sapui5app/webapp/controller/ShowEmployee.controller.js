sap.ui.define([
    'sap/ui/model/json/JSONModel',
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator',
    'sap/ui/model/Sorter',
    'sap/m/MessageBox'
],


    /**
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.ui.model.Filter} Filter
     * @param {typeof sap.ui.model.FilterOperator} FilterOperator
     * @param {typeof sap.ui.model.Sorter} Sorter
     * @param {typeof sap.m.MessageBox} MessageBox
     * @param {typeof sap.suite.ui.commons.Timeline} Timeline
     */
    function (JSONModel, Controller, Filter, FilterOperator, Sorter, MessageBox) {
        "use strict";


        return Controller.extend("logaligroup.sapui5app.controller.ShowEmployee", {
            onInit: function () {
                //config data view properties
                var oJSONModel = new sap.ui.model.json.JSONModel([]);
                this.getView().setModel(oJSONModel);


                // this.oRouter = this.getOwnerComponent().getRouter();
                // this._bDescendingSort = false;
                this._bus = sap.ui.getCore().getEventBus();
                //this.getView().getModel("jsonModelConfig").setProperty("/textInit", true);
            },

            onSearchField: function (oEvent) {
                // var oTableSearchState = [],
                //     sQuery = oEvent.getParameter("query");

                // if (sQuery && sQuery.length > 0) {
                //     oTableSearchState = [new Filter("Name", FilterOperator.Contains, sQuery)];
                // }

                // this.getView().byId("productsTable").getBinding("items").filter(oTableSearchState, "Application");

                //var oJSONData = this.getView().getModel("employeeModel").getData();
                var aFilters = [];

                var sQuery = oEvent.getSource().getValue();

                if (sQuery && sQuery.length > 0) {
                    // var filter1 = new Filter({
                    //     path: "FirstName", 
                    //     operator: FilterOperator.Contains, 
                    //     value1: sQuery

                    // });
                    // aFilters.push(filter1);

                    // var filter2 = new Filter("LastName", FilterOperator.Contains, sQuery);
                    // aFilters.push(filter2);

                    // var filter3 = new Filter("Dni", FilterOperator.Contains, sQuery);
                    // aFilters.push(filter3);

                    aFilters = new Filter({
                        filters: [
                            new Filter({
                                path: 'FirstName',
                                operator: FilterOperator.Contains,
                                value1: sQuery
                            }),
                            new Filter({
                                path: 'LastName',
                                operator: FilterOperator.Contains,
                                value1: sQuery
                            }),
                            new Filter({
                                path: 'Dni',
                                operator: FilterOperator.Contains,
                                value1: sQuery
                            })
                        ],
                        and: false
                    })
                }



                // update list binding
                var oList = this.byId("employeeList");
                var oBinding = oList.getBinding("items");
                oBinding.filter(aFilters, "Application");


            },

            onPressNavToDetail: function (oEvent) {
                var oContext = oEvent.getSource().getBindingContext("employeeModel");
                var sPath = oContext.getPath();

                if (sPath) {
                    //this.getView().getModel("jsonModelConfig").setProperty("/textInit", false);

                    //bin employee data
                    this.getView().bindElement("employeeModel>" + sPath);

                    //bind files
                    this.byId("UploadCollection").bindAggregation("items", {
                        path: "employeeModel>/Attachments",
                        filters: [
                            new Filter("SapId", FilterOperator.EQ, oContext.getProperty("SapId")),
                            new Filter("EmployeeId", FilterOperator.EQ, oContext.getProperty("EmployeeId")),
                        ],
                        template: new sap.m.UploadCollectionItem({
                            documentId: "{employeeModel>AttId}",
                            visibleEdit: false,
                            fileName: "{employeeModel>DocName}"
                        }).attachPress(this.downloadFile)
                    });

                    var employeeIcon = "";
                    switch (oContext.getProperty("Type")) {
                        case '0':
                            employeeIcon = "sap-icon://employee-pane";
                            break;
                        case '1':
                            employeeIcon = "sap-icon://employee";
                            break;
                        case '2':
                            employeeIcon = "sap-icon://leads";
                            break;
                        default:
                            break;
                    };
                    this.getView().getModel().setProperty("/_iconType", employeeIcon);


                    //bind salary data
                    //let tlItem = this.byId("idTemplateItem").clone();
                    this.byId("idTimeline").bindAggregation("content", {
                        path: "employeeModel>/Salaries",
                        filters: [
                            new Filter("SapId", FilterOperator.EQ, oContext.getProperty("SapId")),
                            new Filter("EmployeeId", FilterOperator.EQ, oContext.getProperty("EmployeeId")),
                        ],
                        template: new sap.suite.ui.commons.TimelineItem({
                            dateTime = "{employeeModel>CreationDate}",
                            title = "{employeeModel>Amount}",
                            text = "{employeeModel>Comments}"
                        })
                    });

                    // var sSelectedItem = oEvent.getParameter("selected"),
                    //     filter = null,
                    //     aSelectedDataItems = [];
                    // if (sSelectedItem) {
                    //     filter = new Filter({
                    //         path: "FirstName",
                    //         value1: "Nancy",
                    //         operator: FilterOperator.EQ
                    //     });
                    //     aSelectedDataItems = ["Nancy"];
                    // }
                    // this.byId("idTimeline").setModelFilter({
                    //     type: TimelineFilterType.Data,
                    //     filter: [
                    //         new Filter("SapId", FilterOperator.EQ, oContext.getProperty("SapId")),
                    //         new Filter("EmployeeId", FilterOperator.EQ, oContext.getProperty("EmployeeId")),
                    //     ]
                    // });
                    //this.byId("idTimeline").setCurrentFilter(aSelectedDataItems);


                    //bind employee detail
                    this.byId("SplitAppEmployee").to(this.createId("employeeDetail"));
                }


            },

            downloadFile: function (oEvent) {
                const sPath = oEvent.getSource().getBindingContext("employeeModel").getPath();
                window.open("/sap/opu/odata/sap/ZEMPLOYEES_SRV" + sPath + "/$value");
            }


        });
    });