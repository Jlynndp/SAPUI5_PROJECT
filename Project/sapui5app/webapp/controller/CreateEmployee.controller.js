sap.ui.define([
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/json/JSONModel',
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], function (Controller, JSONModel, MessageToast, MessageBox) {
    "use strict";

    // var history = {
    // 	prevEmployeeTypeSelect: null
    // };

    return Controller.extend("logaligroup.sapui5app.controller.CreateEmployee", {
        onInit: function () {
            this._wizard = this.byId("CreateEmployeeWizard");
            this._oNavContainer = this.byId("wizardNavContainer");
            this._oWizardContentPage = this.byId("wizardContentPage");

            this.model = new JSONModel();
            // // this.model.setData({
            // // 	productNameState: "Error",
            // // 	productWeightState: "Error"
            // // });
            this.getView().setModel(this.model);

            //config data view properties
            var oJSONModelConfig = new sap.ui.model.json.JSONModel({
                dniLabel: "",
                salaryLabel: "",
                salaryMin: 0,
                salaryMax: 0,
                salaryValue: 0,
                salaryStep: 0,
            });
            this.getView().setModel(oJSONModelConfig, "jsonModelConfig");
        },

        // setProductType: function (oEvent) {
        // 	var productType = oEvent.getSource().getTitle();
        // 	this.model.setProperty("/productType", productType);
        // 	this.byId("ProductStepChosenType").setText("Chosen product type: " + productType);
        // 	this._wizard.validateStep(this.byId("ProductTypeStep"));
        // },

        setEmployeeType: function (oEvent) {

            var employeeType = oEvent.getParameters().item.getKey();
            var currentStep = this.byId("EmployeeTypeStep");

            // let oResourceBundle = this.getView().getModel("i18n").getResourceBundle();

            //set selected employee type
            this.model.setProperty("/EmployeeType", employeeType);

            //validate if EmployeeType has changed, discard progress
            if (this._wizard.getProgressStep() !== currentStep) {
                this._wizard.discardProgress(currentStep);
            }

            //validate current step and activate next step
            this._wizard.validateStep(currentStep);


            // //set properties of next step
            let oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
            //var employeeType = this.model.getProperty("/EmployeeType");
            //set properties of next step
            var oJSONModelConfig = this.getView().getModel("jsonModelConfig");

            switch (employeeType) {
                case "0":
                    oJSONModelConfig.setProperty("/dniLabel", oResourceBundle.getText("dni"));
                    oJSONModelConfig.setProperty("/salaryLabel", oResourceBundle.getText("annualSalary"));

                    oJSONModelConfig.setProperty("/salaryMin", 12000);
                    oJSONModelConfig.setProperty("/salaryMax", 80000);
                    oJSONModelConfig.setProperty("/salaryValue", 24000);
                    oJSONModelConfig.setProperty("/salaryStep", 10000);
                    break;

                case "1":
                    oJSONModelConfig.setProperty("/dniLabel", oResourceBundle.getText("cif"));
                    oJSONModelConfig.setProperty("/salaryLabel", oResourceBundle.getText("dailyPrice"));

                    oJSONModelConfig.setProperty("/salaryMin", 100);
                    oJSONModelConfig.setProperty("/salaryMax", 2000);
                    oJSONModelConfig.setProperty("/salaryValue", 400);
                    oJSONModelConfig.setProperty("/salaryStep", 150);
                    break;

                case "2":
                    oJSONModelConfig.setProperty("/dniLabel", oResourceBundle.getText("dni"));
                    oJSONModelConfig.setProperty("/salaryLabel", oResourceBundle.getText("annualSalary"));

                    oJSONModelConfig.setProperty("/salaryMin", 50000);
                    oJSONModelConfig.setProperty("/salaryMax", 200000);
                    oJSONModelConfig.setProperty("/salaryValue", 70000);
                    oJSONModelConfig.setProperty("/salaryStep", 20000);
                    break;
            }


            // oJSONModelConfig.setProperty("/ salaryMin", true);
            // oJSONModelConfig.setProperty("/salaryMax", true);
            // oJSONModelConfig.setProperty("/salaryValue", false);

            //this._wizard.getCurrentStep().fireComplete();

            //Move to a Step
            // var cntrlStep3 = this.getView().byId('_id_wizStp3');
            // this.getView().byId('_id_wizard').goToStep(cntrlStep3);


            //this._wizard.attachComplete();
            //this._wizard.goToStep(this.byId("EmployeeDataStep"));
            //this._wizard.nextStep();
            //this._handleNavigationToStep(1);

            // //validate if EmployeeType has changed, discard progress
            // if (this._wizard.getProgressStep() !== this.byId("EmployeeTypeStep")) {
            //MessageBox.warning(params.message, {
            //	actions: [MessageBox.Action.YES, MessageBox.Action.NO],
            //	onClose: function (oAction) {
            //		if (oAction === MessageBox.Action.YES) {
            // this._wizard.discardProgress(this.byId("EmployeeTypeStep"));
            // history["prevEmployeeTypeSelect"] = this.model.getProperty(/EmployeeType);

            //		} else {
            //			this.model.setProperty(params.modelPath, history[params.historyPath]);
            //		}
            //	}.bind(this)
            //});
            // } 
            //else {
            //this._wizard.nextStep();
            // history["prevEmployeeTypeSelect"] = this.model.getProperty("/EmployeeType");
            //}
        },

        goToDataStep: function () {
            //var selectedKey = this.model.getProperty("/EmployeeType");

            // switch (selectedKey) {
            // 	case "0":
            // 		this.byId("EmployeeTypeStep").setNextStep(this.getView().byId("InternDataStep"));
            // 		break;
            // 	case "1":
            // 		this.byId("EmployeeTypeStep").setNextStep(this.getView().byId("FreelanceDataStep"));
            // 		break;
            // 	case "2":
            // 	default:
            // 		this.byId("EmployeeTypeStep").setNextStep(this.getView().byId("ManagerDataStep"));
            // 		break;
            // }

            // let oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
            // var employeeType = this.model.getProperty("/EmployeeType");
            // //set properties of next step
            // var oJSONModelConfig = this.getView().getModel("jsonModelConfig");

            // switch (employeeType) {
            //     case "0":
            //         oJSONModelConfig.setProperty("/dniLabel", oResourceBundle.getText("dni"));
            //         oJSONModelConfig.setProperty("/salaryLabel", oResourceBundle.getText("annualSalary"));

            //         oJSONModelConfig.setProperty("/salaryMin", 12000);
            //         oJSONModelConfig.setProperty("/salaryMax", 80000);
            //         oJSONModelConfig.setProperty("/salaryValue", 24000);
            //     break;
            //     case "1":
            //         oJSONModelConfig.setProperty("/dniLabel", oResourceBundle.getText("cif"));
            //         oJSONModelConfig.setProperty("/salaryLabel", oResourceBundle.getText("dailyPrice"));

            //         oJSONModelConfig.setProperty("/salaryMin", 100);
            //         oJSONModelConfig.setProperty("/salaryMax", 2000);
            //         oJSONModelConfig.setProperty("/salaryValue", 400);
            //         break;

            //     case "2":
            //         oJSONModelConfig.setProperty("/dniLabel", oResourceBundle.getText("dni"));
            //         oJSONModelConfig.setProperty("/salaryLabel", oResourceBundle.getText("annualSalary"));

            //         oJSONModelConfig.setProperty("/salaryMin", 50000);
            //         oJSONModelConfig.setProperty("/salaryMax", 200000);
            //         oJSONModelConfig.setProperty("/salaryValue", 70000);
            //         break;
            // }


        },

        // additionalInfoValidation: function () {
        // 	var name = this.byId("ProductName").getValue();
        // 	var weight = parseInt(this.byId("ProductWeight").getValue());

        // 	if (isNaN(weight)) {
        // 		this.model.setProperty("/productWeightState", "Error");
        // 	} else {
        // 		this.model.setProperty("/productWeightState", "None");
        // 	}

        // 	if (name.length < 6) {
        // 		this.model.setProperty("/productNameState", "Error");
        // 	} else {
        // 		this.model.setProperty("/productNameState", "None");
        // 	}

        // 	if (name.length < 6 || isNaN(weight)) {
        // 		this._wizard.invalidateStep(this.byId("ProductInfoStep"));
        // 	} else {
        // 		this._wizard.validateStep(this.byId("ProductInfoStep"));
        // 	}
        // },

        // optionalStepActivation: function () {
        // 	MessageToast.show(
        // 		'This event is fired on activate of Step3.'
        // 	);
        // },

        // optionalStepCompletion: function () {
        // 	MessageToast.show(
        // 		'This event is fired on complete of Step3. You can use it to gather the information, and lock the input data.'
        // 	);
        // },

        // pricingActivate: function () {
        // 	this.model.setProperty("/navApiEnabled", true);
        // },

        // pricingComplete: function () {
        // 	this.model.setProperty("/navApiEnabled", false);
        // },

        // scrollFrom4to2: function () {
        // 	this._wizard.goToStep(this.byId("ProductInfoStep"));
        // },

        // goFrom4to3: function () {
        // 	if (this._wizard.getProgressStep() === this.byId("PricingStep")) {
        // 		this._wizard.previousStep();
        // 	}
        // },

        // goFrom4to5: function () {
        // 	if (this._wizard.getProgressStep() === this.byId("PricingStep")) {
        // 		this._wizard.nextStep();
        // 	}
        // },

        onWizardCompleted: function () {
            this._oNavContainer.to(this.byId("wizardReviewPage"));
        },

        backToWizardContent: function () {
            this._oNavContainer.backToPage(this._oWizardContentPage.getId());
        },

        editStepOne: function () {
            this._handleNavigationToStep(0);
        },

        editStepTwo: function () {
            this._handleNavigationToStep(1);
        },

        editStepThree: function () {
            this._handleNavigationToStep(2);
        },

        // editStepFour: function () {
        // 	this._handleNavigationToStep(3);
        // },

        _handleNavigationToStep: function (iStepNumber) {
            var fnAfterNavigate = function () {
                this._wizard.goToStep(this._wizard.getSteps()[iStepNumber]);
                this._oNavContainer.detachAfterNavigate(fnAfterNavigate);
            }.bind(this);

            this._oNavContainer.attachAfterNavigate(fnAfterNavigate);
            this.backToWizardContent();
        },

        _handleMessageBoxOpen: function (sMessage, sMessageBoxType) {
        	MessageBox[sMessageBoxType](sMessage, {
        		actions: [MessageBox.Action.YES, MessageBox.Action.NO],
        		onClose: function (oAction) {
        			if (oAction === MessageBox.Action.YES) {
        				this._handleNavigationToStep(0);
        				this._wizard.discardProgress(this._wizard.getSteps()[0]);
        			}
        		}.bind(this)
        	});
        },

        // _setEmptyValue: function (sPath) {
        // 	this.model.setProperty(sPath, "n/a");
        // },

        onWizardCancel: function () {
            this._handleMessageBoxOpen("Are you sure you want to cancel your report?", "warning");

            //back to Menu
        },

        onWizardSubmit: function () {
            this._handleMessageBoxOpen("Are you sure you want to submit your report?", "confirm");

            //submit Employee: “/sap/opu/odata/sap/ZEMPLOYEES_SRV/Users”

            //upload attachments: “/sap/opu/odata/sap/ZEMPLOYEES_SRV/Attachments”

        },

        // productWeighStateFormatter: function (val) {
        // 	return isNaN(val) ? "Error" : "None";
        // },

        discardProgress: function () {
            this._wizard.discardProgress(this.byId("EmployeeTypeStep"));

            var clearContent = function (content) {
                for (var i = 0; i < content.length; i++) {
                    if (content[i].setValue) {
                        content[i].setValue("");
                    }

                    if (content[i].getContent) {
                        clearContent(content[i].getContent());
                    }
                }
            };

            // this.model.setProperty("/productWeightState", "Error");
            // this.model.setProperty("/productNameState", "Error");
            clearContent(this._wizard.getSteps());
        }
    });
});