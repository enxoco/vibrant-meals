$('.login-modal-button').on('click', function(e){
    e.preventDefault()
    var email = $('#email').val()
    var password = $('#password').val()

    var auth = {email:email, password:password}

    $.ajax({
      type: 'POST',
      url: '/login',
      data: auth,
      success: function(res){
        if (res.status) {
            toastr['warning'](res.message)
        } else if (res.message === 'Login Success') {
            if (window.location.href.includes('checkout')) {
                window.location.href = '/checkout'
            } else {
                window.location.href = '/menu'
            }
        }

      }
    })

  })