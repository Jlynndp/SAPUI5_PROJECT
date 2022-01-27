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
            // this.getRouter().navTo("RouteCreateEmployee");
            // sap.ui.core.UIComponent.getRouterFor(this).navTo("RouteCreateEmployee");
             this.getOwnerComponent().getRouter().navTo("RouteCreateEmployee");
        };

        function navToShowEmployee() {
            //this.getOwnerComponent().getRouter().navTo("RouteShowEmployee");
        };

        function navToSignPurchase() {
            //window.open("http://bc735977trial-dev-logali-approuter.cfapps.us10.hana.ondemand.com");
            //open app "http://bc735977trial-dev-logali-approuter.cfapps.us10.hana.ondemand.com"
        };

        //prototype
        var Menu = Controller.extend("logaligroup.sapui5app.controller.Menu", {});
        Menu.prototype.onInit = onInit;
        Menu.prototype.navToCreateEmployee = navToCreateEmployee;
        Menu.prototype.navToShowEmployee = navToShowEmployee;
        Menu.prototype.navToSignPurchase = navToSignPurchase;
        return Menu;
    });