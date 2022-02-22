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

        function onAfterRendering() {
            // Error en el framework: Al agregar la dirección URL de "Firmar pedidos", el componente GenericTile debería navegar directamente a dicha URL, // pero no funciona en la versión 1.78. Por tanto, una solución encontrada es eliminando la propiedad id del componente por jquery
            var genericTileFirmarPedido = this.byId("GT_SignOrder");
            //Id del dom
            var idGenericTileFirmarPedido = genericTileFirmarPedido.getId();
            //Se vacía el id
            jQuery("#" + idGenericTileFirmarPedido)[0].id = "";
        };

        function navToCreateEmployee() {
            //call Create Employee view    
            this.getOwnerComponent().getRouter().navTo("RouteCreateEmployee");
        };

        function navToShowEmployee() {
            //call Show Employee view
            this.getOwnerComponent().getRouter().navTo("RouteShowEmployee");
        };

        // function navToSignOrder() {
        //     window.open("https://bc735977trial-dev-logali-approuter.cfapps.us10.hana.ondemand.com/logaligroupEmployees/index.html", "_blank");
        // };

        //prototype
        var Menu = Controller.extend("logaligroup.sapui5app.controller.Menu", {});
        Menu.prototype.onInit = onInit;
        Menu.prototype.onAfterRendering = onAfterRendering;
        Menu.prototype.navToCreateEmployee = navToCreateEmployee;
        Menu.prototype.navToShowEmployee = navToShowEmployee;
        // Menu.prototype.navToSignOrder = navToSignOrder;

        return Menu;
    });