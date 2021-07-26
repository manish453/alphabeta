const bluebird = require("bluebird"),
    path = require("path"),
    { dirpath } = require("../config/configuration"),
    { appointment, reports, medicaltest, multitest } = Sqlmodels

exports.downloadreportbulk = async(request) => {
    return new bluebird(async(resolve, reject) => {
        try {
            let result = await reports.findAll({
                where: request,
                attributes: ["report_id", "report"],
                include: [{
                    model: appointment,
                    attributes: ["name", "date"],
                    as: "booking",
                }]
            })
            if (result) {
                console.log(JSON.stringify(result))
                let reportIds = [];
                let filenames = [];
                let ext = '';
                result.forEach(async function(item, index) {
                    reportIds[index] = item.report_id;
                    filenames[index] = item.report;
                });
                resolve({ ids: reportIds, filenames: filenames })
            } else reject("Report Not Found")
        } catch (error) {
            reject(error)
        }
    });
}

exports.downloadreport = async(request) => {
    return new bluebird(async(resolve, reject) => {
        try {
            let result = await reports.findOne({
                where: request,
                attributes: ["report"],
                include: [{
                    model: appointment,
                    attributes: ["name", "date"],
                    as: "booking",
                    include: [{
                        association: appointment.multitest,
                        include: [{
                            model: medicaltest,
                            attributes: ["name"],
                            as: "test"
                        }]
                    }]
                }]
            })
            if (result) {
                console.log(JSON.stringify(result))
                let file = dirpath + '/uploads/' + result.report;
                let ext = path.extname(file),
                    filename = "report-" + result.booking.name + "-" + result.report;
                resolve({ file: file, name: filename.replace(/\s/g, '-').toLowerCase() });
            } else reject("Report Not Found")
        } catch (error) {
            reject(error)
        }
    });
}