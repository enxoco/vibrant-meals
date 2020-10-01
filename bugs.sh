
<link rel="stylesheet" href="/css/bulma.min.css" />
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />

<link rel="stylesheet" href="/css/slider.css" />


<link rel="stylesheet" href="/css/style.css" />

<style>
    select#variation {
    min-height: 50px;
    background: #f2f2f2f2;
    width: 40%;
    position: relative;
    left: 29%;
    padding: 20;
}
textarea {
    background: #f2f2f2;
    border: none;
    min-width: 94%;
    min-height: 200px;
    font-size: 1.25em;
    padding: 25;
    color: #696f6a;
    box-shadow: 2px 2px 7px 0px gainsboro;
    border-radius: 10px;
}

.admin-bar.flex-item {
    margin-left: 25;
    margin-right: 25;
    background: white;
    min-width: 95%;
    padding: 20;
    box-shadow: 2px 2px 15px 2px gainsboro;
    border: 1px solid gainsboro;
    border-radius: 10px;
}
.admin-bar.flex-item > a {
    font-size: 1.25em;
    font-weight: 600;
    color: black;
}

span{
    /* display: table-cell; */
  display:block;
  }
input:focus::-webkit-input-placeholder { color:transparent; }
input:focus:-moz-placeholder { color:transparent; } /* FF 4-18 */
input:focus::-moz-placeholder { color:transparent; } /* FF 19+ */
input:focus:-ms-input-placeholder { color:transparent; } /* IE 10+ */
/* 
h1 {
  display: table;
  margin: 40px auto;
  color: #fff;
  font: 20px Helvetica;
  text-transform: uppercase;
  letter-spacing: 3px;
} */

form {
  display: flex;
  margin: 40px auto;
}
form label {
  position: relative;
  /* display: block; */
}
form label input {
  font: 18px Helvetica, Arial, sans-serif;
  box-sizing: border-box;
  /* display: block; */
  border: none;
  padding: 20px;
  margin-bottom: 20px;
  font-size: 18px;
  outline: none;
  transition: all 0.2s ease-in-out;
}
form label input::-webkit-input-placeholder {
  transition: all 0.2s ease-in-out;
  color: #999;
  font: 18px Helvetica, Arial, sans-serif;
}
form label input:-ms-input-placeholder {
  transition: all 0.2s ease-in-out;
  color: #999;
  font: 18px Helvetica, Arial, sans-serif;
}
form label input::-ms-input-placeholder {
  transition: all 0.2s ease-in-out;
  color: #999;
  font: 18px Helvetica, Arial, sans-serif;
}
form label input::placeholder {
  transition: all 0.2s ease-in-out;
  color: #999;
  font: 18px Helvetica, Arial, sans-serif;
}
form label input:focus, form label input.populated {
  padding-top: 28px;
  padding-bottom: 12px;
}
form label input:focus::-webkit-input-placeholder, form label input.populated::-webkit-input-placeholder {
  color: transparent;
}
form label input:focus:-ms-input-placeholder, form label input.populated:-ms-input-placeholder {
  color: transparent;
}
form label input:focus::-ms-input-placeholder, form label input.populated::-ms-input-placeholder {
  color: transparent;
}
form label input:focus::placeholder, form label input.populated::placeholder {
  color: transparent;
}
form label input:focus + span, form label input.populated + span {
  opacity: 1;
  top: 10px;
}
form label span {
    color: #878c88;
    font-weight: 700;
    position: absolute;
    top: -20px !important;
    left: 10px;
    opacity: 0;
    transition: all 0.2s ease-in-out;
}
form input[type="submit"] {
  transition: all 0.2s ease-in-out;
  font: 18px Helvetica, Arial, sans-serif;
  border: none;
  background: #1aaf75;
  color: #fff;
  padding: 16px 40px;
}
form input[type="submit"]:hover {
  background: #109f67;
}

div#item-container {
    display: flex !important;
    flex-wrap: wrap;
    padding-left: 10px;
}

li.flex-item {
    max-width: 33%;
    display: flex;
}
.card-image {
    border-top-left-radius: 10px;
    max-width: 200px;
    border-top-right-radius: 10px;
    min-height: 200px;
    max-height: 200px;
}
output {
  display: none;
}
select#variation {
    min-height: 50px;
    background: #f2f2f2f2;
    width: 40%;
    position: relative;
    left: 29%;
    padding: 20;
}
textarea {
    background: #f2f2f2;
    border: none;
    min-width: 94%;
    min-height: 200px;
    font-size: 1.25em;
    padding: 25;
    color: #696f6a;
    box-shadow: 2px 2px 7px 0px gainsboro;
    border-radius: 10px;
}

