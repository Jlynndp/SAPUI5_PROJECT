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
            this._bus = sap.ui.getCore().getEventBus();

            this._wizard = this.byId("CreateEmployeeWizard");
            this._oNavContainer = this.byId("WizardNavContainer");
            this._oWizardContentPage = this.byId("WizardContentPage");

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

            this.getOwnerComponent().getRouter().getRoute("RouteCreateEmployee").attachPatternMatched(this.resetView, this);
        },

        resetView: function (oEvent) {
            var oParameters = oEvent.getParameters();
            if (oParameters.name == "RouteCreateEmployee") {

                //reset model
                if (this._model) {
                    this._model.destroy();
                }
                this._model = new sap.ui.model.json.JSONModel([]);
                this.getView().setModel(this._model);

                //reset files
                this.byId("UploadCollection").removeAllItems();

                //reset segmented button selection
                this.byId("Btn_Type").setSelectedButton(this.byId("SB_Item4").oButton.getId());
                this.byId("Btn_Type").setSelectedItem(this.byId("SB_Item4").getId());
                this.byId("Btn_Type").setSelectedKey("");

                //reset wizard
                var oFirstStep = this._wizard.getSteps()[0];
                this.discardProgress(oFirstStep);
                this._wizard.goToStep(oFirstStep);
                oFirstStep.setValidated(false);
                this._oNavContainer.to(this.byId("WizardContentPage"));
            }

        },

        setEmployeeType: function (oEvent) {
            var employeeType = oEvent.getParameters().item.getKey();
            this._model.setProperty("/Type", employeeType);

            var currentStep = this.byId("EmployeeTypeStep");

            // get view models
            var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
            var oJSONModelConfig = this.getView().getModel("jsonModelConfig");

            //validate if EmployeeType has changed, discard progress
            if (this._wizard.getProgressStep() !== currentStep) {
                this._wizard.discardProgress(currentStep);
            }

            //validate current step and activate next step
            this._wizard.validateStep(currentStep);

            let dniLabel = oResourceBundle.getText("dni");
            let salaryLabel = oResourceBundle.getText("annualSalary");
            let salaryMin = 0;
            let salaryMax = 0;
            let salaryStep = 0;
            let salary = 0;
            //set properties for next step
            switch (employeeType) {
                case "0":
                    salaryMin = 12000;
                    salaryMax = 80000;
                    salaryStep = 10000;
                    salary = 24000;
                    break;

                case "1":
                    dniLabel = oResourceBundle.getText("cif");
                    salaryLabel = oResourceBundle.getText("dailyPrice");
                    salaryMin = 100;
                    salaryMax = 2000;
                    salaryStep = 150;
                    salary = 400;
                    break;

                case "2":
                    salaryMin = 50000;
                    salaryMax = 200000;
                    salaryStep = 12000;
                    salary = 70000;
                    break;
            }

            //update config data in model
            oJSONModelConfig.setProperty("/dniLabel", dniLabel);
            oJSONModelConfig.setProperty("/salaryLabel", salaryLabel);

            oJSONModelConfig.setProperty("/salaryMin", salaryMin);
            oJSONModelConfig.setProperty("/salaryMax", salaryMax);
            oJSONModelConfig.setProperty("/salaryStep", salaryStep);
            this._model.setProperty("/Salary", salary);
            this._wizard.nextStep();
        },


        employeeDataValidation: function () {
            if (this._model.getProperty("/_firstNameState") === "None" &&
                this._model.getProperty("/_lastNameState") === "None" &&
                this._model.getProperty("/_dniState") === "None" &&
                this._model.getProperty("/_creationDateState") === "None") {

                this._wizard.validateStep(this.byId("EmployeeDataStep"));
            } else {
                this._wizard.invalidateStep(this.byId("EmployeeDataStep"));
            }
        },

        //check first name
        onChangeFirstName: function (oEvent) {
            if (!oEvent.getSource().getValue()) {
                this._model.setProperty("/_firstNameState", "Error");
            } else {
                this._model.setProperty("/_firstNameState", "None");

            }
            this.employeeDataValidation();
        },

        //check last name
        onChangeLastName: function (oEvent) {
            if (!oEvent.getSource().getValue()) {
                this._model.setProperty("/_lastNameState", "Error");
            } else {
                this._model.setProperty("/_lastNameState", "None");
            }
            this.employeeDataValidation();
        },


        onChangeDni: function (oEvent) {
            //validate when dni
            if (this._model.getData().Type !== '1') {
                var dni = oEvent.getParameter("value");
                var number;
                var letter;
                var letterList;
                var regularExp = /^\d{8}[a-zA-Z]$/;
                //Se comprueba que el formato es válido
                if (regularExp.test(dni) === true) {
                    //Número
                    number = dni.substr(0, dni.length - 1);
                    //Letra
                    letter = dni.substr(dni.length - 1, 1);
                    number = number % 23;
                    letterList = "TRWAGMYFPDXBNJZSQVHLCKET";
                    letterList = letterList.substring(number, number + 1);
                    if (letterList !== letter.toUpperCase()) {
                        //Error
                        this._model.setProperty("/_dniState", "Error");
                    } else {
                        //Correcto
                        this._model.setProperty("/_dniState", "None");
                        this.employeeDataValidation();
                    }
                } else {
                    //Error
                    this._model.setProperty("/_dniState", "Error");
                }
            } else {
                this._model.setProperty("/_dniState", "None");
            }
            this.employeeDataValidation();
        },

        onChangeCreationDate: function (oEvent) {
            if (!oEvent.getSource().isValidValue()) {
                oEvent.getSource().setValueState('Error');
                this._model.setProperty("/_creationDateState", "Error");
            } else {
                oEvent.getSource().setValueState('None');
                this._model.setProperty("/_creationDateState", "None");
            }
            this.employeeDataValidation();
        },

        onWizardCompleted: function () {
            //get files
            var files = this.byId("UploadCollection").getItems();

            if (files.length > 0) {
                this._model.setProperty("/_filesNum", files.length);
                this._model.setProperty("/_filesVisible", true);

                var attachments = [];
                for (var i in files) {
                    attachments[i] = {
                        DocName: files[i].getFileName(),
                        MimeType: files[i].getMimeType()
                    };
                };
                if (attachments) {
                    this._model.setProperty("/Attachments", attachments);
                };
            } else {
                this._model.setProperty("/_filesVisible", false);
            }

            //go to Review Page
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

        _handleNavigationToStep: function (iStepNumber) {
            var fnAfterNavigate = function () {
                this._wizard.goToStep(this._wizard.getSteps()[iStepNumber]);
                this._oNavContainer.detachAfterNavigate(fnAfterNavigate);
            }.bind(this);

            this._oNavContainer.attachAfterNavigate(fnAfterNavigate);
            this.backToWizardContent();
        },

        // _handleMessageBoxOpen: function (sMessage, sMessageBoxType) {
        //     MessageBox[sMessageBoxType](sMessage, {
        //         actions: [MessageBox.Action.YES, MessageBox.Action.NO],
        //         onClose: function (oAction) {
        //             if (oAction === MessageBox.Action.YES) {
        //                 this._handleNavigationToStep(0);
        //                 this._wizard.invalidateStep(this.byId("EmployeeTypeStep"));
        //                 this._wizard.discardProgress(this._wizard.getSteps()[0]);
        //                 // this.backToMenu();
        //             }
        //         }.bind(this)
        //     });
        // },

        onWizardCancel: function (oEvent) {
            var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();

            MessageBox.confirm(oResourceBundle.getText("msgCancelWizard"), {
                actions: [sap.m.MessageBox.Action.OK, MessageBox.Action.CANCEL],
                emphasizedAction: sap.m.MessageBox.Action.OK,
                onClose: function (sAction) {
                    if (sAction === MessageBox.Action.OK) {
                        //back to Menu
                        this.backToMenu();
                    }
                }.bind(this)
            });
        },

        onWizardSubmit: function (oEvent) {
            var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

            //get employee data
            var employeeModel = this.getView().getModel().getData();
            var employeeId = employeeModel.EmployeeId;

            var date = new Date(employeeModel.CreationDate);
            var creationDate = date.toJSON().slice(0, 19);

            MessageBox.confirm(oResourceBundle.getText("msgSubmitWizard"), {
                actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                onClose: function (oAction) {
                    if (oAction === MessageBox.Action.YES) {

                        if (typeof employeeId == 'undefined') {
                            //build create operation body
                            var body = {
                                SapId: this.getOwnerComponent().SapId,
                                Type: employeeModel.Type,
                                FirstName: employeeModel.FirstName,
                                LastName: employeeModel.LastName,
                                Dni: employeeModel.Dni,
                                CreationDate: creationDate,
                                Comments: employeeModel.Comments,
                                UserToSalary: [{
                                    Amount: parseFloat(employeeModel.Salary).toString(),
                                    Comments: employeeModel.Comments,
                                    Waers: "EUR"
                                }]
                            };

                            //submit Employee: “/sap/opu/odata/sap/ZEMPLOYEES_SRV/Users”
                            this.getView().getModel("employeeModel").create("/Users", body, {
                                success: function (data) {
                                    employeeId = data.EmployeeId;
                                    this._model.setProperty("/EmployeeId", data.EmployeeId);

                                    //upload attachments: “/sap/opu/odata/sap/ZEMPLOYEES_SRV/Attachments”
                                    let uploadCollection = this.byId("UploadCollection");
                                    if (uploadCollection.getItems().length > 0) {

                                        uploadCollection.upload();
                                    };

                                    sap.m.MessageBox.success(oResourceBundle.getText("msgCreateOK", employeeId), {
                                        actions: [MessageBox.Action.OK],
                                        onClose: function(oAction) {
                                            oRouter.navTo("RouteMenu", true);
                                        }
                                    });
                                }.bind(this),
                                error: function (e) {
                                    sap.m.MessageToast.show(oResourceBundle.getText("msgCreateKO"));
                                }.bind(this)
                            });
                        };

                    }
                }.bind(this)
            });

        },


        //back to Menu
        backToMenu: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("RouteMenu", true);
        },


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
            clearContent(this._wizard.getSteps());
        },


        //FILE UPLOAD FUNCTIONS
        onFileBeforeUpload: function (oEvent) {
            var fileName = oEvent.getParameter("fileName");

            //slug: header parameter allow send key values for the file
            var oCustomerHeaderSlug = new sap.m.UploadCollectionParameter({
                name: "slug",
                value: this.getOwnerComponent().SapId + ";" + this._model.getData().EmployeeId + ";" + fileName
            });

            //add slug parameter to previous parameters of the media object
            oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);
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
        }
     
    });
});