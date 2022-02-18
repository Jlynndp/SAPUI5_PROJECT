sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
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
     */
function (JSONModel, Controller, Filter, FilterOperator, Sorter, MessageBox) {
	"use strict";


        return Controller.extend("logaligroup.sapui5app.controller.ShowEmployee", {
            onInit: function () {
            //config data view properties
            //var oJSONModelConfig = new sap.ui.model.json.JSONModel({});
            //this.getView().setModel(oJSONModelConfig, "jsonModelConfig");


                // this.oRouter = this.getOwnerComponent().getRouter();
                // this._bDescendingSort = false;
                this._bus = sap.ui.getCore().getEventBus();
                //this.getView().getModel("jsonModelConfig").setProperty("/textInit", true);
            },

            onSearch: function (oEvent) {
                // var oTableSearchState = [],
                //     sQuery = oEvent.getParameter("query");
    
                // if (sQuery && sQuery.length > 0) {
                //     oTableSearchState = [new Filter("Name", FilterOperator.Contains, sQuery)];
                // }
    
                // this.getView().byId("productsTable").getBinding("items").filter(oTableSearchState, "Application");
            },
    
            onPressNavToDetail: function(oEvent){
                var path = oEvent.getSource().getBindingContext("employeeModel").getPath();
                if (path) {
                    //this.getView().getModel("jsonModelConfig").setProperty("/textInit", false);

                    //bin employee data
                    this.getView().bindElement("employeeModel>" + path);

                    //bind attachments data

                    //bind salary data

                    this.byId("SplitAppEmployee").to(this.createId("employeeDetail"));
                }

                
            }


        });
    });