//Return some item info for display
function CloudItemInfo(item_ids) {
    params = { item_ids: item_ids };
    $.get("/api/v1/contrib/cloudlibrary/item_info",params,function(data){
        }).done(function(data){
            $(data).find('DocumentData').each(function(){
                var item_id = $(this).find('id').text();
                var item_title = $(this).find('title').text();
                var item_author = $(this).find('author').text();
                var item_cover = $(this).find('coverimage').text();
                var item_isbn = $(this).find('isbn').text();
                $('#'+item_id).children('.detail').html('<a href="#" class="cloud_cover" id="'+item_isbn+'"><img src='+item_cover+' /></a>' );
            });
        }).fail(function(data){
            console.log(data)
        });
}

//Returns item info, most importantly link and cover
function CloudIsbnSummary(item_isbns) {
    params = { item_ids: item_isbns };
    $.get("/api/v1/contrib/cloudlibrary/isbn_summary",params,function(data){
        }).done(function(data){
            $(data).find('LibraryDocumentSummary').each(function(){
                var item_id = $(this).find('id').text();
                var item_title = $(this).find('title').text();
                var item_author = $(this).find('author').text();
                var item_cover = $(this).find('coverimage').text();
                var item_isbn = $(this).find('isbn').text();
                var item_link = $(this).find('itemlink').text();
                if( our_cloud_name ){
                    item_link = "https://ebook.yourcloudlibrary.com/library/"+our_cloud_name+"-document_id-"+item_id;
                }
                $('#'+item_id).children('.detail').html('<a href="'+item_link+'" class="cloud_cover" id="'+item_isbn+'" target="_blank"><img style="max-height:150px;" src='+item_cover+' /></a>' );
            });
        }).fail(function(data){
            console.log(data)
        });
}

//Returns availability of item for a patron
function CloudItemStatus(item_ids) {
    params = { item_ids: item_ids };
    $.get("/api/v1/contrib/cloudlibrary/item_status",params,function(data){
        }).done(function(data){
            if( $(data).find('DocumentStatus').length == 0 ) {
                $('.item_status').html('Error fetching availability - please see library for assistance');
                return;
            }
            $(data).find('DocumentStatus').each(function(){
                var item_id = $(this).find('id').text();
                var item_status = $(this).find('status').text();
                if( item_status == "CAN_LOAN"){
                    $('#'+item_id).children('.action').html('<button type="button" class="cloud_action" action="checkout" value='+item_id+'>Checkout</button>');
                } else if ( item_status == "CAN_HOLD") {
                    $('#'+item_id).children('.action').html('<button type="button" class="cloud_action" action="place_hold" value='+item_id+'>Place hold</button>');
                } else if ( item_status == "HOLD") {
                    $('#'+item_id).children('.action').html('<button type="button" class="cloud_action" action="cancel_hold" value='+item_id+'>Cancel hold</button>');
                } else if ( item_status == "LOAN") {
                    $('#'+item_id).children('.action').html('Item is checked out <button type="button" class="cloud_action" action="checkin" value='+item_id+'>Return</button>');
                } else if ( item_status == "RESERVATION") {
                    $('#'+item_id).children('.action').html('<button type="button" class="cloud_action" action="checkout" value='+item_id+'>Checkout reserve</button>');
                } else if ( item_status == "CAN_WISH") {
                    $('#'+item_id).children('.action').html('<span value='+item_id+'>No longer available</span>');
                } else {
                    $('#'+item_id).children('.action').text( item_status );
                }
            });
        }).fail(function(data){
            console.log('failure');
            console.log(data)
        });
}

//Returns library availability of item 
function CloudItemSummary(item_ids) {
    params = { item_ids: item_ids };
    $.get("/api/v1/contrib/cloudlibrary/item_summary",params,function(data){
        }).done(function(data){
            if( $(data).find('LibraryDocumentSummary').length == 0 ) {
                console.log('Cloud library error response:', data );
                $('.item_status').html('Error fetching availability - please see library for assistance');
                return;
            }
            $(data).find('LibraryDocumentSummary').each(function(){
                var item_id = $(this).find('id').text();
                $(this).find('LibraryDocumentDetail').each(function(){
                    if ( $(this).find('libraryid').text() == our_cloud_lib ) {
                        var item_copies = $(this).find('ownedCopies').text();
                        var loan_copies = $(this).find('loanCopies').text();
                        var hold_copies = $(this).find('holdCopies').text();
                        $('#'+item_id).children('.cloud_copies').text(item_copies + " Total copies " +
                        loan_copies + " On loan, " +
                        hold_copies + " On hold");
                    }
                });
            });
        }).fail(function(data){
            console.log('Cloud library item_summary failure');
            console.log(data)
        });
}

