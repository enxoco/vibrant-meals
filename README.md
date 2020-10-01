**Vibrant Meals**

This is the working copy of the new Vibrant Meals website.  It is being written using the AdonisJS framework on top of the AdonisJS Hackathon Starter boilerplate.  The only modification that has been made to the boilerplate so far is to swap out Bootstrap for Bulma CSS.

**11/12/18**

Initial developement begins.  Switched out Bootstrap for Bulma CSS at the moment.  Currently working on sketching out the database details.  You can look under database/migrations to see what the template looks like so far.  That folder contains the code that will be ran in order to create the database.

**Testing out the code**

I will set up a staging server soon.  In the meantime, you can run this code by doing the following:

```bash
git clone https://code.enxo.co/murph/vibrant-meals
cd vibrant-meals
npm install
```

That will install all of the dependencies


***Stripe API integration***

- Public Key    /public/js/registration-form.js
- Secret Key    .env

The secret key should only be used by Controller methods and is set up like this:

```javascript
const stripe = require('stripe')(Env.get('STRIPE_SK'))
```

***Handling Products***

Currently products that are created in Stripe are also stored in a products.json file on the server.  Whenever a user loads the page this products.json file is what is used to generate the menu.  This is due to the fact that the current version of the Stripe api does not include the skus in product requests.

So what happens is we make a request for all of the products and then we have to loop over that list and grab all the skus.