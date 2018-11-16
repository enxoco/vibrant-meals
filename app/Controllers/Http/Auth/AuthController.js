'use strict'
const Database = use('Database')
const { validateAll } = use('Validator')
const users = make('App/Services/UserService')
const User = use('App/Models/User')
const Helpers = use('Helpers')

class AuthController {
  async showLogin ({ view }) {
    return view.render('auth.login')
  }

  async updateItem ({ view, request, response, params }) {
    const profilePic = request.file('item-image', {
      types: ['image'],
      size: '2mb'
    })

    if (profilePic) {// A new image has been uploaded
      // Deal with new image
      try {
        var imgFile = await profilePic.moveAll(('public/images/uploads/'), {overwrite: true})
        await Database
        .table('product_images')
        .insert({
          path: 'images/uploads/' + profilePic._files[0].clientName,
          item_id: params.itemId
        })
      } catch (error) {
        await Database
        .table('product_images')
        .insert({
          path: 'images/uploads/' + profilePic._files[0].clientName,
          item_id: params.itemId
        })
        
      }

      // return response.send('new image')
    } else {// Same old image, just update other records
      const obj = request.all()
      var sugar = null
      var sodium = null
      if(obj.is_keto) {
        var is_keto = 1
      }
      if(obj.is_whole30) {
        var is_whole30 = 1
      }
      if(obj.is_paleo) {
        var is_paleo = 1
      }
      if(obj.is_lowCarb) {
        var is_lowCarb = 1
      }
      if(obj.carbs) {
        var carbs = obj.carbs
      }
      if(obj.fat) {
       var fat = obj.fat
      }
      if(obj.calories) {
        var calories = obj.calories
      }
      if(obj.protein) {
        var protein = obj.protein
      }
  
      if(obj.sugar) {
        var sugar = obj.sugar
      }
      if(obj.sodium) {
        var sodium = obj.sodium
      }
  
      var eightySixCount = null
  
      if(obj.eightySixCount) {
        var eightySixCount = obj.eightySixCount
      }
      try {
        const success = await Database
        .table('items')
        .where('id', params.itemId)
        .update({
          name: obj.name,
          price: obj.price,
          description: obj.description,
          is_keto: is_keto,
          is_lowCarb: is_lowCarb,
          is_paleo: is_paleo,
          is_whole30: is_whole30,
          calories: calories,
          fats: fat,
          carbs: carbs,
          protein: protein,
          eightySixCount: eightySixCount,
          sugar: sugar,
          sodium: sodium
        })
        return response.send({newId: success, item: obj})
  
      } catch (error) {
        return response.send(`Error ${error}`)
      }
    }




  }

  async editItem ({ view, request, response, params }) {

      try {
        const item = await Database
        .select('*')
        .from('items')
        .where('id', params.itemId)
        .limit(1)
        return view.render('edit-item', {item: item[0]})

      } catch (error) {
        return response.send(error)
      }
  }

  async addItem ({ view, request, response, params }) {

    const profilePic = request.file('item-image', {
      types: ['image'],
      size: '2mb'
    })

    var imgFile = await profilePic.move(('public/images/uploads/'), {
      name: 'custom-name.jpg',
      overwrite: true
    })

    // var imgFile = await profilePic.moveAll('public/images/uploads/')

    const obj = request.all()
    var sugar = null
    var sodium = null
    if(obj.is_keto) {
      var is_keto = 1
    }
    if(obj.is_whole30) {
      var is_whole30 = 1
    }
    if(obj.is_paleo) {
      var is_paleo = 1
    }
    if(obj.is_lowCarb) {
      var is_lowCarb = 1
    }
    if(obj.carbs) {
      var carbs = obj.carbs
    }
    if(obj.fat) {
     var fat = obj.fat
    }
    if(obj.calories) {
      var calories = obj.calories
    }
    if(obj.protein) {
      var protein = obj.protein
    }

    if(obj.sugar) {
      var sugar = obj.sugar
    }
    if(obj.sodium) {
      var sodium = obj.sodium
    }

    var eightySixCount = null

    if(obj.eightySixCount) {
      var eightySixCount = obj.eightySixCount
    }

    try {
      const success = await Database
      .table('items')
      .insert({
        name: obj.name,
        price: obj.price,
        description: obj.description,
        img_url: 'images/uploads/' + profilePic._files[0].clientName,
        is_keto: is_keto,
        is_lowCarb: is_lowCarb,
        is_paleo: is_paleo,
        is_whole30: is_whole30,
        calories: calories,
        fats: fat,
        carbs: carbs,
        protein: protein,
        eightySixCount: eightySixCount,
        sugar: sugar,
        sodium: sodium
      })
      return response.send({newId: success, item: obj})

    } catch (error) {
      return response.send(`Error ${error}`)
    }

  }

  async postLogin ({request, session, auth, response}) {
    const userInfo = request.all()
    const rules = {
      email: 'required',
      password: 'required'
    }



    const validation = await validateAll(userInfo, rules)

    if (validation.fails()) {
      session
        .withErrors(validation.messages())
        .flashExcept(['password'])

      return response.redirect('back')
    }

    try {
      await users.login(userInfo, auth)
      return response.redirect('/')
    } catch (error) {
      session.flash({ error: 'Invalid Login Credentials' })
      return response.redirect('back')
    }
  }

  async showRegister ({ view }) {
    return view.render('auth.register')
  }

  async postRegister ({request, session, response}) {
    const userInfo = request.only(['name', 'email', 'password', 'password_confirmation'])
    const rules = {
      name: 'required|max:255',
      email: 'required|email|max:255|unique:users',
      password: 'required|min:6|max:30',
      password_confirmation: 'required_if:password|min:6|max:30|same:password'
    }

    const validation = await validateAll(userInfo, rules)

    if (validation.fails()) {
      session
        .withErrors(validation.messages())
        .flashExcept(['password'])

      return response.redirect('back')
    }

    await users.register(userInfo)

    response.redirect('/login')
  }

  async logout ({ auth, response }) {
    await auth.logout()
    response.redirect('/login')
  }

  async redirectToProvider ({ request, session, ally, params }) {
    const { redirect } = request.only(['redirect'])
    if (redirect) {
      session.put('oldPath', redirect)
    }
    console.log(params.provider)
    await ally.driver(params.provider).redirect()
  }

  async handleProviderCallback ({params, ally, auth, session, response }) {
    const provider = params.provider
    try {
      const providerUser = await ally.driver(params.provider).getUser()
      try {
        await auth.check()
        const isLoggedIn = await auth.getUser()
        await users.updateUserProvider(providerUser, provider, isLoggedIn.id)
        const redirectPath = await session.get('oldPath', '/account')
        return response.redirect(redirectPath)
      } catch (error) {
        const authUser = await users.findOrCreateUser(providerUser, provider)
        await auth.loginViaId(authUser.id)
        return response.redirect('/')
      }
    } catch (e) {
      console.log(e)
      response.redirect('/auth/' + provider)
    }
  }
}

module.exports = AuthController