.admin-bar.flex-item {
    margin-left: 25;
    margin-right: 25;
    background: white;
    min-width: 95%;
    padding: 20;
    box-shadow: 2px 2px 15px 2px gainsboro;
    border: 1px solid gainsboro;
    border-radius: 10px;
}
.admin-bar.flex-item > a {
    font-size: 1.25em;
    font-weight: 600;
    color: black;
}

span{
    display: table-cell;
  /* display:block; */
  }
input:focus::-webkit-input-placeholder { color:transparent; }
input:focus:-moz-placeholder { color:transparent; } /* FF 4-18 */
input:focus::-moz-placeholder { color:transparent; } /* FF 19+ */
input:focus:-ms-input-placeholder { color:transparent; } /* IE 10+ */

form label {
  position: relative;
  /* display: block; */
}
form label input {
  font: 18px Helvetica, Arial, sans-serif;
  box-sizing: border-box;
  /* display: block; */
  border: none;
  padding: 20px;
  margin-bottom: 20px;
  font-size: 18px;
  outline: none;
  transition: all 0.2s ease-in-out;
}
form label input::-webkit-input-placeholder {
  transition: all 0.2s ease-in-out;
  color: #999;
  font: 18px Helvetica, Arial, sans-serif;
}
form label input:-ms-input-placeholder {
  transition: all 0.2s ease-in-out;
  color: #999;
  font: 18px Helvetica, Arial, sans-serif;
}
form label input::-ms-input-placeholder {
  transition: all 0.2s ease-in-out;
  color: #999;
  font: 18px Helvetica, Arial, sans-serif;
}
form label input::placeholder {
  transition: all 0.2s ease-in-out;
  color: #999;
  font: 18px Helvetica, Arial, sans-serif;
}
form label input:focus, form label input.populated {
  padding-top: 28px;
  padding-bottom: 12px;
}
form label input:focus::-webkit-input-placeholder, form label input.populated::-webkit-input-placeholder {
  color: transparent;
}
form label input:focus:-ms-input-placeholder, form label input.populated:-ms-input-placeholder {
  color: transparent;
}
form label input:focus::-ms-input-placeholder, form label input.populated::-ms-input-placeholder {
  color: transparent;
}
form label input:focus::placeholder, form label input.populated::placeholder {
  color: transparent;
}
form label input:focus + span, form label input.populated + span {
  opacity: 1;
  top: 10px;
}
form label span {
    color: #878c88;
    font-weight: 700;
    position: absolute;
    top: -20px !important;
    left: 10px;
    opacity: 0;
    transition: all 0.2s ease-in-out;
}
form input[type="submit"] {
  transition: all 0.2s ease-in-out;
  font: 18px Helvetica, Arial, sans-serif;
  border: none;
  background: #1aaf75;
  color: #fff;
  padding: 16px 40px;
}
form input[type="submit"]:hover {
  background: #109f67;
}

img.thumbnail {
  width: 150px;
}

.c-form__item {
    margin-left: 20;
    margin-right: 20;
    display: flex;
    flex-direction: column;
}
span.range-label {
    display: flex;
    text-align: center;
    align-self: center;
    align-items: inherit;
    font-weight: 700;
}
li.flex-item {
    max-width: 33%;
    display: flex;
} 
</style>

<ul class="wrapper">
    <div class="admin-bar flex-item">
        <a class="button is-primary" href="/admin/items">Products</a>
        <a class="button is-primary">Orders</a>
        <label>
            <span>Search</span>

        <input type="text" id="search" placeholder="Search"/>
        </label>
    </div>
</ul>

