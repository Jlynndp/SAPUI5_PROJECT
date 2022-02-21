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

            onBack: function() {


            },


            onSearchField: function (oEvent) {
                var aFilters = [];
                var sQuery = oEvent.getSource().getValue();

                if (sQuery && sQuery.length > 0) {
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
                    //bin employee data
                    this.getView().bindElement("employeeModel>" + sPath);

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
                //get employee Id
                var sapId = oEvent.getSource().getBindingContext("employeeModel").getProperty("SapId");
                var employeeId = oEvent.getSource().getBindingContext("employeeModel").getProperty("EmployeeId");

                var oJSONModel = new sap.ui.model.json.JSONModel({
                    SapId: sapId,
                    EmployeeId: employeeId
                });

                this.getView().setModel(oJSONModel, "Salary");

                //get selected controller
                //var iconPressed = oEvent.getSource();

                //context from the model
                //var oContext = oEvent.getSource().getBindingContext("employeeModel");
                //var oContext = iconPressed.getBindingContext("odataNorthwind");

                //get fragment instance
                if (!this._oDialogPromoteEmpl) {
                    this._oDialogPromoteEmpl = sap.ui.xmlfragment("logaligroup.sapui5app.fragment.DialogPromoteEmpl", this);
                    this.getView().addDependent(this._oDialogPromoteEmpl);
                };

                //dialog binding to the context to have access to the data of selected item
                // this._oDialogOrders.bindElement("jsonEmployees>" + oContext.getPath());
                //this._oDialogPromote.bindElement("employeeModel>" + oContext.getPath());
                this._oDialogPromoteEmpl.open();

            },

            onSavePromotion: function () {
                var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();

                //this._handleMessageBoxOpen(oResourceBundle.getText("msgCreateEmpl"), "confirm");

                //submit Employee: “/sap/opu/odata/sap/ZEMPLOYEES_SRV/Salaries”

                //get employee
                var salaryModel = this.getView().getModel("Salary").getData();
                var employeeModel = this.getView().getModel("employeeModel");

                var date = new Date(salaryModel.CreationDate);
                var creationDate = date.toJSON().slice(0, 19);

                //validate required fields

                //build create operation body
                var body = {
                    SapId: salaryModel.SapId,
                    EmployeeId: salaryModel.EmployeeId,
                    CreationDate: creationDate,
                    Amount: parseFloat(salaryModel.Amount).toString(),
                    Comments: salaryModel.Comments
                };

                //save promotion: get view/model/create_operation
                this.getView().getModel("employeeModel").create("/Salaries", body, {
                    success: function (data) {
                        sap.m.MessageToast.show(oResourceBundle.getText("msgPromotionOK"));
                        this._oDialogPromoteEmpl.close();
                        employeeModel.refresh();
                    }.bind(this),

                    error: function (e) {
                        sap.m.MessageToast.show(oResourceBundle.getText("oDataSaveKO"));
                    }.bind(this)
                });
            },

            onCancelPromotion: function () {
                this._oDialogPromoteEmpl.close();
            }


        });
    });