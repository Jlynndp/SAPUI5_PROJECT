sap.ui.define([
    "sap/ui/core/mvc/Controller"
],

    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        function onInit() {
        };

        function navToCreateEmployee() {
            //call Create Employee view
             this.getOwnerComponent().getRouter().navTo("RouteCreateEmployee");
        };

        function navToShowEmployee() {
            //call Show Employee view
            this.getOwnerComponent().getRouter().navTo("RouteShowEmployee");
        };

        function navToSignPurchase() {
        };

        //prototype
        var Menu = Controller.extend("logaligroup.sapui5app.controller.Menu", {});
        Menu.prototype.onInit = onInit;
        Menu.prototype.navToCreateEmployee = navToCreateEmployee;
        Menu.prototype.navToShowEmployee = navToShowEmployee;
        Menu.prototype.navToSignPurchase = navToSignPurchase;
        return Menu;
    });