<ul class="flex-container">
    <form>
        <div class="c-form__item">
          <input type="range" multiple value="10,80" name="calories" list="number" min="0" max="60" step="5"  />
          <span class="range-label" for="calories">Calories</span>

          <datalist id="number">
            <option>10</option> 
            <option label="30">30</option> 
            <option>50</option> 
            <option>70</option>
            <option>90</option> 
          </datalist>
          <output class="calories" for="calories" onforminput="value = calories.valueAsNumber;"></output>
              <div id="calories" style="display:inline;"></div>
      
        </div>
        <div class="c-form__item">
          <input type="range" multiple value="10,80" name="fats" list="number" min="0" max="60" step="5" />
          <span class="range-label" for="fats">Fats</span>

          <datalist id="number">
            <option>10</option> 
            <option label="30">30</option> 
            <option>50</option> 
            <option>70</option>
            <option>90</option> 
          </datalist>
          <output class="fats" for="fats" onforminput="value = fats.valueAsNumber;"></output>
          <div id="fats" style="display:inline;"></div>
        </div>
        <div class="c-form__item">
            <input type="range" multiple value="10,80" name="carbs" list="number" min="0" max="60" step="5" />
            <span class="range-label" for="carbs">Carbs</span>

            <datalist id="number">
              <option>10</option> 
              <option label="30">30</option> 
              <option>50</option> 
              <option>70</option>
              <option>90</option> 
            </datalist>
            <output class="carbs" for="carbs" onforminput="value = carbs.valueAsNumber;"></output>
            <div id="carbs" style="display:inline;"></div>
          </div>
        
      </form>
    <nav class="breadcrumb has-dot-seperator categories" aria-label="breadcrumbs">
        <ul>

            @each(category in categories)    
              <li><a data-filter="{{ category}}" class="{{ convertCatName(category) }}">{{category}}</a></li>
            @endeach
          
            <a class="active" onclick="showAllCategories()">All</a>
        </ul>
      </nav>
  <div id="item-container">
  @each(item in items)

  <li class="flex-item" 
    data-id="{{item.id}}" 
    data-category="{{item.metadata.primary_category}}" 
    data-sku="{{item.skus.data[0].id}}" 
    data-desc="{{item.description}}" 
    data-name="{{item.name}}" 
    data-price="{{item.skus.data[0].price}}" 
    data-img_url="{{item.skus.data[0].image}}"
    data-calories="{{item.skus.data[0].metadata.calories}}"
    data-fats="{{item.skus.data[0].metadata.fats}}"
    data-carbs="{{item.skus.data[0].metadata.carbs}}"
  >
      <div class="card-image">
        <img class="card-image" 
          src="{{item.skus.data[0].image}}" 
          id="img_{{item.id}}" 
          alt="Placeholder image"
        >

      </div><!--/card-image-->
      <div class="category-divider-primary is-primary has-background-color-primary"></div>
      <div class="card-content">
        <div class="media">
          <div class="media-content">
            <p class="title is-4">{{ item.name }} <span class="is-pulled-right" style="color:#F48566;">${{ item.skus.data[0].price }}</span></p>
          </div><!--/media-content-->
        </div><!--/media-->
        <div class="content">
          <img class="filter-icon" src="/images/oval-icon.png" />
          @if(item.skus.data[1])
          <select>
            @each(sku in item.skus.data)
            <option>{{sku.attributes.protein_type}}</option>
            @endeach
          </select>
          @endif
          <a class="checkout-prompt-1" 
            data-id="{{item.id}}" 
            data-sku="{{item.skus.data[0].id}}" 
            data-name="{{item.name}}" 
            data-price="{{item.skus.data[0].price}}" 
            data-img_url="{{item.skus.data[0].image}}" 
            data-quantity="1" 
            href="#" 
            class="is-pulled-right"
          >
            <a href="/admin/items/{{item.id}}"><i class="fa fa-edit"></i></a>
            <i class="fa fa-remove"></i>
          </a>
        </div><!--/content-->

      </div><!--/card-content-->

    </li><!--/card-->
    
  <div class="modal" id="modal-{{item.id}}">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Delete {{item.name}} ?</p>
          <a class="delete" aria-label="close" onclick="closeModal()"></a>
        </header>
        <section class="modal-card-body">
          Are you sure you want to delete this item?  By clicking continue you will remove this item fromcart tota the database
          as well as delete any saved images of this item.  This will also remove this item from all associated filters
          and categories.
        </section>
        <footer class="modal-card-foot">
          <a class="button is-danger" href="/item/delete/{{item.id}}" onclick="launchModal({{item.id}})">Delete Item</a>
          <a class="button close-modal" onclick="closeModal()">Cancel</a>
        </footer>
      </div>
  </div>
    </li><!--/modal-->
@endeach
  </div>
</ul>

<script src="https://code.jquery.com/jquery-2.1.1.js"></script>
<script async type="text/javascript" src="https://unpkg.com/bulma-modal-fx/dist/js/modal-fx.min.js"></script>
<script async src="/js/slider.min.js"></script>

  <script>
$(document).ready(function(){

  $('.modal-close').on('click', function(){
    $('.modal').removeClass('is-active')
  })
})


$(".modal-close").click(function() {
$("[class*='is-active']").removeClass("is-active");
});

