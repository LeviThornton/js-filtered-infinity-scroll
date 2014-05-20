jQuery(document).ready(function($) {
    
	// set some value to be used
	var results_page = 0; // starting table row count, we incroment by the results_limit
	var results_limit = 12; // how many items to show per page
	var orderBy = "DESC";  //ASC / DESC
	var filter_audience;
	var filter_type;
	var filterContextMap = new Array();
	var filterTypeMap = new Array();
	var append = false;
	
	// Method used by all actions to show content, page, whatever
	function poster(showSpinner) {
		if(showSpinner) $('.has-spinner').toggleClass('active');
		// post data
			 $.post('/wp-admin/admin-ajax.php', { 
			 	action: 'sm_whatsnew_filter', 
			 	context: filterContextMap, 
			 	type: filterTypeMap,
			 	posts_per_page: results_limit,
			 	offset: results_page,
			 	order_by: orderBy 
			 	
			 }, function(data){
			 	// append the results
			 	if(append) {
			 		$( "#whats-new-item-list" ).append( data );
			 	} else {
			 		$( "#whats-new-item-list" ).html( data );
			 	}
				 console.log("pager: "+results_page);
				 if(showSpinner)  $('.has-spinner').toggleClass('active');
				 
			 });
			 // added the offset counter here so it keeps paging without showing more content #cheaphack
			 results_page = results_limit+results_page;			 
	}
	// first time the page loads
	poster(true);
	
	// Stop Propagation
	$('#filter-button').on('show.bs.dropdown', function (e) { e.stopPropagation(); });
	$('#filter-button .dropdown-menu li').click(function(e) { e.stopPropagation(); });

	// order by selectors
	$('.orderBy').on("click", function(obj){
		orderBy = $(this).attr('id');
		append = false;
		results_page = 0;
		// fire update
		poster(true);
	});
	
	// toggle filters and update data point/results
	$('li .cat-item span').on("click", function(){
		
			//reset counter
			append = false;
			results_page = 0;
			filterContextMap = new Array();
			filterTypeMap = new Array();
	
			// toggle filters
		   $(this).closest('span').toggleClass('glyphicon-check glyphicon-unchecked');
		   
		   
		   // toggle context filter
		   if($(this).prev('input').prop('checked')) {
		   		$(this).prev('input').attr("checked", false);
		   } else {
		   		$(this).prev('input').attr("checked", true);
		   } 
		   
		   // map the checked filters BY FILTER context and type!!!
		   $("input:checkbox[name=filter_context]:checked").each(function()
			{
				filterContextMap.push($(this).val());
			    console.log($(this).val());
			});
			
		   $("input:checkbox[name=filter_type]:checked").each(function()
			{
				filterTypeMap.push($(this).val());
			    console.log($(this).val());
			});
			
			poster(true);
	});
     
 	 // Hit bottom of page, load something
	 $(window).scroll(function() { 
	 	 append = true;
			
		 if ($(window).scrollTop() + $(window).height() >  $(document).height() * 0.80) { // infinity
			 console.log('bottom');
			 poster(true);
		 }
	 });
	   
});