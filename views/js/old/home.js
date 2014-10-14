var firstname,lastname;
var carpoolids = [];

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

function getRequests(){
    var base_url = "http://futureblue.torolab.ibm.com:9081/futureblue-1.0-SNAPSHOT/carpool/carpooldata/";
    for(var i=0; i<carpoolids.length; i++){
        alert(i);
        var url = base_url + "?id=" + carpoolids[i];
        var request = $.ajax({
            url: url,
            type: "GET",
            contentType: "application/json",
            crossDomain: true,
            dataType: 'jsonp',
            success: function(response) {
                if(response['carpoolid']>0){
                    var riders = response['riders'];
                    for(var j=0; j<riders.length; j++){
                        var row= '<tr id="request-row'+i+'-'+j+'"></tr>';                                 
                        var rowDOM = $('#request-body').append(row);
                        $('#request-row'+i+'-'+j).append('<td>'+riders[j]['userid']+'</td>');
                        $('#request-row'+i+'-'+j).append('<td>'+response['carpoolid']+'</td>');
                        $('#request-row'+i+'-'+j).append('<td>'+riders[j]['firstname']+'</td>');
                        $('#request-row'+i+'-'+j).append('<td>'+riders[j]['lastname']+'</td>');
                        $('#request-row'+i+'-'+j).append('<td>'+riders[j]['ridestatus']+'</td>');
                    }
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
}

function getCarpoolById(){
    var query_string = "http://futureblue.torolab.ibm.com:9081/futureblue-1.0-SNAPSHOT/carpool/carpooldata/owner/all/"
    query_string += "?userid=" + getURLParam('ownerid');
    
    var request = $.ajax({
        url: query_string,
        type: "GET",
        contentType: "application/json",
        crossDomain: true,
        dataType: 'jsonp',
        success: function(response_array) {
                for(var i=0; i<response_array.length; i++){
                    response=response_array[i];
                    if(response['carpoolid']>0){
                        $('#carpool-tab').addClass('hidden');

                        var accordianHTML = '<tr id="content-row"><td id="collapse-row" colspan="6">';
                        accordianHTML +=  '<div class="accordian-body collapse out" id="target">'; 
                        accordianHTML += '</div></td></tr>';

                        var accordianContent = "";
                        var row= '<tr id="content-row" data-toggle="collapse" data-target="#target" class="accordion-toggle">';
                        var rowDOM = $('#carpool-table-body').append(row);
                        for(key in response){
                            if(response[key]!=null && !(response[key] instanceof Object)){
                                if(key=="carpoolid"){
                                    carpoolids.push(response[key]);
                                }
                                
                                if(key=="pickupPoints"){
                                    response[key] = response[key].slice(0,-1);   
                                }
                                if(i==0)
                                    $('#header-row').append('<th>'+key+'</th>');
                                
                                rowDOM.append('<td>'+response[key]+'</td>');
                            }
                        }
                        
                        $('tbody').append('</tr>');
                        $('#carpool-info').removeClass('hidden').hide().fadeIn('slow');
                   }
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
    
    $('#add-carpool').click(function(){
        $('[id=actions-menu]').addClass('hidden');
        $('#add-carpool-hidden').removeClass('hidden').hide().fadeIn('slow');
        $('#inputPointA').focus();
    });
    
    $('#return-panel-link').click(function(){
        $('#add-carpool-hidden').addClass('hidden');
        $('[id=actions-menu]').removeClass('hidden').hide().fadeIn('slow');
    });
    
    $('#locationbox').change(function() {
        var sel = $("#locationbox option:selected");
        if(sel.length === 0){
            $('#removeLocation-btn').addClass('disabled');
        }else{
            $('#removeLocation-btn').removeClass('disabled');
        }
    });
    
    $('#removeLocation-btn').click(function() {
        var sel = $("#locationbox option:selected");
        if(sel.length != 0){
            sel.remove();
            sel = $("#locationbox option:selected");
            if(sel.length === 0){
                $('#removeLocation-btn').addClass('disabled');
            }
        }
    });
    
    $('#addLocation-btn').click(function() {
        fillLocationBox();
    });
    
    $('#addLocationInput').keydown(function(event) {
        if (event.keyCode == 13 && $(this).val().length > 0){
            fillLocationBox();
            return false;
        }
    });
    
    getCarpoolById();
    $('#request-tab').click(function(){
        getRequests();
    });
});