// This function calls for the patron status, then gets item status and info for each checkout/hold
function GetPatronInfo(){
    $.get("/api/v1/contrib/cloudlibrary/patron_info",function(data){
        }).done(function(data){
            var item_ids="";
            var item_isbns="";
            if( $(data).find('Checkouts').find('Item').length > 0 ){
                $("#content-3m").append('<h1>Checkouts</h1><div class="span12 container-fluid" id="cloud_checkouts"></div>');
                $(data).find('Checkouts').find('Item').each(function(){
                    $("#cloud_checkouts").append('<div class="col span2 cloud_items"  id="'+$(this).find('ItemId').text()+'" codate="'+$(this).find('EventStartDateInUTC').text()+'" duedate="'+$(this).find('EventEndDateInUtc').text()+'"><span class="detail"></span><br><span class="action"></span></div>');
                    item_ids += $(this).find('ItemId').text()+",";
                    item_isbns += $(this).find('ISBN').text()+",";
                });
            } else {
                $("#content-3m").append('<h1>Checkouts</h1><ul id="cloud_checkouts"><li>No items currently checked out</li></ul>');
            }
            if( $(data).find('Holds').find('Item').length > 0 ){
                $("#content-3m").append('<h1>Holds</h1><div class="span12 container-fluid" id="cloud_holds"></div>');
                $(data).find('Holds').find('Item').each(function(){
                    $("#cloud_holds").append('<div class="col span2 cloud_items" id="'+$(this).find('ItemId').text()+'" holddate="'+$(this).find('EventStartDateInUTC').text()+'" holdedate="'+$(this).find('EventEndDateInUTC').text()+'"><span class="detail"></span></br><span class="action"></span></div>');
                    item_ids += $(this).find('ItemId').text()+",";
                    item_isbns += $(this).find('ISBN').text()+",";
                });
            } else {
                $("#content-3m").append('<h1>Holds</h1><ul id="cloud_holds"><li>No items on hold</li></ul>');
            }
            if( $(data).find('reserves').find('item').length > 0 ){
                $("#content-3m").append('<h1>Holds ready to checkout</h1><div id="cloud_reserves"></div>');
                $(data).find('Reserves').find('Item').each(function(){
                    $("#cloud_reserves").append('<div  class="span12 container-fluid" id="'+$(this).find('ItemId').text()+'" reservedate="'+$(this).find('EventStartDateInUTC').text()+'" reserveexpiredate="'+$(this).find('EventEndDateInUTC').text()+'"><span class="action"></span><span class="detail"></span> Expires:'+$(this).find('EventEndDateInUTC').text()+'</div>');
                    item_ids += $(this).find('ItemId').text()+",";
                    item_isbns += $(this).find('ISBN').text()+",";
                });
            } else {
                $("#content-3m").append('<h1>Holds ready to checkout</h1><ul id="cloud_holds"><li>No holds ready for checkout</li></ul>');
            }
            if( item_ids.length > 0 ) {CloudItemStatus( item_ids.slice(0,-1) );}
            if( item_isbns.length > 0 ) {CloudIsbnSummary( item_isbns.slice(0,-1) );}
        }).fail(function(data){
            console.log(data);
        });
}

