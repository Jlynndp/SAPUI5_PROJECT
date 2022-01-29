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
                this.oRouter = this.getOwnerComponent().getRouter();
                this._bDescendingSort = false;
            },
            onListItemPress: function (oEvent) {
                var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(1),
                    productPath = oEvent.getSource().getBindingContext("products").getPath(),
                    product = productPath.split("/").slice(-1).pop();
    
                this.oRouter.navTo("detail", {layout: oNextUIState.layout, product: product});
            },
            onSearch: function (oEvent) {
                var oTableSearchState = [],
                    sQuery = oEvent.getParameter("query");
    
                if (sQuery && sQuery.length > 0) {
                    oTableSearchState = [new Filter("Name", FilterOperator.Contains, sQuery)];
                }
    
                this.getView().byId("productsTable").getBinding("items").filter(oTableSearchState, "Application");
            },
    
            onAdd: function (oEvent) {
                MessageBox.show("This functionality is not ready yet.", {
                    icon: MessageBox.Icon.INFORMATION,
                    title: "Aw, Snap!",
                    actions: [MessageBox.Action.OK]
                });
            },
    
            onSort: function (oEvent) {
                this._bDescendingSort = !this._bDescendingSort;
                var oView = this.getView(),
                    oTable = oView.byId("productsTable"),
                    oBinding = oTable.getBinding("items"),
                    oSorter = new Sorter("Name", this._bDescendingSort);
    
                oBinding.sort(oSorter);
            }
        });
    });