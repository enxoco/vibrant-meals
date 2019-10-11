
$(document).ready(function () {
   var buttonCommon = {
      exportOptions: {
         format: {
            body: function (data, row, column, node) {
               // Strip $ from salary column to make it numeric
               return removeBlanksAndSpaces(data)
            },

         }
      }
   }

   var exportTable = $('#productNeededExport').DataTable({
      select: true,
      dom: 'Bfrtip',
      colReorder: true,
      order: [[0, 'desc']],
      buttons: [
         'pdfHtml5',
         'selectAll',
         'selectNone',
         $.extend(true, {}, buttonCommon, {
            extend: 'csv',
            filename: 'Packing and Delivery List'
         }),
      ],

      "columnDefs": [
         {
            "width": "10%", "targets": 0
         },
         {
            "width": "10%", "targets": 1
         },
         {
            "width": "20%", "targets": 2
         }
      ]
   });
   let today = moment().startOf('isoWeek')


   renderOrdersTable(moment().startOf('isoWeek').format('YYYY-MM-DD'), moment().endOf('isoWeek').format('YYYY-MM-DD'))


})



$("#fulfilled").on('click', function () {
   $.fn.dataTable.ext.search.pop();
   //  ordersTable.draw();
   $.fn.dataTable.ext.search.push(
      function (settings, data, dataIndex) {
         return $(ordersTable.row(dataIndex).node()).attr('data-status') == 'fulfilled';
      }
   );
   //  ordersTable.draw();
});

$("#paid").on('click', function () {
   $.fn.dataTable.ext.search.pop();
   //  ordersTable.draw();
   $.fn.dataTable.ext.search.push(
      function (settings, data, dataIndex) {
         return $(ordersTable.row(dataIndex).node()).attr('data-status') == 'paid';
      }
   );
   //  ordersTable.draw();
});

$("#refunded").on('click', function () {
   $.fn.dataTable.ext.search.pop();
   // ordersTable.draw();
   $.fn.dataTable.ext.search.push(
      function (settings, data, dataIndex) {
         return $(ordersTable.row(dataIndex).node()).attr('data-status') == 'refunded';
      }
   );
   // ordersTable.draw();
});

$("#canceled").on('click', function () {
   $.fn.dataTable.ext.search.pop();
   // ordersTable.draw();
   $.fn.dataTable.ext.search.push(
      function (settings, data, dataIndex) {
         return $(ordersTable.row(dataIndex).node()).attr('data-status') == 'canceled';
      }
   );
   // ordersTable.draw();
});

$("#pickupOrders").on('click', function () {
   $('#locationHeader').html('Store')
   $.fn.dataTable.ext.search.pop();
   //  ordersTable.draw();
   let start = $('input[name="start"]').val()
   let end = $('input[name="end"]').val()
   ordersTable.ajax.url('/api/orders/filtered/date/' + start + '/' + end + '/all/pickup').load()

   //  ordersTable.draw();
});


$('#deliveryOrders').on('click', function () {
   $('#locationHeader').html('Delivery Address')
   $.fn.dataTable.ext.search.pop();
   let start = $('input[name="start"]').val()
   let end = $('input[name="end"]').val()
   ordersTable.ajax.url('/api/orders/filtered/date/' + start + '/' + end + '/all/delivery').load()

});

function removeBlanksAndSpaces(data) {
   return data.replace(/<br>/g, '').replace(/  /g, '').replace(/^\s*[\r\n]/gm, '')

}


