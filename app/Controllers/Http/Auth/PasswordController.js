'use strict'

const { validateAll } = use('Validator')
const users = make('App/Services/UserService')
const Mail = use('Mail')
const Env = use('Env')

class PasswordController {
  async showResetForm ({ view }) {
    return view.render('auth.passwords.reset-password')
  }

  async sendResetLinkEmail ({ request, session, response }) {
    const userInfo = request.all()
    console.log(userInfo)
    userInfo['email-reset'] ? userInfo.email = userInfo['email-reset'] : userInfo.email
    const rules = {
      email: 'required|email'
    }


    const validation = await validateAll(userInfo, rules)

    if (validation.fails()) {
      return response.send(validation.messages())
    }

    const user = await users.getUserByEmail(userInfo.email)
    if (user === null) {
      return response.send({ warning: `${userInfo.email} Not Found` })
    } else {
      const token = await users.findOrCreateToken(user)
      try {
        await this.sendResetMail(user, token)

        return response.send({status: 'We have e-mailed your password reset link!'})
      } catch (error) {
        return response.send({ error: 'Unable to deliver email to given email address' })
      }
    }
  }

  async sendResetMail (user, token) {
    let link = `${Env.get('APP_URL')}/password/token/reset/${token}?email=${user.email}`
    await Mail.send('auth.email.password', {
      link: link,
      FNAME: user.name
    }, (message) => {
      message.to(user.email, user.name)
      message.from(Env.get('MAIL_FROM_EMAIL'), Env.get('MAIL_FROM_NAME'))
      message.subject('Your Password Reset Link')
    })
  }

  async showResetView ({ view, request, params }) {
    const { email } = request.all()
    return view.render('auth.passwords.reset', {
      token: params.token,
      email: email
    })
  }

  async reset ({ request, session, response }) {
    const userInfo = request.only(['email', 'password', 'password_confirmation', 'token'])
    const rules = {
      email: 'required|email|max:255',
      password: 'required|min:6|max:30',
      password_confirmation: 'required_if:password|min:6|max:30|same:password'
    }

    const validation = await validateAll(userInfo, rules)

    if (validation.fails()) {
      session
        .withErrors(validation.messages())
        .flashAll()

      return response.redirect('back')
    }

    const isResetOkay = await users.userResetPasswordExists(userInfo)
    if (isResetOkay) {
      const user = await users.resetPassword(userInfo)
      if (user === null) {
        session.flash({ error: 'We can\'t find a user with that e-mail address' }).flashAll()
        response.redirect('back')
      } else {
        session.flash({ status: 'Your password has been reset!' }).flashAll()
        response.redirect('back')
      }
    } else {
      session.flash({ error: 'This password reset token is invalid' }).flashAll()
      response.redirect('back')
    }
  }
}

module.exports = PasswordController
