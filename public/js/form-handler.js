// Capitalize first word of input
$('.form-auto-cap').keyup(function(){
  $(this).val($(this).val().charAt(0).toUpperCase() + $(this).val().slice(1))
})

// Title case a sentence.  Useful for names and products
$('.form-auto-cap-name').keyup(function(){
  $(this).val(titleCase($(this).val()))
})

$('input[type="tel"]').keyup(function(){
  var x = $(this).val()
  var y = x.replace(/[^\d]+/g, '').replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
  this.value = y.slice(0,14)
})


function titleCase(str) {
  return str.toLowerCase().split(' ').map(function(word) {
    return (word.charAt(0).toUpperCase() + word.slice(1));
  }).join(' ');
}

$('input[type="tel"]').keyup(function(){
  var p = $(this).val()
  if (p.length >= 3) {
    var a = '('
    var b = ')'
    p.charAt(1).replace(a)
    console.log(p)
  }
})

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

    // Simple custom form validation script to prevent user from going through
  // checkout process if they already have an account.
  function checkExistingEmail(email) {
    var email = email.toLowerCase()
    $.ajax({
      type: 'GET',
      url: '/api/user/check',
      data: {email: email},
      success: function(res){
        if (res === "1") {
          $('.email-billing-feedback').html('<p style="color:red;font-weight:500;text-align:center;">Looks like we already have an account associated with this email. <a href="#" data-dismiss="modal" data-toggle="modal" data-target="#loginModal">Login</a> or <a href="#" data-toggle="modal" data-dismiss="modal" data-target="#passwordResetModal">Reset</a> your password to continue </p>')
          $('#main :input, #createToken').attr('disabled', 'disabled')
        } else {
          $('.email-billing-feedback').html('')
          $('#main :input, #createToken').removeAttr('disabled')
        }
      }
    })
  }

  $('#email-bill').on('input', function(){checkExistingEmail($(this).val())})



