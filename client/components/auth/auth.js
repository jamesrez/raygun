function showErr(error){
  $('.authErrorContainer').css('display', 'block');
  $('.authError').text(error);
}

function registerUser(){
  let username = $('.authUsername').val();
  let password = $('.authPassword').val();
  if(username.length > 0 && password.length > 0){
    axios.post('/register', {
      username, password
    }).then((res, data) => {
      if(res.data.err){
        showErr(res.data.err);
      }else{
        raygun.auth(res.data, password);
        raygun.recall();
      }
    })
  }
}

function loginUser(){
  let username = $('.authUsername').val();
  let password = $('.authPassword').val();
  if(username.length > 0 && password.length > 0){
    axios.post('/login', {
      username, password
    }).then((res, data) => {
      if(res.data.err){
        showErr(res.data.err);
      }else{
        raygun.auth(res.data, password);
        raygun.recall();
      }
    })
  }
}

$(document).on('keyup', (e) => {
  if(e.keyCode == 13 && currentRaygunScreen == 'auth'){
    e.preventDefault();
    loginUser();
  }
});
