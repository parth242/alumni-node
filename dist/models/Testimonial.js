"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeTestimonialModel = initializeTestimonialModel;
const sequelize_1 = require("sequelize");
class Testimonials extends sequelize_1.Model {
}
let isUserModelInitialized = false;
function initializeTestimonialModel(sequelize) {
    if (!isUserModelInitialized) {
        Testimonials.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            story_description: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            institute_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            user_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            status: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
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
            modelName: 'testimonials',
        });
        isUserModelInitialized = true;
    }
}
exports.default = Testimonials;
//# sourceMappingURL=Testimonial.js.map