$(document).ready(function(){

    //Creates and populates the 3m Checkouts tab on patron summary on OPAC
    if( $("body#opac-user").length > 0 ) {
        $("#opac-user-views ul").append('<li><a href="#opac-user-cloudlibrary" class="nav-link" data-toggle="tab" role="tab" aria-controls="opac-user-cloudlibrary">Cloud Library Account</a></li>');
        $("#opac-user-views .tab-content").append('<div id="opac-user-cloudlibrary" class="tab-pane" role="tabplanel" aria-labelledby="opac-user-cloudlibrary"><div id="content-3m">Search the catalog to find and place holds or checkout Cloud Library items. Click the covers to visit the Cloud Library site and login to download items or get the apps</div></div>');
        //$('#opac-user-views').tabs("refresh");
        GetPatronInfo();
    }

    //Fetches status info for OPAC results page
    if( $("body#results").length > 0 ) {
        if( $(".loggedinusername").length == 0 ){
            var cloud_login = $("a[href*='ebook.yourcloudlibrary.com']").closest('td').find('.availability');
            cloud_login.html('<td class="item_status"><span class="action"><button type="button">Login to see Cloud Availability</span></button></td>');
            cloud_login.on('click',function(){
                $("#loginModal").modal("show");
            });
        } else {
            var item_ids = "";
            var counter = 0;
            $("a[href*='ebook.yourcloudlibrary.com']").each(function(){
                var cloud_id = $(this).attr('href').split('-').pop().split('&').shift();
                console.log( cloud_id );
                $(this).closest('td').find('.availability').html('<td id="'+cloud_id+'" class="item_status" ><span class="action"><img src="/api/v1/contrib/cloudlibrary/static/img/spinner-small.gif"> Fetching 3M Cloud availability</span><span class="detail"></span></td>');
                item_ids += cloud_id+",";
                counter++;
                if(counter >= 25){
                    CloudItemStatus(item_ids);
                    counter = 0;
                    item_ids = "";
                }
            });
            if( item_ids.length > 0 ) { CloudItemStatus(item_ids);}
        }
    }

    //Fetches status info for staff results page
    if( $("body#catalog_results").length > 0 ) {
        var item_ids = "";
        var counter = 0;
        $("a[href*='ebook.yourcloudlibrary.com']").each(function(){
            var cloud_id = $(this).attr('href').split('-').pop().split('&').shift();
            $(this).closest('td').append('<span id="'+cloud_id+'" class="results_summary item_status" ><span class="cloud_copies"><img src="/api/v1/contrib/cloudlibrary/static/img/spinner-small.gif"> Fetching 3M Cloud availability</span><span class="detail"></span></td>');
            item_ids += cloud_id+",";
            counter++;
            if(counter >= 25){
                CloudItemSummary(item_ids);
                counter = 0;
                item_ids = "";
            }
        });
        if( item_ids.length > 0 ) { CloudItemSummary(item_ids);}
    }

    //Fetches status info for staff details page
    if( $("body#catalog_detail").length > 0 ) {
        var item_ids = "";
        var counter = 0;
        $("a[href*='ebook.yourcloudlibrary.com']").each(function(){
            var cloud_id = $(this).attr('href').split('-').pop().split('&').shift();
            $("#holdings").append('<h3>CloudLibrary item(s)</h3><span id="'+cloud_id+'" class="results_summary item_status" ><span class="cloud_copies"><img src="/api/v1/contrib/cloudlibrary/static/img/spinner-small.gif"> Fetching 3M Cloud availability</span><span class="detail"></span></td>');
            item_ids += cloud_id+",";
            counter++;
            if(counter >= 25){
                CloudItemSummary(item_ids);
                counter = 0;
                item_ids = "";
            }
        });
        if( item_ids.length > 0 ) { CloudItemSummary(item_ids);}
    }

    //Fetches status info for details page and append to holdings
    if( $("body#opac-detail").length > 0 ) {
        var cloud_link = $("a[href*='ebook.yourcloudlibrary.com']").first();
        if ( cloud_link.length ){
            if( $(".loggedinusername").length == 0 ){
                $("#holdings").append('<h3>Login to see CloudLibrary Availability</h3>');
            } else {
                var cloud_id = cloud_link.attr('href').split('-').pop().split('&').shift();
                $("#holdings").append('<h3>CloudLibrary item(s)</h3><span id="'+cloud_id+'" class="item_status" ><span class="action"><img src="/api/v1/contrib/cloudlibrary/static/img/spinner-small.gif"> Fetching 3M Cloud Availability</span><span class="detail"></span></span>');
                CloudItemStatus( cloud_id );
            }
        }
    }

    //Handle action buttons
    $(document).on('click',".cloud_action",function(){
        var item_id = $(this).val();
        var action = $(this).attr('action');
        $(this).parent("span.action").html('<img src="/api/v1/contrib/cloudlibrary/static/img/spinner-small.gif">');
        $('#'+item_id).children('.detail').text("");
        var params = {};
        $.get("/api/v1/contrib/cloudlibrary/"+action+"/"+item_id,params,function(data){
        }).done(function(data){
            CloudItemStatus( item_id );
            if ( action == 'checkout')   {
                alert('Item checked out, due:'+$(data).find('DueDateInUTC').text() );
            }
            if ( action == 'place_hold') {
                $('#'+item_id).children('.detail').text( $(data).find('AvailabilityDateInUTC').text() );
            }
            if( action == 'checkin' && $("#opac-user").length > 0 ) { $('div#'+item_id).remove(); }
            if( action == 'cancel_hold' && $("#opac-user").length > 0 ) { $('div#'+item_id).remove(); }
        }).fail(function(){
            alert('There was an issue with this action, please try again later or contact the library if the problem persists');
        });
    });

});
