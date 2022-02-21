sap.ui.define([
    'sap/ui/model/json/JSONModel',
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator',
    'sap/m/MessageBox',
    "sap/m/MessageToast"
],

    /**
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.ui.model.Filter} Filter
     * @param {typeof sap.ui.model.FilterOperator} FilterOperator
     * @param {typeof sap.m.MessageBox} MessageBox
     * @param {typeof sap.m.MessageToast} MessageToast
     */
    function (JSONModel, Controller, Filter, FilterOperator, MessageBox, MessageToast) {
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

                this._splitAppEmployee = this.byId("SplitAppEmployee");
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

                    // //bind files
                    // this.byId("UploadCollection").bindAggregation("items", {
                    //     path: "employeeModel>/Attachments",
                    //     filters: [
                    //         new Filter("SapId", FilterOperator.EQ, oContext.getProperty("SapId")),
                    //         new Filter("EmployeeId", FilterOperator.EQ, oContext.getProperty("EmployeeId")),
                    //     ],
                    //     template: new sap.m.UploadCollectionItem({
                    //         documentId: "{employeeModel>AttId}",
                    //         visibleEdit: false,
                    //         fileName: "{employeeModel>DocName}"
                    //     }).attachPress(this.downloadFile)
                    // });

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

                    //bind employee detail
                    this._splitAppEmployee.to(this.createId("employeeDetail"));
                } else {
                    this._splitAppEmployee.to(this.createId("detailSelectEmpl"));
                }
            },

            onFileBeforeUpload: function (oEvent) {
                var fileName = oEvent.getParameter("fileName");
                var sapId = oEvent.getSource().getBindingContext("employeeModel").getProperty("SapId");
                var employeeId = oEvent.getSource().getBindingContext("employeeModel").getProperty("EmployeeId");

                //slug: header parameter allow send key values for the file
                var oCustomerHeaderSlug = new sap.m.UploadCollectionParameter({
                    name: "slug",
                    value: sapId + ";" + employeeId + ";" + fileName
                });

                //add slug parameter to previous parameters of the media object
                oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);

                // setTimeout(function () {
                //     new sap.m.MessageToast.show("Event beforeUploadStarts triggered");
                // }, 4000);
                // oUploadCollection.getBinding("items").refresh();
            },

            //update token every time files change
            onFileChange: function (oEvent) {
                //add csrf-token parameter
                var oUploadCollection = oEvent.getSource();
                var oCustomerHeaderToken = new sap.m.UploadCollectionParameter({
                    name: "x-csrf-token",
                    value: this.getView().getModel("employeeModel").getSecurityToken()
                });
                oUploadCollection.addHeaderParameter(oCustomerHeaderToken);
                //oEvent.getSource().getBinding("items").refresh();
            },

            //update collection after a new file has been uploaded
            onFileUploadComplete: function (oEvent) {
                oEvent.getSource().getBinding("items").refresh();
                // if (uploadCollection.getItems().length > 0) {

                //     //uploadCollection.upload();
                // };
                // oUploadCollection.getBinding("items").refresh();
            },

            //delete files in sap-system
            onFileDeleted: function (oEvent) {
                var oUploadCollection = oEvent.getSource();

                //route to be deleted
                var sPath = oEvent.getParameter("item").getBindingContext("employeeModel").getPath();
                this.getView().getModel("employeeModel").remove(sPath, {
                    success: function () {
                        oUploadCollection.getBinding("items").refresh();
                    },
                    error: function () {
                    }
                });
            },

            //download selected file
            downloadFile: function (oEvent) {
                const sPath = oEvent.getSource().getBindingContext("employeeModel").getPath();
                window.open("/sap/opu/odata/sap/ZEMPLOYEES_SRV" + sPath + "/$value");
            },

            //delete employee in User entity
            onDeleteEmployee: function (oEvent) {
                //get context object
                var oContext = oEvent.getSource().getBindingContext("employeeModel");
                var sPath = oContext.getPath();

                // var sapId = oContext.getProperty("SapId");
                // var employeeId = oContext.getProperty("EmployeeId");

                var employeeModel = this.getView().getModel("employeeModel");
                var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();

                MessageBox.confirm(oResourceBundle.getText("msgDeleteEmpl"), {
                    actions: [sap.m.MessageBox.Action.OK, MessageBox.Action.CLOSE],
                    emphasizedAction: sap.m.MessageBox.Action.OK,
                    onClose: function (sAction) {
                        if (sAction === MessageBox.Action.OK) {
                            //delete user
                            //call odata delete service. Key: IncidenceId='xxx',SapId='xxx',EmployeeId='xxx')",
                            employeeModel.remove(sPath, {
                                success: function () {
                                    //update model
                                    //employeeModel.refresh();
                                    //confirmation message
                                    MessageToast.show(oResourceBundle.getText("msgEmplDeleted"));
                                    this._splitAppEmployee.to(this.createId("detailSelectEmpl"));

                                }.bind(this),

                                error: function (e) {
                                    sap.m.MessageToast.show(oResourceBundle.getText("oDataDeleteKO"));
                                }.bind(this)
                            });

                            //go back to main screen (refresh model)                                   
                            // this.onPressNavToDetail();
                            
                        }
                    }.bind(this)
                });
                
            },


            //add new Salary entity
            onPromoteEmployee: function (oEvent) {

            }

            // //confirmation message
            // _handleMessageBoxOpen: function (sMessage, sMessageBoxType) {
            //     MessageBox[sMessageBoxType](sMessage, {
            //         actions: [MessageBox.Action.YES, MessageBox.Action.NO],
            //         onClose: function (oAction) {
            //             if (oAction === MessageBox.Action.YES) {
            //                 this._handleNavigationToStep(0);
            //                 this._wizard.invalidateStep(this.byId("EmployeeTypeStep"));
            //                 this._wizard.discardProgress(this._wizard.getSteps()[0]);
            //             }
            //         }.bind(this)
            //     });
            // },


        });
    });