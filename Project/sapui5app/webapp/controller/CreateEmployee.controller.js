sap.ui.define([
    "sap/ui/core/mvc/Controller"
],

    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        'use strict';

        function onInit() {
        };

        //prototype
        var CreateEmpl = Controller.extend("logaligroup.sapui5app.controller.CreateEmployee", {});
        CreateEmpl.prototype.onInit = onInit;
        return CreateEmpl;
    });