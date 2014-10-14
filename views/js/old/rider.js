var firstname,lastname;

function getURLParam(name) {
    return decodeURI(
        (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
    );
}

function createNewCarpool(){
    var url = "http://futureblue.torolab.ibm.com:9081/futureblue-1.0-SNAPSHOT/carpool/carpooldata/register/";
    var inputs = $('#new-carpool-form :input');
	var values = {};

	inputs.each(function() {
        values[this.name] = $(this).val();
    });
    
    url += "?ownerid=" + getURLParam('ownerid');
    url += "&pointa=" + values['pointa'];
    url += "&pointb=" + values['pointb'];
    url += "&arrivetime=" + values['arrivetime'] + ":" + values['arrivemin'] + ((values['arrivetime-type']==1)? "am":"pm");
    url += "&departtime=" + values['departtime'] + ":" + values['departmin'] + ((values['arrivetime-type']==2)? "am":"pm");
    url += "&pickuppoints=" + getSelectOptions('#locationbox');
    url += "&description=" + values['description'];
    url += "&location=" + values['location'];
    url += "&seats=" + values['seats'];
    url += "&teamid=4";
    
    var request = $.ajax({
        "url": url,
        type: "GET",
        contentType: "application/json",
        crossDomain: true,
        dataType: 'jsonp',
        success: function(response) {
           if(response['response_code'] < 0){
                alert(response['response_status']);
           }else{
                $('#CreateCarpoolSuccessModal').modal('toggle');
                $('#new-carpool-form')[0].reset();
                $('#locationbox option').each(function() {
                    $(this).remove();
                });
                
                $('#CreateCarpoolSuccessModal').on('hidden',function(){
                    $('#add-carpool-hidden').addClass('hidden');
                    $('[id=actions-menu]').removeClass('hidden').hide().fadeIn('slow');
                });
                
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

function buildPagination(arr_len){
    var numPages = 0;
    if(arr_len > 5){
        numPages = Math.ceil(arr_len/5);
    }
    
    $('.pagination ul').append('<li><a id="prev" href="#">Prev</a></li>');
    
    for(var i=1; i<=numPages; i++){
        if(i==1)
            $('.pagination ul').append('<li id="'+i+'" class="active"><a id="page'+i+'" href="#">'+i+'</a></li>'); 
        else
            $('.pagination ul').append('<li id="'+i+'"><a id="page'+i+'" href="#">'+i+'</a></li>'); 
    }
    
    $('.pagination ul').append('<li><a id="next" href="#">Next</a></li>');
    
    $('#next').click(function(e){
        e.preventDefault();
        var active = $('.pagination li[class=active]');
        var id = parseInt(active.attr('id'));
        if(id>=1 && id<numPages){
            id += 1;
            $('#page'+id).trigger('click');
        }
    });
    
    $('#prev').click(function(e){
        e.preventDefault();
        var active = $('.pagination li[class=active]');
        var id = parseInt(active.attr('id'));
        if(id>1 && id<=numPages){
            id -= 1;
            $('#page'+id).trigger('click');
        }
    });
    
    for(var i=0; i<numPages; i++){
        (function(){
            var num = i+1;
            var start = i*5;
            var lim = start + 5;
            $('#page'+num).click(function(e){
                e.preventDefault();
                $('.pagination li[class=active]').removeClass('active');
                $('#'+num).addClass('active');
                for(var j=0; j<arr_len; j++){
                    if(j>=start && j<lim)
                        $('#content-row'+j).removeClass('hidden').hide().fadeIn();
                    else $('#content-row'+j).addClass('hidden');
                }
            });
        })();
    }
    
    
}

function getCarpoolSuccessHandler (response_array) {
    for(var i=0; i<response_array.length; i++){
        response=response_array[i];
        if(response['carpoolid']>0){
            $('#carpool-tab').addClass('hidden');

            var accordianHTML = '<tr id="content-row"><td id="collapse-row" colspan="6">';
            accordianHTML +=  '<div class="accordian-body collapse out" id="target">'; 
            accordianHTML += '</div></td></tr>';

            var accordianContent = "";
            var row= '<tr id="content-row'+i+'" data-toggle="collapse" data-target="#target"';
            if(i<5)
                row += 'class="accordion-toggle"></tr>';
            else
                row += 'class="hidden accordion-toggle"></tr>';

            var rowDOM = $('tbody').append(row);
            for(key in response){
                if(response[key]!=null && !(response[key] instanceof Object)){
                    if(key=="pickupPoints"){
                        response[key] = response[key].slice(0,-1);   
                    }
                    if(i==0)
                        $('#header-row').append('<th>'+key+'</th>');

                    $('#content-row'+i).append('<td>'+response[key]+'</td>');
                }
            }

            $('#carpool-info').removeClass('hidden').hide().fadeIn('slow');
       }
    }
    
    buildPagination(response_array.length);
    $('#page1').trigger('click');
    
    $('#carpool-table').find('tr').click(function(){
        var url = "http://futureblue.torolab.ibm.com:9081/futureblue-1.0-SNAPSHOT/join/request/register/?";
        url += "status=pending&teamid=4";
        url += "&userid=" + getURLParam('ownerid') + "&carpoolid=" + $(this).find('td').eq(0).html();
        
        $('#RequestModal').modal('toggle');

        $('#request-btn').click(function(e){
            e.preventDefault();
            var request = $.ajax({
            "url": url,
            type: "GET",
            contentType: "application/json",
            crossDomain: true,
            dataType: 'jsonp',
            success: function(response){
                       if(response['response_code'] < 0){
                            $('#modal-msg').html('<p id="modal-msg">Error: request failed>/p>');
                            $('.alert').removeClass('alert-success').addClass('alert-danger');
                        }else{
                            $('#request-msg').addClass('hidden');
                            $('#request-btn').attr('disabled',true);
                            $('.alert-success').removeClass('hidden').hide().fadeIn('slow');
                        }
                    }
            });

            request.done(function(response) {
                console.log("login-done:" + response);
            });

            request.fail(function(jqXHR, textStatus) {
                console.log( "login-failed: " + textStatus );
            });
            
            $('#RequestModal').on('hidden', function () {
                $('#request-btn').attr('disabled',false);
                $('#request-msg').removeClass('hidden');
                $('.alert-success').addClass('hidden');
            });
        });   
    });
}

function getRequests(){
    var url = 'http://futureblue.torolab.ibm.com:9081/futureblue-1.0-SNAPSHOT/join/request/';
    url += '?userid=' + getURLParam('ownerid');
    var request = $.ajax({
            "url": url,
            type: "GET",
            contentType: "application/json",
            crossDomain: true,
            dataType: 'jsonp',
            success: function(response_array){
                       if(response_array.length > 0){
                            $('#request-tab-msg').addClass('hidden');
                            $("#request-body tr").remove();
                            for(var i=0; i<response_array.length; i++){
                                response=response_array[i];
                                if(response['carpoolid']>0){
                                    var row= '<tr id="request-row'+i+'"></tr>';                                 
                                    var rowDOM = $('#request-body').append(row);
                                    for(key in response){
                                        if(response[key]!=null && !(response[key] instanceof Object)){
                                            $('#request-row'+i).append('<td>'+response[key]+'</td>');
                                        }
                                    }
                               }
                            }
                        }else{
                            $('#request-tab-msg').removeClass('hidden');
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

function getAllCarpools(){
    var query_string = "http://futureblue.torolab.ibm.com:9081/futureblue-1.0-SNAPSHOT/carpool/carpooldata/list/available/?start=0&limit=100"
    
    var request = $.ajax({
        url: query_string,
        type: "GET",
        contentType: "application/json",
        crossDomain: true,
        dataType: 'jsonp',
        success: function(response_array){
            getCarpoolSuccessHandler(response_array);
        }
    });
        
    request.done(function(response) {
		console.log("login-done:" + response);
	});

	request.fail(function(jqXHR, textStatus) {
  		console.log( "login-failed: " + textStatus );
	});
   
}

function fillLocationBox(){
    var location = $('#addLocationInput').val();
    $('#locationbox').append('<option>'+location+'</option>');
    $('#addLocationInput').val("").focus();
}

function getSelectOptions (selector){
    var str = "";
    $(selector + " option").each(function() {
        str += $(this).val() + ',';
    });
    
    return str;
}

$(function(){
    var usr_msg = '<p id="user-msg">';
    
    firstname = getURLParam('firstname');
    if(firstname == "null") firstname="";
    
    lastname = getURLParam('lastname');
    if(lastname == "null") lastname="";
    
    usr_msg += firstname + ' ' + lastname + '</p>';
	$('#username').html(usr_msg);
    
    
    $('#requests-tab').click(function(e){
        e.preventDefault();
        getRequests();  
    });
    
    $(document).keydown(function(e){
        //left arrow key: 37, right arrow key: 39
        if (e.keyCode == 37) { 
            $('#prev').trigger('click');
            return false;
        }

        if (e.keyCode == 39){
            $('#next').trigger('click');
            return false;
        }
       
    });

    getAllCarpools();
});
