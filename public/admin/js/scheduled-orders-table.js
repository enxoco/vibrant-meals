
$(document).ready(function() {
   var buttonCommon = {
      exportOptions: {
          format: {
              body: function ( data, row, column, node ) {
                  // Strip $ from salary column to make it numeric
                  return removeBlanksAndSpaces(data) 
              },
              
          }
      }
   }



   var exportTable = $('#productNeededExport').DataTable( {
      select: true,
      dom: 'Bfrtip',
      colReorder: true,
      order: [[0, 'desc']],
      buttons: [
        'pdfHtml5',
        'selectAll',
        'selectNone',
        $.extend( true, {}, buttonCommon, {
         extend: 'csv',
         filename: 'Packing and Delivery List'
     } ),
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
   } );
   var ordersTable = $('#pickups').DataTable( {
      select: true,
      dom: 'Bfrtip',
      colReorder: true,
      order : [[1, 'desc']],
      filename: 'Scheduled Orders',
      buttons: [
         $.extend( true, {}, buttonCommon, {
            extend: 'csv',
            filename: 'Scheduled Orders'
        } ),
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
  
})



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

function removeBlanksAndSpaces(data){
  return data.replace(/<br>/g, '').replace(/  /g, '').replace(/^\s*[\r\n]/gm, '')

}