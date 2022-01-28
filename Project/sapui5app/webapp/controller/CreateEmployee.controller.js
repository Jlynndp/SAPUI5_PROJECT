sap.ui.define([
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/json/JSONModel',
    'sap/m/MessageToast',
],

    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel
     */
    function (Controller, JSONModel, MessageToast) {
        'use strict';

        function onInit() {
            this._wizard = this.getView().byId("CreateEmployeeWizard");
            this._oNavContainer = this.getView().byId("NC_CreateEmployee");
            this._oWizardContentPage = this.getView().byId("Pg_CreateEmployee");
       };


        function setEmployeeType(oEvent) {
            // //get employee type
            // var employeeType = oEvent.getParameters().item.getText();
            // this.model.setProperty("/Type", employeeType);
            // this._wizard.validateStep(this.byId("WS_EmployeeType"));

            //var employeeType = oEvent.getParameters().item.getKey();
            //this.model.setProperty("/employeeType", employeeType);

            this._wizard.validateStep(this.byId("EmployeeTypeStep"));
        };


        function employeeDataValidation() {
            // var name = this.byId("ProductName").getValue();
            // var weight = parseInt(this.byId("ProductWeight").getValue());

            // if (isNaN(weight)) {
            //     this.model.setProperty("/productWeightState", "Error");
            // } else {
            //     this.model.setProperty("/productWeightState", "None");
            // }

            // if (name.length < 6) {
            //     this.model.setProperty("/productNameState", "Error");
            // } else {
            //     this.model.setProperty("/productNameState", "None");
            // }

            // if (name.length < 6 || isNaN(weight)) {
            //     this._wizard.invalidateStep(this.byId("ProductInfoStep"));
            // } else {
                this._wizard.validateStep(this.byId("EmployeeDataStep"));
            // }
        };

        function addDataValidation(){
            this._wizard.validateStep(this.byId("AddDataStep"));

			MessageToast.show(
				'This event is fired on activate of Step3.'
			);
        };

        function addDataComplete(){
            this.model.setProperty("/navApiEnabled", false);
        };


        function onWizardCompleted() {
             this._oNavContainer.to(this.byId("Pg_Review"));
        };

        //prototype
        var CreateEmpl = Controller.extend("logaligroup.sapui5app.controller.CreateEmployee", {});
        CreateEmpl.prototype.onInit = onInit;
        CreateEmpl.setEmployeeType = setEmployeeType;
        CreateEmpl.employeeDataValidation = employeeDataValidation;
        CreateEmpl.addDataValidation = addDataValidation;
        CreateEmpl.addDataComplete = addDataComplete;
        CreateEmpl.onWizardCompleted = onWizardCompleted;
        return CreateEmpl;
    });