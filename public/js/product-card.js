
	$("#pickupButton").click(function() {
		$('#deliveryButton').attr('checked', false)
	});
	$("#deliveryButton").click(function() {
		$('#pickupButton').attr('checked', false)
	});
	

	$("#monButton").click(function() {
		$('#wedButton').attr('checked', false)
	});
	$("#wedButton").click(function() {
		$('#monButton').attr('checked', false)
	});

$('.hover').hover(function(){
	$(this).addClass('flip');
},function(){
	$(this).removeClass('flip');
});

$('.paleo-filter').click(function() {

var paleoItems = $("[data-diet-paleo=1]")
	if (paleoItems.is(':hidden')) {
		$(this).removeClass('is-success')
		$(this).addClass('is-info')
		paleoItems.show()
		$("[data-diet-whole30=1]").hide()
		$("[data-diet-keto=1]").hide()
		$("[data-diet-lowCarb=1]").hide()
	} else {
		$(this).removeClass('is-info')
		$(this).addClass('is-success')
		paleoItems.hide()


	}
})

$('.keto-filter').click(function() {
	var ketoItems = $("[data-diet-keto=1]")

		if (ketoItems.is(':hidden')) {
			$(this).removeClass('is-success')
			$(this).addClass('is-info')
			ketoItems.show()
		} else {
			$(this).removeClass('is-info')
			$(this).addClass('is-success')
			ketoItems.hide()
		}
	})

	$('.whole30-filter').click(function() {
		var whole30Items = $("[data-diet-whole30=1]")
			if (whole30Items.is(':hidden')) {
				$(this).removeClass('is-success')
				$(this).addClass('is-info')
				whole30Items.show()
			} else {
				$(this).removeClass('is-info')
				$(this).addClass('is-success')
				whole30Items.hide()
			}
		})


// ((dropClasses, forEach) => {
// 	customElements.define(
// 	  'bulma-tile',
// 	  class extends HTMLElement {
// 		static get observedAttributes() {
// 		  return ['size', 'vertical'];
// 		}
// 		attributeChangedCallback() {
// 		  this.update();
// 		}
// 		connectedCallback() {
// 		  this.update();
// 		}
// 		update() {
// 		  const classes = ['tile'];
// 		  const {nodeName} = this;
// 		  if (this.observer) {
// 			this.observer.disconnect();
// 			this.observer = null;
// 		  }
// 		  if (this.parentNode.nodeName === nodeName) {
// 			const child = this.firstElementChild;
// 			if (child && child.nodeName !== nodeName) {
// 			  classes.push('is-parent');
// 			  forEach(
// 				this.children,
// 				child => child.classList.add('tile', 'is-child')
// 			  );
// 			}
// 		  } else {
// 			classes.push('is-ancestor');
// 			this.observer = new MutationObserver(records => {
// 			  let update = false;
// 			  forEach(
// 				records,
// 				record => {
// 				  if (record.target.nodeName === nodeName) {
// 					update = true;
// 					forEach(
// 					  record.removedNodes,
// 					  target => {
// 						if (target.nodeType === 1)
// 						  dropClasses(target);
// 					  }
// 					);
// 				  }
// 				}
// 			  );
// 			  if (update) {
// 				forEach(
// 				  this.querySelectorAll(nodeName),
// 				  tile => tile.update()
// 				);
// 			  }
// 			});
// 			this.observer.observe(this, {
// 			  childList: true,
// 			  subtree: true
// 			});
// 		  }
// 		  if (this.size)
// 			classes.push('is-' + this.size);
// 		  if (this.hasAttribute('vertical'))
// 			classes.push('is-vertical');
// 		  dropClasses(this);
// 		  this.classList.add(...classes);
// 		}
// 	  }
// 	);
//   })(
// 	el => {
// 	  el.classList.remove(
// 		'tile',
// 		'is-ancestor',
// 		'is-parent',
// 		'is-child',
// 		'is-1', 'is-2', 'is-3',
// 		'is-4', 'is-5', 'is-6',
// 		'is-7', 'is-8', 'is-9',
// 		'is-10', 'is-11', 'is-12'
// 	  );
// 	},
// 	(list, fn) => {
// 	  const length = list.length;
// 	  for (let i = 0; i < length; i++)
// 		fn(list[i]);
// 	}
	// );
	
