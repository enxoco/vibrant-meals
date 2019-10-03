var table = $('table');
    
$('#orderId, #name, #email, #location, #total, #day, #date, #type, #status, #delivery_notes')
    .each(function(){
        
        var th = $(this),
            thIndex = th.index(),
            inverse = false;
        
        th.click(function(){
            console.log(thIndex)
            
            table.find('td').filter(function(){
                
                return $(this).index() === thIndex;
                
            }).sortElements(function(a, b){
                
                return $.text([a]) > $.text([b]) ?
                    inverse ? -1 : 1
                    : inverse ? 1 : -1;
                
            }, function(){
                
                // parentNode is the element we want to move
                return this.parentNode; 
                
            });
            
            inverse = !inverse;
                
        });
            
    });
