'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */



/**
 * 
 * Middleware to check whether a user has access to request a particular route or not.
 * Currently just checks whether user is admin or not but can be expanded to check for
 * different levels of permission and route accordingly
 * 
 */
class AdminAccess {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ request, response, auth, view }, next) {
    const fourOhFour = `<html>
<head>
    <style>
        @import url(https://fonts.googleapis.com/css?family=Roboto:400,100,300,500);

body {
background-color: #aad0ae;
color: #fff;
font-size: 100%;
line-height: 1;
font-family: "Roboto", sans-serif;
margin-top:100px;
}

p {
font-size: 2em;
text-align: center;
font-weight: 100;
}
.quotething {
font-size: 1em;
text-align: center;
font-weight: 100;
}

h1 {
text-align: center;
font-size: 8em;
font-weight: 600;

}

.button404 {
text-align: center;
display: inline-block;
-webkit-box-sizing: content-box;
-moz-box-sizing: content-box;
box-sizing: content-box;
cursor: pointer;
margin: 1px;
padding: 12px 30px;
border: 1px solid #ffffff;
-webkit-border-radius: 3px;
border-radius: 3px;
font: normal 13px/normal "Roboto", Times, serif;
color: white;
-o-text-overflow: clip;
text-overflow: clip;
background: #f37374;
-webkit-transition: all 300ms cubic-bezier(0.42, 0, 0.58, 1);
-moz-transition: all 300ms cubic-bezier(0.42, 0, 0.58, 1);
-o-transition: all 300ms cubic-bezier(0.42, 0, 0.58, 1);
transition: all 300ms cubic-bezier(0.42, 0, 0.58, 1);
}

.button404:hover {
color: rgba(255,255,255,1);
background: rgba(255,255,255,0);
}
    </style>
</head>
<body>
        <h1>404</h1>
        <p>Oops, looks like you stumbled upon something that doesn't exist</p>
        <br>
        <div align="center">
          <a href="/"><input type="button" class="button404" value="Take Me Home!" /></a>
        </div>
</body>
</html>`

    if (!auth.user) {
      return response.send(fourOhFour)
    }

    if (auth.user && auth.user.user_level != 'admin') {
      return response.send(fourOhFour)
    }
    // call next to advance the request
    await next()
  }
}

module.exports = AdminAccess
