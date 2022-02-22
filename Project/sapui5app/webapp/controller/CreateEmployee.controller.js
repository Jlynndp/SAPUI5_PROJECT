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

            this._model = new sap.ui.model.json.JSONModel([]);
            this.getView().setModel(this._model);

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

            this.getOwnerComponent().getRouter().getRoute("RouteCreateEmployee").attachPatternMatched(this.resetWizard, this);
        },

        resetWizard: function (oEvent) {
            var oParameters = oEvent.getParameters();
            if (oParameters.name == "RouteCreateEmployee") {
                // if route matched do your actions

                // this._wizard = this.byId("CreateEmployeeWizard");
                // this._oNavContainer = this.byId("WizardNavContainer");
                // this._oWizardContentPage = this.byId("WizardContentPage");
                //this._model.setData(null);

                //this.getView().getModel("jsonModelConfig").setData(null);

                this._model.setProperty("/Type", "");
                this._model.setProperty("/Salary", "");
                this.getView().setModel(this._model);

                var oFirstStep = this._wizard.getSteps()[0];
                this.discardProgress(oFirstStep);
                this._wizard.goToStep(oFirstStep);
                oFirstStep.setValidated(false);

                this._model.removeAllContent();

                // this._handleNavigationToStep(0);
                // this._wizard.invalidateStep(this.byId("EmployeeTypeStep"));

                //this._model = new sap.ui.model.json.JSONModel([]);
                //this.getView().setModel(this._model);

                // //config data view properties
                // var oJSONModelConfig = new sap.ui.model.json.JSONModel({
                //     dniLabel: "",
                //     salaryLabel: "",
                //     salaryMin: 0,
                //     salaryMax: 0,
                //     salaryValue: 0,
                //     salaryStep: 0,
                // });
                // this.getView().setModel(oJSONModelConfig, "jsonModelConfig");

                //reset wizard steps
            }

        },

        setEmployeeType: function (oEvent) {
            var employeeType = oEvent.getParameters().item.getKey();
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
                    salaryStep = 20000;
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
            // var firstName = this._model.getData()._firstNameState;
            // var lastName =  this._model.getData().LastName;
            // var dni =  this._model.getData().Dni;
            // var creationDate = this.byId("i_CreationDate").getValue();

            // if (!firstName) {
            //     this._model.setProperty("/_firstNameState", "Error");
            // } else {
            //     this._model.setProperty("/_firstNameState", "None");
            // }

            // if (!lastName) {
            //     this._model.setProperty("/_lastNameState", "Error");
            // } else {
            //     this._model.setProperty("/_lastNameState", "None");
            // }

            // if (!dni) {
            //     this._model.setProperty("/_dniState", "Error");
            // } else {
            //     this.onChangeDni(dni);
            // }

            // //if (!creationDate) {
            // //     this.model.setProperty("/creationDateState", "Error");
            // // } else {
            // //     this.onChangeCreationDate(creationDate);
            // // }

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

        // //go to Data Employee step
        // goToDataStep: function () {
        //     if (this._wizard.getProgressStep() === this.byId("EmployeeTypeStep")) {
        //         this._wizard.nextStep();
        //     }
        // },


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
                        this._wizard.invalidateStep(this.byId("EmployeeTypeStep"));
                        this._wizard.discardProgress(this._wizard.getSteps()[0]);
                    }
                }.bind(this)
            });
        },

        // _setEmptyValue: function (sPath) {
        // 	this.model.setProperty(sPath, "n/a");
        // },

        onWizardCancel: function (oEvent) {
            //var employeeModel = this.getView().getModel(); //oEvent.getSource().getModel();
            var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();

            MessageBox.confirm(oResourceBundle.getText("msgCancelWizard"), {
                actions: [sap.m.MessageBox.Action.OK, MessageBox.Action.CANCEL],
                emphasizedAction: sap.m.MessageBox.Action.OK,
                onClose: function (sAction) {
                    if (sAction === MessageBox.Action.OK) {
                        //reset model
                        //employeeModel.setData(null);
                        //this.discardProgress(this._wizard.getSteps()[0]);

                        //back to Menu
                        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                        oRouter.navTo("RouteMenu", true);

                    }
                }.bind(this)
            });
        },

        onWizardSubmit: function (oEvent) {
            var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();

            this._handleMessageBoxOpen(oResourceBundle.getText("msgCreateEmpl"), "confirm");

            //submit Employee: “/sap/opu/odata/sap/ZEMPLOYEES_SRV/Users”


            //get ID for selected employee: model/object/property
            var employeeId = this.getView().getModel().getData().EmployeeId;

            //get employee
            var employeeModel = this.getView().getModel().getData();

            var date = new Date(employeeModel.CreationDate);
            var creationDate = date.toJSON().slice(0, 19);

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

                //save new employee: get view/model/create_operation
                this.getView().getModel("employeeModel").create("/Users", body, {
                    success: function (data) {
                        //this.onReadDataEmployee.bind(this)(employeeId);
                        //sap.m.MessageToast.show(oResourceBundle.getText("oDataSaveOK"));
                        employeeId = data.EmployeeId;
                        this._model.setProperty("/EmployeeId", data.EmployeeId);

                        // //header parameter: x-csrf-token
                        // this.onFileChange(oEvent);
                        // //slug parameter: SapId; EmployeeId; FileName
                        // this.onFileBeforeUpload(oEvent);
                        let uploadCollection = this.byId("UploadCollection");
                        if (uploadCollection.getItems().length > 0) {

                            uploadCollection.upload();
                        };

                        //upload attachments: “/sap/opu/odata/sap/ZEMPLOYEES_SRV/Attachments”
                        //sap.m.MessageBox.success(oResourceBundle.getText("oDataSaveOK"));


                    }.bind(this),
                    error: function (e) {
                        sap.m.MessageToast.show(oResourceBundle.getText("oDataSaveKO"));
                    }.bind(this)
                });
            };
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


        //UPLOAD FILE FUNCTIONS
        //upload file executes Post method with slug and csrf-token parameters
        onFileBeforeUpload: function (oEvent) {
            var fileName = oEvent.getParameter("fileName");

            //slug: header parameter allow send key values for the file
            var oCustomerHeaderSlug = new sap.m.UploadCollectionParameter({
                name: "slug",
                value: this.getOwnerComponent().SapId + ";" + this._model.getData().EmployeeId + ";" + fileName
            });

            //add slug parameter to previous parameters of the media object
            oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);

            // setTimeout(function () {
            //     MessageToast.show("Event beforeUploadStarts triggered");
            // }, 4000);
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
            //oEvent.getSource().getBinding("items").refresh();
            // var oUploadCollection = oEvent.getSource();
            //oUploadCollection.setUploadUrl(null);

            MessageToast.show("Event uploadComplete triggered");

            // var sUploadedFileName = oEvent.getParameter("files")[0].fileName;
            // setTimeout(function () {
            //     var oUploadCollection = this.byId("UploadCollection");

            //     for (var i = 0; i < oUploadCollection.getItems().length; i++) {
            //         if (oUploadCollection.getItems()[i].getFileName() === sUploadedFileName) {
            //             oUploadCollection.removeItem(oUploadCollection.getItems()[i]);
            //             break;
            //         }
            //     }

            //     // delay the success message in order to see other messages before
            //     MessageToast.show("Event uploadComplete triggered");
            // }.bind(this), 8000);

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

        // //call file with /$value, using window methods
        // downloadFile: function (oEvent) {
        //     const sPath = oEvent.getSource().getBindingContext("incidenceModel").getPath();
        //     window.open("/sap/opu/odata/sap/YSAPUI5_SRV_01" + sPath + "/$value");
        // }


        //     onReadDataEmployee: function (employeeID) {
        //         //get view/model/read_operation
        //         this.getView().getModel("employeeModel").read("/Users", {
        //             filters: [
        //                 new sap.ui.model.Filter("SapId", "EQ", this.getOwnerComponent().SapId),
        //                 new sap.ui.model.Filter("EmployeeId", "EQ", employeeID.toString())
        //             ],
        //             success: function (data) {
        //                 //get incidence model
        //                 var employeeModel = this._detailEmployeeView.getModel("employeeModel");
        //                 employeeModel.setData(data.results);

        //                 // //get table incidence from current view
        //                 // var tableIncidence = this._detailEmployeeView.byId("tableIncidence");
        //                 // tableIncidence.removeAllContent();

        //                 // //add incidences to incidence model
        //                 // for (var incidence in data.results) {

        //                 //     data.results[incidence]._ValidDate = true;
        //                 //     data.results[incidence].EnabledSave = false;

        //                 //     var newIncidence = sap.ui.xmlfragment("logaligroup.Employees.fragment.NewIncidence", this._detailEmployeeView.getController());
        //                 //     this._detailEmployeeView.addDependent(newIncidence);
        //                 //     newIncidence.bindElement("incidenceModel>/" + incidence);
        //                 //     tableIncidence.addContent(newIncidence);
        //                 // }

        //             }.bind(this),

        //             error: function (e) {
        //             }.bind(this)
        //         });



    });
});