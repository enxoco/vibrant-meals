'use strict'
const Database = use('Database')

class FormController {

    async contactForm ({request, response}) {
        const {fname, lname, email, phone, referral, message} = request.all()
        const update = await Database
            .table('contact_form')
            .insert({
                name: fname + ' ' + lname,
                email: email,
                phone: phone,
                referral: referral,
                message: message,
                form_id: 'contact'
            })
        return response.redirect('/')
    }

    async cateringForm ({request, response}) {
        const {fname, lname, business, email, subject, message} = request.all()
        const update = await Database
            .table('contact_form')
            .insert({
                name: fname + ' ' + lname,
                email: email,
                business: business,
                subject: subject,
                message: message,
                form_id: 'catering'
            })
        return response.redirect('/')
    }


    async partnershipsForm ({request, response}) {
        const {fname, lname, business, email, subject, message} = request.all()
        const update = await Database
            .table('contact_form')
            .insert({
                name: fname + ' ' + lname,
                email: email,
                subject: subject,
                message: message,
                form_id: 'partnerships'
            })
        return response.redirect('/')
    }
    async careersForm ({request, response}) {
        const {fname, lname, email, subject, message} = request.all()
        const update = await Database
            .table('contact_form')
            .insert({
                name: fname + ' ' + lname,
                email: email,
                subject: subject,
                message: message,
                form_id: 'careers'
            })
        return response.redirect('/')
    }
}


module.exports = FormController
