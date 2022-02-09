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
            this._oNavContainer = this.byId("wizardNavContainer");
            this._oWizardContentPage = this.byId("wizardContentPage");

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

            // var oData = employeeModel.getData();
            // var index = oData.length;
            // oData.push({ index : index + 1});
            // employeeModel.refresh();
            // newEmployee.bindElement("employeeModel>/" + index);
        },

        // onBeforeRendering: function(){
        //     this._wizard = this.byId("CreateEmployeeWizard");
        //     this._oNavContainer = this.byId("wizardNavContainer");
        //     this._oWizardContentPage = this.byId("wizardContentPage");

        //     this._model = new sap.ui.model.json.JSONModel([]);
        //     this.getView().setModel(this._model);

        //     //config data view properties
        //     var oJSONModelConfig = new sap.ui.model.json.JSONModel({
        //         dniLabel: "",
        //         salaryLabel: "",
        //         salaryMin: 0,
        //         salaryMax: 0,
        //         salaryValue: 0,
        //         salaryStep: 0,
        //     });
        //     this.getView().setModel(oJSONModelConfig, "jsonModelConfig");
        // },

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
                        this._wizard.invalidateStep(this.byId("EmployeeTypeStep"));
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

        onWizardSubmit: function (oEvent) {
            this._handleMessageBoxOpen("Are you sure you want to submit your report?", "confirm");

            //submit Employee: “/sap/opu/odata/sap/ZEMPLOYEES_SRV/Users”
            var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();

            //get ID for selected employee: model/object/property
            var employeeId = this.getView().getModel().getData().EmployeeId;

            //get employee
            var employeeModel = this.getView().getModel().getData();

            const date = new Date(employeeModel.CreationDate);
            const creationDate = date.toJSON().slice(0,19);

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
                };

                //save new employee: get view/model/create_operation
                this.getView().getModel("employeeModel").create("/Users", body, {
                    success: function () {
                        //this.onReadDataEmployee.bind(this)(employeeId);
                        //sap.m.MessageToast.show(oResourceBundle.getText("oDataSaveOK"));
                        sap.m.MessageBox.success(oResourceBundle.getText("oDataSaveOK"));
                    }.bind(this),
                    error: function (e) {
                        sap.m.MessageToast.show(oResourceBundle.getText("oDataSaveKO"));
                    }.bind(this)
                })
            };

            //upload attachments: “/sap/opu/odata/sap/ZEMPLOYEES_SRV/Attachments”
            //EmployeeId: employeeId.toString(),
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
            var objectContext = oEvent.getSource().getBindingContext("employeeModel").getObject();

            //slug: header parameter allow send key values for the file
            var oCustomerHeaderSlug = new sap.m.UploadCollectionParameter({
                name: "slug",
                value: this.getOwnerComponent().SapId + ";" + objectContext.EmployeeId + ";" + fileName
            });

            //add slug parameter to previous parameters of the media object
            oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);
            setTimeout(function () {
                MessageToast.show("Event beforeUploadStarts triggered");
            }, 4000);
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
        },

        //update collection after a new file has been uploaded
        onFileUploadComplete: function (oEvent) {
            oEvent.getSource().getBinding("items").refresh();
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