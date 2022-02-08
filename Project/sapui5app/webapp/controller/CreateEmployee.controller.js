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

            this.model = new sap.ui.model.json.JSONModel([]);
            this.getView().setModel( this.model, "employeeModel" );

            // var oData = employeeModel.getData();
            // var index = oData.length;
            // oData.push({ index : index + 1});
            // employeeModel.refresh();
            // newEmployee.bindElement("employeeModel>/" + index);
        },

        setEmployeeType: function (oEvent) {

            var employeeType = oEvent.getParameters().item.getKey();
            var currentStep = this.byId("EmployeeTypeStep");

            // get view models
            var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
            var oJSONModelConfig = this.getView().getModel("jsonModelConfig");
            //var employeeModel = oEvent.getSource().getParent().getModel("employeeModel");

            //let context = oEvent.getSource().getBindingContext("employeeModel");
            //let contextObj = context.getObject();

            //set selected employee type
            //this.model.setProperty("/Type", employeeType);

            //validate if EmployeeType has changed, discard progress
            if (this._wizard.getProgressStep() !== currentStep) {
                this._wizard.discardProgress(currentStep);
            }

            //validate current step and activate next step
            this._wizard.validateStep(currentStep);

            //set properties for next step
            switch (employeeType) {
                case "0":
                    oJSONModelConfig.setProperty("/dniLabel", oResourceBundle.getText("dni"));
                    oJSONModelConfig.setProperty("/salaryLabel", oResourceBundle.getText("annualSalary"));

                    oJSONModelConfig.setProperty("/salaryMin", 12000);
                    oJSONModelConfig.setProperty("/salaryMax", 80000);
                    oJSONModelConfig.setProperty("/salaryStep", 10000);

                    //contextObj.Salary = 24000;
                    this.model.setProperty("/Salary", 24000);
                    break;

                case "1":
                    oJSONModelConfig.setProperty("/dniLabel", oResourceBundle.getText("cif"));
                    oJSONModelConfig.setProperty("/salaryLabel", oResourceBundle.getText("dailyPrice"));

                    oJSONModelConfig.setProperty("/salaryMin", 100);
                    oJSONModelConfig.setProperty("/salaryMax", 2000);
                    oJSONModelConfig.setProperty("/salaryStep", 150);
                    this.model.setProperty("/Salary", 400);
                    break;

                case "2":
                    oJSONModelConfig.setProperty("/dniLabel", oResourceBundle.getText("dni"));
                    oJSONModelConfig.setProperty("/salaryLabel", oResourceBundle.getText("annualSalary"));

                    oJSONModelConfig.setProperty("/salaryMin", 50000);
                    oJSONModelConfig.setProperty("/salaryMax", 200000);
                    oJSONModelConfig.setProperty("/salaryStep", 20000);
                    this.model.setProperty("/Salary", 70000);
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


        employeeDataValidation: function () {
            var firstName = this.byId("i_FirstName").getValue();
            var lastName = this.byId("i_LastName").getValue();
            var dni = this.byId("i_Dni").getValue();
            //var creationDate = this.byId("i_CreationDate").getValue();


            if (!firstName) {
                this.model.setProperty("/firstNameState", "Error");
            } else {
                this.model.setProperty("/firstNameState", "None");
            }

            if (!lastName) {
                this.model.setProperty("/lastNameState", "Error");
            } else {
                this.model.setProperty("/lastNameState", "None");
            }

            if (!dni) {
                this.model.setProperty("/dniState", "Error");
            } else {
                this.onChangeDni(dni);
            }

            //if (!creationDate) {
            //     this.model.setProperty("/creationDateState", "Error");
            // } else {
            //     this.onChangeCreationDate(creationDate);
            // }

            if (this.model.getProperty("/firstNameState") === "None" &&
                this.model.getProperty("/lastNameState") === "None" &&
                this.model.getProperty("/dniState") === "None" &&
                this.model.getProperty("/creationDateState") === "None") {

                this._wizard.validateStep(this.byId("EmployeeDataStep"));
            } else {
                this._wizard.invalidateStep(this.byId("EmployeeDataStep"));
            }
        },

        //check first name
        onChangeFirstName: function (oEvent) {
            if (!oEvent.getParameter("value")) {
                this.model.setProperty("/firstNameState", "Error");
            } else {
                this.model.setProperty("/firstNameState", "None");
                // this.employeeDataValidation();
            }
        },

        //check last name
        onChangeLastName: function (oEvent) {
            if (!oEvent.getParameter("value")) {
                this.model.setProperty("/lastNameState", "Error");
            } else {
                this.model.setProperty("/lastNameState", "None");
                // this.employeeDataValidation();
            }
        },


        onChangeDni: function (dni) {
            //var dni = oEvent.getParameter("value");
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
                    this.model.setProperty("/dniState", "Error");
                } else {
                    //Correcto
                    this.model.setProperty("/dniState", "None");
                }
            } else {
                //Error
                this.model.setProperty("/dniState", "Error");
            }
        },

        onChangeCreationDate: function (oEvent) {
            // var date = oEvent.getParameter("value");
            // let d = new Date(date);
            // if (d.toString() === 'Invalid Date') {
            if (!oEvent.getSource().isValidValue()) {
                oEvent.getSource().setValueState('Error');
                this.model.setProperty("/creationDateState", "Error");
                this._wizard.invalidateStep(this.byId("EmployeeDataStep"));
            } else {
                oEvent.getSource().setValueState('None');
                //this.model.setProperty("/creationDateState", "None");
                this._wizard.validateStep(this.byId("EmployeeDataStep"));
                //this.employeeDataValidation();
            }
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

        onWizardSubmit: function (oEvent) {
            this._handleMessageBoxOpen("Are you sure you want to submit your report?", "confirm");

            //submit Employee: “/sap/opu/odata/sap/ZEMPLOYEES_SRV/Users”
            var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();

            //get ID for selected employee: model/object/property
            var employeeId = this.getView().getModel("employeeModel").getData().EmployeeId;

            //get employee
            var employeeModel = this.getView().getModel("employeeModel").getData();

            if (typeof EmployeeId == 'undefined') {
                //build create operation body
                var body = {
                    SapId: this.getOwnerComponent().SapId,
                    Type: employeeModel.Type,
                    FirstName: employeeModel.FirstName,
                    LastName: employeeModel.LastName,
                    Dni: employeeModel.Dni,
                    CreationDate: employeeModel.CreationDate,
                    Comments: employeeModel.Comments,
                };

                // //save new employee: get view/model/create_operation
                // this.getView().getModel("employeeModel").create("/Users", body, {
                //     success: function () {
                //         this.onReadDataEmployee.bind(this)(employeeId);
                //         //sap.m.MessageToast.show(oResourceBundle.getText("oDataSaveOK"));
                //         sap.m.MessageBox.success(oResourceBundle.getText("oDataSaveOK"));
                //     }.bind(this),
                //     error: function (e) {
                //         sap.m.MessageToast.show(oResourceBundle.getText("oDataSaveKO"));
                //     }.bind(this)
                // })
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


        // //UPLOAD FILE FUNCTIONS
        // //upload file executes Post method with slug and csrf-token parameters
        // onFileBeforeUpload: function (oEvent) {
        //     let fileName = oEvent.getParameter("fileName");
        //     let objectContext = oEvent.getSource().getBindingContext("employeeModel").getObject();

        //     //slug: header parameter allow send key values for the file
        //     let oCustomerHeaderSlug = new sap.m.UploadCollectionParameter({
        //         name: "slug",
        //         value: objectContext.OrderID + ";" + this.getOwnerComponent().SapId + ";" + objectContext.EmployeeID + ";" + fileName
        //     });

        //     //add slug parameter to previous parameters of the media object
        //     oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);
        // },

        // //update token every time files change
        // onFileChange: function (oEvent) {
        //     //add csrf-token parameter
        //     let oUploadCollection = oEvent.getSource();
        //     let oCustomerHeaderToken = new sap.m.UploadCollectionParameter({
        //         name: "x-csrf-token",
        //         value: this.getView().getModel("employeeModel").getSecurityToken()
        //     });
        //     oUploadCollection.addHeaderParameter(oCustomerHeaderToken);
        // },

        // //update collection after a new file has been uploaded
        // onFileUploadComplete: function (oEvent) {
        //     oEvent.getSource().getBinding("items").refresh();
        // },


        // //delete files in sap-system
        // onFileDeleted: function (oEvent) {
        //     var oUploadCollection = oEvent.getSource();

        //     //route to be deleted
        //     var sPath = oEvent.getParameter("item").getBindingContext("employeeModel").getPath();
        //     this.getView().getModel("employeeModel").remove(sPath, {
        //         success: function () {
        //             oUploadCollection.getBinding("items").refresh();
        //         },
        //         error: function () {
        //         }
        //     });
        // },

        // //call file with /$value, using window methods
        // downloadFile: function (oEvent) {
        //     const sPath = oEvent.getSource().getBindingContext("incidenceModel").getPath();
        //     window.open("/sap/opu/odata/sap/YSAPUI5_SRV_01" + sPath + "/$value");
        // }


    });
});