function animatePageLoad() {
	$('#nav-bar').hide().fadeIn(700);
	$('[id=animate-right]').animate({right: 0}, 700);
	$('[id=animate-left]').animate({left: 0}, 700);                        
}

function submitLoginForm() {
    var query_string = "http://futureblue.torolab.ibm.com:9081/futureblue-1.0-SNAPSHOT/user/validate";
	var inputs = $('#login-form-modal :input');
	var values = {};

    inputs.each(function() {
        values[this.name] = $(this).val();
    });
    
    query_string += "/?email=" + values['email'];
    
    var request = $.ajax({
        url: query_string,
        type: "GET",
        contentType: "application/json",
        crossDomain: true,
        dataType: 'jsonp',
        success: function(response) {
           if(response['userid'] < 0){
                $('#login-fail').removeClass('hidden').hide().fadeIn('slow');
           }else{
                var url="";
                if(response['usertype']=="owner")
                    url = 'home.html';
                else url= 'rider.html';
                
                url += '?firstname=' + response['firstname'];
                url += '&lastname=' + response['lastname'];
                url += '&ownerid=' + response['userid'];
                window.location = url;
           }
        }
    });
    
    request.done(function(response) {
		console.log("login-done:" + response);
	});

	request.fail(function(jqXHR, textStatus) {
  		console.log( "login-failed: " + textStatus );
	});

}


function submitRegForm() {
	var query_string = "http://futureblue.torolab.ibm.com:9081/futureblue-1.0-SNAPSHOT/user/userdata/register/";
	var inputs = $('#reg-form :input');
	var values = {};

	inputs.each(function() {
        values[this.name] = $(this).val();
    });

    query_string += "?lastname=" + values["last-name"];
	query_string += "&firstname=" + values["first-name"];
	query_string += "&email=" + values["email"];
	query_string += "&phone=" + values["phone"];
	query_string += "&usertype=" + $('input[type=radio]:checked').val();
	query_string += "&teamid=4";

	var request = $.ajax({
		url: query_string,
		type: "POST",
		contentType: "application/json",
		crossDomain: true,
		dataType: 'jsonp',
		success: function(response) {
	  		console.log("reg-success: " + response['response_code']);
            
	  		if(response['response_code']==0){
                var login_query = "http://futureblue.torolab.ibm.com:9081/futureblue-1.0-SNAPSHOT/user/validate";
                login_query += "/?email=" + values['email'];
                
                var nested_ajax = $.ajax({
                    url: login_query,
                    type: "GET",
                    contentType: "application/json",
                    crossDomain: true,
                    dataType: 'jsonp',
                    success: function(data) {
                        $('#regSuccessModal').modal('toggle');
                        $('#continue').click(function() {
                            var url;
                            if($('input[type=radio]:checked').val() == "owner")
                                url = 'home.html';
                            else url = 'rider.html';
                            url += '?firstname=' + data['firstname'];
                            url += '&lastname=' + data['lastname'];
                            url += '&ownerid=' + data['userid'];
                            window.location = url;
                        });
                    }
                });
                
                nested_ajax.done(function(response) {
                    console.log("login-done:" + response);
                });

                nested_ajax.fail(function(jqXHR, textStatus) {
                    console.log( "login-failed: " + textStatus );
                });
	  	    }else{
                console.log("reg-failure: " + response['response_code']);   
            }
        }
	});

	request.done(function(response) {
		console.log("reg-done:" + response);
	});

	request.fail(function(jqXHR, textStatus) {
  		console.log( "reg-failed: " + textStatus );
	});

	return false;
}

/* Stack Navigation Pills by changing div class below given width */
function ResponsiveNavPills (width_limit){
	$(window).resize(function(){
	   	console.log('resize called');
	   	var width = $(window).width();
	   	if(width <= width_limit){
	      	 $('#navigation').addClass('nav-stacked').addClass('pull-left');
	   	}else{
	   	  	 $('#navigation').removeClass('nav-stacked').removeClass('pull-left');
	   	}
	}).resize();
}

/* JQuery UI Login Modal*/
function LoginModal(modal_div_id, nav_pill_id){
	$(modal_div_id).dialog({
		open:function(){
			$('body').bind('click', function(e) {
		        if($("#modal-message").dialog('isOpen')
		            && !$(e.target).is('.ui-dialog, a')
		            && !$(e.target).closest('.ui-dialog').length
		        )
		  		
		  		$("#modal-message").dialog('close');
   			 });

			$(window).resize(function() {
    			$("#modal-message").dialog("option", "position", "center");
			});

			$('#sign-up-link').click(function(){
				$("#modal-message").dialog('close');
			});
		},
		autoOpen: false,
		modal: true,
		draggable:false,
		resizable:false,
		show: {
			effect: "drop",
			duration: 500
		},
		hide: {
			effect: "drop",
			duration: 500
		}
	});

	$(nav_pill_id).click(function(){
		$(modal_div_id).dialog('open');
		return false;
	});
}

/* document ready, run functions */
$(function(){
	animatePageLoad();
	ResponsiveNavPills(274);
	LoginModal("#modal-message","#pill-login");
});

