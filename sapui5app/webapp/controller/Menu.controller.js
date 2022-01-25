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

        function onPressCrearEmpleado() {

        };

        function onPressVerEmpleado() {

        };

        function onPressFirmarPedido() {

        };

        //prototype
        var Main = Controller.extend("logaligroup.sapui5app.controller.Menu", {});
        Main.prototype.onInit               = onInit;
        Main.prototype.onPressCrearEmpleado = onPressCrearEmpleado;
        Main.prototype.onPressVerEmpleado   = onPressVerEmpleado;
        Main.prototype.onPressFirmarPedido  = onPressFirmarPedido;
        return Main;
    });