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
                message: message
            })
        return response.redirect('/')
    }
}

module.exports = FormController
