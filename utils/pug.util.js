"use strict"
const bluebird = require("bluebird"),
    pug = require("pug")

exports.paginate_data = async(request, model) => {
    return new bluebird(async(resolve, reject) => {
        try {
            let total_pages = 0,
                data_count = 0
            data_count = await model.count({
                where: request.where,
                col: request.primary,
                include: request.countinclude
            })
            if (data_count) {
                total_pages = data_count / request.limit
                if (!(data_count % request.limit == 0)) total_pages = parseInt(total_pages) + 1
            }
            let page = request.page ? parseInt(request.page) : 1,
                offset
            if (page > 0) {
                offset = (page - 1) * request.limit
            }
            model.findAll({
                    where: request.where,
                    attributes: request.attributes,
                    include: request.include,
                    offset: offset,
                    limit: request.limit,
                    order: [
                        [request.orderby, request.order]
                    ]
                }).then(result => {
                    let returndata = {
                        tabledata: result,
                        pageinfo: {
                            total_pages: total_pages,
                            current_page: page,
                            records: data_count
                        },
                        nopagination: false
                    }
                    if (request.extra) {
                        for (const key in request.extra) {
                            returndata[key] = request.extra[key]
                        }
                    }
                    if (request.nopagination) {
                        returndata.nopagination = true
                    }

                    // console.log('hiii')
                    // console.log(JSON.stringify(result))
                    // console.log('hii')

                    pug.renderFile(request.templatePath, returndata, function(i, result) {
                        if (!i) resolve(result)
                        else throw i
                    })
                })
                .catch(e => {
                    reject(e)
                })

        } catch (err) {
            reject(err)
        }
    });
}

exports.buildajaxpage = async(request) => {
    return new bluebird(async(resolve, reject) => {
        try {
            pug.renderFile(request.templatePath, { data: request.data }, function(i, result) {
                if (!i) resolve(result)
                else throw i
            })
        } catch (error) {
            reject(error)
        }
    });

}