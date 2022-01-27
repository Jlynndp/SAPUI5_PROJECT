sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/ui/model/json/JSONModel',
],

    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel
     */
    function (Controller, JSONModel) {
        'use strict';

        function onInit() {
            this._wizard = this.byId("Wz_CreateEmployee");
            this._oNavContainer = this.byId("NC_CreateEmployee");
			this._oWizardContentPage = this.byId("Pg_CreateEmployee");
        };

        
        function setEmployeeType(oEvent) {
            //get employee type
            var employeeType = oEvent.getParameters().item.getText();
			this.model.setProperty("/Type", employeeType);
			this._wizard.validateStep(this.byId("WS_EmployeeType"));
        };


        function goToEmployeeData(){
			// var selectedKey = this.model.getProperty("/Type");

			// switch (selectedKey) {
			// 	case "1":
			 		this.byId("WS_EmployeeType").setNextStep(this.getView().byId("WS_Intern"));
			// 		break;
			// 	case "2":
			// 		this.byId("WS_EmployeeType").setNextStep(this.getView().byId("WS_Freelance"));
			// 		break;
			// 	case "3":
			// 	default:
			// 		this.byId("WS_EmployeeType").setNextStep(this.getView().byId("WS_Manager"));
			// 		break;
			// }
        };

        function checkInternStep () {
			//var employeeType = this.model.getProperty("/Type") || "";
            //this._wizard.validateStep(this.byId("WS_InternCreditCardStep"));
		};

        function onWizardCompleted() {
                this._oNavContainer.to(this.byId("Pg_Review"));
        };

        //prototype
        var CreateEmpl = Controller.extend("logaligroup.sapui5app.controller.CreateEmployee", {});
        CreateEmpl.prototype.onInit = onInit;
        CreateEmpl.setEmployeeType = setEmployeeType;
        CreateEmpl.checkInternStep = checkInternStep;
        CreateEmpl.goToEmployeeData = goToEmployeeData;
        CreateEmpl.onWizardCompleted = onWizardCompleted;
        return CreateEmpl;
    });