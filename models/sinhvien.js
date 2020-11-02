module.exports = (sequelize, Sequelize) => {
    const Sinhvien = sequelize.define("Sinhvien", {
        MSSV: {
            type: Sequelize.STRING
        },
        name: {
            type: Sequelize.STRING
        },
        mail: {
            type: Sequelize.STRING
        }
    });

    return Sinhvien;
};