var buttonCommon = {
   exportOptions: {
      format: {
         body: function (data, row, column, node) {
            // Strip $ from salary column to make it numeric
            return removeBlanksAndSpaces(data)
         },

      }
   }
}
ordersTable = $('#pickups').DataTable({
   select: true,
   dom: 'Bfrtip',
   processing: true,
   order: [[0, 'desc']],

   ajax: '/api/orders/filtered/date/' + moment().startOf('isoWeek').format('YYYY-MM-DD') + '/' + moment().endOf('isoWeek').format('YYYY-MM-DD') + '/all',
   columns: [
      {
         "render": function (data, type, row) {
            return '<a href="/orders/' + row.orderId + '">' + row.orderId + '</a>'
         }
      },
      { "data": "name" },
      { "data": "email" },
      { "data": "location" },
      {
         "render": function (data, type, row) {
            var amount = '$' + row.order_amount / 100
            return amount
         }
      },
      { "data": "fulfillment_day" },
      {
         "render": function (data, type, row) {
            let date = moment(row.fulfillment_date).format('ll')
            return date
         }
      },
      { "data": "fulfillment_method" },
      { "data": "order_status" },
      { "data": "delivery_info" },
      {
         "render": function (data, type, row) {
            return "<a class='btn btn-success' href='/admin/orders/fulfill/" + row.orderId + "'>Fulfill</a><input type='hidden' id='orderId' value='" + row.orderId + "'/>"
         }
      }
   ],
   colReorder: true,
   filename: 'Scheduled Orders',
   buttons: [
      $.extend(true, {}, buttonCommon, {
         extend: 'csv',
         filename: 'Scheduled Orders'
      }),
      'pdfHtml5',
      'selectAll',
      'selectNone',

      {
         text: 'Batch Fulfill',
         className: 'btn-success',
         action: function (e, dt, node, config) {
            var rows = dt.rows('.selected').data()
            var ids = []
            for (var i = 0; i < rows.length; i++) {
               var id = rows[i][0]
               ids.push(id)
            }
            $.ajax({
               type: 'POST',
               url: '/admin/orders/batch',
               data: { ids: ids },
               success: function (res) {
                  toastr['success']('Orders fulfilled')
                  window.location.reload()

               },
               error: function () {
                  toastr['warning']('Something went wrong')
               }
            })

         }
      }
   ]

});



//Monday kitchen sheet

mondaySkus = $('#productNeededMonday').DataTable({
   select: true,
   dom: 'Bfrtip',
   processing: true,
   order: [[0, 'desc']],

   ajax: '/api/orders/filtered/date/' + moment().startOf('isoWeek').format('YYYY-MM-DD') + '/' + moment().endOf('isoWeek').format('YYYY-MM-DD') + '/monday/sku',
   columns: [

      { "data": "sku" },
      { "data": "quantity" },
      { "data": "date"}
   ],
   colReorder: true,
   filename: 'Scheduled Orders',
   buttons: [
      $.extend(true, {}, buttonCommon, {
         extend: 'csv',
         filename: 'Scheduled Orders'
      }),
      'pdfHtml5',
      'selectAll',
      'selectNone'
   ]

});

thursdaySkus = $('#productNeededThursday').DataTable({
   select: true,
   dom: 'Bfrtip',
   processing: true,
   order: [[0, 'desc']],

   ajax: '/api/orders/filtered/date/' + moment().startOf('isoWeek').format('YYYY-MM-DD') + '/' + moment().endOf('isoWeek').format('YYYY-MM-DD') + '/thursday/sku',
   columns: [

      { "data": "sku" },
      { "data": "quantity" },
      { "data": "date"}
   ],
   colReorder: true,
   filename: 'Scheduled Orders',
   buttons: [
      $.extend(true, {}, buttonCommon, {
         extend: 'csv',
         filename: 'Scheduled Orders'
      }),
      'pdfHtml5',
      'selectAll',
      'selectNone'
   ]

});





$('input[name="start"], input[name="end"]').on('change', function () {
   let start = $('input[name="start"]').val()
   let end = $('input[name="end"]').val()
   ordersTable.ajax.url('/api/orders/filtered/date/' + start + '/' + end + '/all').load()

})
function updateOrdersView() {
   let start = $('input[name="start"]').val()
   let end = $('input[name="end"]').val()
   ordersTable.ajax.url('/api/orders/filtered/date/' + start + '/' + end + '/all').load()
   mondaySkus.ajax.url('/api/orders/filtered/date/' + start + '/' + end + '/monday/sku').load()
   thursdaySkus.ajax.url('/api/orders/filtered/date/' + start + '/' + end + '/thursday/sku').load()


}