var prefs = {};
var stores = {
type: "FeatureCollection",
features: [
{
  type: "Feature",
  geometry: {
    type: "Point",
    coordinates: ["-85.3171557", "35.0691112"]
  },
  properties: {
    phoneFormatted: "(423) 555-5555",
    phone: "4235555555",
    address: "601 Cherokee Blvd",
    postalCode: 37405,
    state: "TN",
    city: "Chattanooga",
    closing: "20:00",
    desc: "Vibrant Meals Kitchen",
    storeId: 1
  }
},
{
  type: "Feature",
  geometry: {
    type: "Point",
    coordinates: ["-85.3106732", "35.0641196"]
  },
  properties: {
    phoneFormatted: "(423) 555-5555",
    phone: "4235555555",
    address: "125 Cherokee Blvd",
    postalCode: 37405,
    state: "TN",
    city: "Chattanooga",
    closing: "20:00",
    desc: "Chattanooga Functional Fitness",
    storeId: 2
  }
},
{
  type: "Feature",
  geometry: {
    type: "Point",
    coordinates: ["-85.31406600000003", "35.0389277"]
  },
  properties: {
    phoneFormatted: "(423) 555-5555",
    phone: "4235555555",
    address: "525 West Main Street",
    postalCode: 37402,
    state: "TN",
    city: "Chattanooga",
    closing: "20:00",
    desc: "Kyle House Fitness",
    storeId: 3
  }
},
{
  type: "Feature",
  geometry: {
    type: "Point",
    coordinates: ["-84.76723400000003", "35.134262"]
  },
  properties: {
    phoneFormatted: "(423) 555-5555",
    phone: "4235555555",
    address: "5806 Waterlevel Highway",
    postalCode: 37323,
    state: "TN",
    city: "Cleveland",
    closing: "20:00",
    desc: "Crossfit Anistemi",
    storeId: 4
  }
},
{
  type: "Feature",
  geometry: {
    type: "Point",
    coordinates: ["-84.8766215", "35.157391"]
  },
  properties: {
    phoneFormatted: "(423) 555-5555",
    phone: "4235555555",
    address: "282 Church St SE",
    postalCode: 37311,
    state: "TN",
    city: "Cleveland",
    closing: "20:00",
    desc: "Body By Hannah",
    storeId: 5
  }
}
]
};



$(document).find('.categories > a').on('click', function(){
  $("#item-container > li.flex-item[data-category!='"+this.className+"']").toggle()
})



window.addEventListener("resize", function(){
var cart = $('#cart')
if (window.innerWidth < 1100) {
  cart.css('display', 'none')
  $('.flex-container').css('width','100%')
} else {
  cart.css('display', 'flex')
  $('.flex-container').css('width','100%')
}
})

var posts = $('.flex-item:not(.admin-bar)');
// posts.hide();
// posts.fadeOut()

// Click function
$( ".categories li a" ).click(function() { 
    // Get data of category
    var customType = $( this ).data('filter'); // category

    posts
        .hide()
        .filter(function () {
          console.log()
            return $(this).data('category') === customType;
        })
        .fadeIn();
});

function showAllCategories(){
  $('.flex-item').fadeIn()
}

$('#search').on('keyup', function(){
  var searchResult = $('#search').val()
  searchResult = searchResult.replace(/ /g, '_')
  searchResult = searchResult.toLowerCase()
  
  posts
        .hide()
        .filter(function () {
          console.log()
            return $(this).data('id').includes(searchResult);
        })
        .fadeIn();

})

//Function for placeholders
$(function() {
    var inputs = $('input, textarea')
    inputs.each(function(){
        var i = $(this)
        if (i.val() == 'undefined') {i.val('')}
        if (i.val().length) {
            i.addClass('populated');
        } else {
            i.removeClass('populated');
        }
    })
  $('input').on('change', function() {
    var input = $(this);
    if (input.val().length) {
      input.addClass('populated');
    } else {
      input.removeClass('populated');
    }
  });
  
  setTimeout(function() {
    $('#fname').trigger('focus');
  }, 500);
});
 </script>




Laptop - 1011.63
Server - 1,355.76
Hard drive upgrades - 826.29 


<a id="deliveryDate"><div class="cart-icon"><i class="fa fa-calendar" style="font-size:4em; color:#3b8f6b;"></i></div><div class="cart-icon-label" id="delivery-date-label">Your order will be ready for pickup between 8am and 4pm <br>Wednesday<br>Feb 27</div></a>