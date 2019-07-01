var ordersTable = $('#pickups').DataTable( {
    select: true,
    dom: 'Bfrtip',
    colReorder: true,
    buttons: [
      'csv',
      'pdfHtml5',
      'selectAll',
      'selectNone',
      {
        text: 'Batch Fulfill',
        className: 'btn-success',
        action: function ( e, dt, node, config) {
          var rows = dt.rows('.selected').data()
          var ids = []
          for (var i = 0; i < rows.length; i++) {
            var id = rows[i][0]
            ids.push(id)
          }
          $.ajax({
            type: 'POST',
            url: '/admin/orders/batch',
            data: {ids: ids},
            success: function(res) {
              toastr['success']('Orders fulfilled')
              window.location.reload()
              
            },
            error: function(){
              toastr['warning']('Something went wrong')
            }
          })

        }
      }
    ]
} );

$("#fulfilled").on('click', function() {
    $.fn.dataTable.ext.search.pop();
    ordersTable.draw();
    $.fn.dataTable.ext.search.push(
       function(settings, data, dataIndex) {
          return $(ordersTable.row(dataIndex).node()).attr('data-status') == 'fulfilled';
       }
    );
    ordersTable.draw();
});    

$("#paid").on('click', function() {
    $.fn.dataTable.ext.search.pop();
    ordersTable.draw();
    $.fn.dataTable.ext.search.push(
       function(settings, data, dataIndex) {
          return $(ordersTable.row(dataIndex).node()).attr('data-status') == 'paid';
       }
    );
    ordersTable.draw();
});    

$("#refunded").on('click', function() {
   $.fn.dataTable.ext.search.pop();
   ordersTable.draw();
   $.fn.dataTable.ext.search.push(
      function(settings, data, dataIndex) {
         return $(ordersTable.row(dataIndex).node()).attr('data-status') == 'refunded';
      }
   );
   ordersTable.draw();
});   

$("#canceled").on('click', function() {
   $.fn.dataTable.ext.search.pop();
   ordersTable.draw();
   $.fn.dataTable.ext.search.push(
      function(settings, data, dataIndex) {
         return $(ordersTable.row(dataIndex).node()).attr('data-status') == 'canceled';
      }
   );
   ordersTable.draw();
});    

$("#pickupOrders").on('click', function() {
   $('#locationHeader').html('Store')
    $.fn.dataTable.ext.search.pop();
    ordersTable.draw();
    $.fn.dataTable.ext.search.push(
       function(settings, data, dataIndex) {
          return $(ordersTable.row(dataIndex).node()).attr('data-method') == 'pickup';
       }
    );
    ordersTable.draw();
});  

$('#deliveryOrders').on('click', function() {
   $('#locationHeader').html('Delivery Address')
    $.fn.dataTable.ext.search.pop();
    ordersTable.draw();
    $.fn.dataTable.ext.search.push(
       function(settings, data, dataIndex) {
          return $(ordersTable.row(dataIndex).node()).attr('data-method') == 'delivery';
       }
    );
    ordersTable.draw();
});    


