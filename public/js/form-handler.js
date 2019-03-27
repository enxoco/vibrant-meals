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