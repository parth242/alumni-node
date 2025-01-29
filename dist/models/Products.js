"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeProductsModel = void 0;
const sequelize_1 = require("sequelize");
class Products extends sequelize_1.Model {
}
let isProductsModelInitialized = false;
function initializeProductsModel(sequelize) {
    if (!isProductsModelInitialized) {
        Products.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            product_name: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            is_custom: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            createdAt: {
                field: "created_on",
                type: sequelize_1.DataTypes.DATE,
            },
            updatedAt: {
                field: "updated_on",
                type: sequelize_1.DataTypes.DATE,
            },
        }, {
            timestamps: true,
            sequelize,
            modelName: "products",
        });
        isProductsModelInitialized = true;
    }
}
exports.initializeProductsModel = initializeProductsModel;
exports.default = Products;
//# sourceMappingURL=Products.js.map