(function($) {
$.fn.serializefiles = function() {
    var obj = $(this);
    /* ADD FILE TO PARAM AJAX */
    var formData = new FormData();
    $.each($(obj).find("input[type='file']"), function(i, tag) {
        $.each($(tag)[0].files, function(i, file) {
            formData.append(tag.name, file);
        });
    });
    var params = $(obj).serializeArray();
    $.each(params, function (i, val) {
        formData.append(val.name, val.value);
    });
    return formData;
};
})(jQuery);

function progressorHandlingFunction(e){
    if(e.lengthComputable){
    	//var progressorval = floorFigure(e.loaded/e.total*100,0);
    	/*
    	if(progressorval < 99)
    	{
    		$('.blockMsg .progressorpanel .lbl').text('Uploading...');
    		$('.blockMsg .progressorpanel .progressor').text( floorFigure(e.loaded/e.total*100,0).toString()+"%" );
    	}
    	else
    	{
    		$('.blockMsg .progressorpanel .lbl').text('Validating...');
    		$('.blockMsg .progressorpanel .progressor').text('');
    	}
    	*/
    }
}

function blockAnchorUploadWidget()
{
	var ajaximgpath = window.currentContextPath + "/images/ajax-loader.gif";
	window.anchorUploadWidget = $('#anchoruploadwidget');
	window.anchorUploadWidget.block({ 
		css: { 
	            border: 'none', 
	            padding: '15px', 
	            backgroundColor: '#000', 
	            '-webkit-border-radius': '10px', 
	            '-moz-border-radius': '10px', 
	            opacity: .5, 
	            color: '#fff' 
		},
		message: '<div class="progressorpanel">' +
				 '<img src="'+ ajaximgpath + '" alt="loading">'+
				 '<div class="lbl">Uploading the certificate...</div></div>',
	});
}

function unblockAnchorUploadWidget()
{
	if(window.anchorUploadWidget)
    	window.anchorUploadWidget.unblock();
}

function blockDirectReceiveWidget()
{
	var ajaximgpath = window.currentContextPath + "/images/ajax-loader.gif";
	window.directReceiveWdgt = $('#directreceivewidget');
	window.directReceiveWdgt.block({ 
		css: { 
	            border: 'none', 
	            padding: '15px', 
	            backgroundColor: '#000', 
	            '-webkit-border-radius': '10px', 
	            '-moz-border-radius': '10px', 
	            opacity: .5, 
	            color: '#fff' 
		},
		message: '<div class="progressorpanel">' +
				 '<img src="'+ ajaximgpath + '" alt="loading">'+
				 '<div class="lbl">Contacting SMTP Server...</div></div>',
	});
}

function unblockDirectReceiveWidget()
{
	if(window.directReceiveWdgt)
    	window.directReceiveWdgt.unblock();
}

function precannedRequired(field, rules, i, options){
	if($('#precannedfilepath').val()== '')
	{
		return "Please select a precanned C-CDA sample";
	}
}


$(function() {
	
	$('.dropdown-menu').click(function (e) {
		e.stopPropagation();
	});
	
	$('#uploadFormWrapper').toggle(false);
	
	$('input[name="directMessageType"]').bind('change',function(){
	    var showOrHide = ($(this).val() == "precanned") ? true : false;
	    $('#precannedFormWrapper').toggle(showOrHide);
	    $('#uploadFormWrapper').toggle(!showOrHide);
	    $('#precannedCCDAsubmit').validationEngine('hideAll');
	    $('#ccdauploadsubmit').validationEngine('hideAll');
	 });
	
	$('#precannedemail').bind('change',function(){
	    $('#ccdauploademail').val($(this).val());
	 });
	
	$('#ccdauploademail').bind('change',function(){
	    $('#precannedemail').val($(this).val());
	 });
	
	$('.module_content #uploadccdainput').filestyle({ 
		image: window.currentContextPath + "/images/button_upload.png",
		imageheight : 24,
		imagewidth : 115,
		width : 250,
		isdisabled: true,
		validationclass: "validate[funcCall[customccdaRequired]]"
	});
	
	
	
	$("#ccdafiletreepanel").jstree({
		 "json_data" : {
			      "ajax" : {
				      "url" : sampleCCDATreeURL,
				      "type" : "post",
				      /*"data" : function (n) {
				    	 return { id : n.attr ? n.attr("id") : 0 };
				      }*/
				  }
	      },
	      
	      "types" : {
	    	  "valid_children" : [ "all" ],
	    	  "type_attr" : "ref",
	    	  "types" : {
	    		  "root" : {
		    	      "icon" : {
		    	    	  "image" : window.currentContextPath + "/images/root.png"
		    	      },
		    	      "valid_children" : [ "file","folder" ],
		    	      "max_depth" : 2,
		    	      "hover_node" : false,
		    	      "select_node" : function (e) {

		    	    	  this.toggle_node(e);
		    	    	  return false;
		    	      }
		    	      
		    	  	},
		    	  "file" : {
		    		  "icon" : {
		    	    	  "image" : window.currentContextPath + "/images/file.png"
		    	      },
		    		  "valid_children" : [ "none" ],
		    		  "select_node" : function (node,e) {
		    			  //populate the textbox
		    			  $("#precannedfilepath").val(node.data("serverpath"));
		    			  $("#prescannedfilePathOutput").text($("#precannedfilepath").val());
		    	    	  //hide the drop down panel
		    			  $('[data-toggle="dropdown"]').parent().removeClass('open');
		    			  //hide all the errors
		    			  $('#precannedCCDAsubmit').validationEngine('hideAll');
		    			  
		    		  }
		    	  },
		    	  "folder" : {
		    		  "icon" : {
		    	    	  "image" : window.currentContextPath + "/images/folder.png"
		    	      },
		    		  "valid_children" : [ "file" ],
		    		  "select_node" : function (e) {
		    	    	  this.toggle_node(e);
		    	    	  return false;
		    	      }
		    	  }
	    	 }
	    },
	    "plugins" : [ "themes", "json_data", "ui", "types" ]
	}).bind('loaded.jstree', function(e, data) {
		isfiletreeloaded = true;
	});
	
	
	
	$("#precannedCCDAsubmit").click(function(e){
	    
		var jform = $('#precannedForm');
		jform.validationEngine('hideAll');
		if(jform.validationEngine('validate'))
		{
			//block ui..
			blockDirectReceiveWidget();
			
			var formData = $('#precannedForm').serializefiles();
		    
		    $.ajax({
		        url: $('#precannedForm').attr('action'),
		        
		        type: 'POST',
		        
		        xhr: function() {  // custom xhr
		            myXhr = $.ajaxSettings.xhr();
		            if(myXhr.upload){ // check if upload property exists
		                myXhr.upload.addEventListener('progressor', progressorHandlingFunction, false); // for handling the progressor of the upload
		            }
		            return myXhr;
		        },
		        
		        success: function(data){
		        	var results = JSON.parse(data);
		        	var iconurl = results.body.IsSuccess? window.currentContextPath + "/images/icn_alert_success.png" :
		        									window.currentContextPath + "/images/icn_alert_error.png" ;

		        	$('#directreceivewidget .blockMsg .progressorpanel img').attr('src',iconurl);
		        	
		        	$('#directreceivewidget .blockMsg .progressorpanel .lbl').text(results.body.ErrorMessage);

		        	if(window.directReceiveWdgt)
		        	{
		        		window.directReceiveUploadTimeout = setTimeout(function(){
		        				window.directReceiveWdgt.unbind("click");
		        				window.directReceiveWdgt.unblock();
		        			},10000);
		        		
		        		
		        		window.directReceiveWdgt.bind("click", function() { 
		        			window.directReceiveWdgt.unbind("click");
		        			clearTimeout(window.directReceiveUploadTimeout);
		        			window.directReceiveWdgt.unblock(); 
		        			window.directReceiveWdgt.attr('title','Click to hide this message.').click($.unblockUI); 
			            });
		        		
		        	}
		        	
		        },
		        
		        error: function (request, status, error) {
		        	var iconurl = window.currentContextPath + "/images/icn_alert_error.png" ;
					
					$('#directreceivewidget .blockMsg .progressorpanel img').attr('src',iconurl);
		        	
		        	$('#directreceivewidget .blockMsg .progressorpanel .lbl').text('Error sending sample C-CDA file.');
					
					if(window.directReceiveWdgt)
		        	{
		        		window.directReceiveUploadTimeout = setTimeout(function(){
		        				window.directReceiveWdgt.unbind("click");
		        				window.directReceiveWdgt.unblock();
		        			},10000);
		        		
		        		
		        		window.directReceiveWdgt.bind("click", function() { 
		        			window.directReceiveWdgt.unbind("click");
		        			clearTimeout(window.directReceiveUploadTimeout);
		        			window.directReceiveWdgt.unblock(); 
		        			window.directReceiveWdgt.attr('title','Click to hide this message.').click($.unblockUI); 
			            });
		        		
		        	}
		        },
		        // Form data
		        data: formData,
		        //Options to tell JQuery not to process data or worry about content-type
		        cache: false,
		        contentType: false,
		        processData: false
		    });
		}
		else
		{
			$('#precannedform .precannedfilepathformError').prependTo('#precannederrorlock');
		}
		return false;
	});
	
/*	
$("#anchorsubmit").click(function(e){
	    
		var jform = $('#anchoruploadform');
		jform.validationEngine('hideAll');
		if(jform.validationEngine('validate'))
		{
			//block ui..
			blockAnchorUploadWidget();
			
			var formData = $('#anchoruploadform').serializefiles();
		    
		    $.ajax({
		        url: $('#anchoruploadform').attr('action'),
		        
		        type: 'POST',
		        
		        xhr: function() {  // custom xhr
		            myXhr = $.ajaxSettings.xhr();
		            if(myXhr.upload){ // check if upload property exists
		                myXhr.upload.addEventListener('progressor', progressorHandlingFunction, false); // for handling the progressor of the upload
		            }
		            return myXhr;
		        },
		        
		        success: function(data){
		        	var results = JSON.parse(data);
		        	
		        	var iconurl = results.IsSuccess? window.currentContextPath + "/images/icn_alert_success.png" :
		        									window.currentContextPath + "/images/icn_alert_error.png" ;
		        	
		        	$('#anchoruploadwidget .blockMsg .progressorpanel img').attr('src',iconurl);
		        	
		        	$('#anchoruploadwidget .blockMsg .progressorpanel .lbl').text(results.ErrorMessage);
		        	
		        	if(window.anchorUploadWidget)
		        	{
		        		window.anchorUploadWidget.unbind("click");
		        		window.anchorUploadWidget.click(function() { 
		        			window.anchorUploadWidget.unblock(); 
			                $('#anchoruploadwidget .blockOverlay').attr('title','Click to hide this message.').click($.unblockUI); 
			            });
		        		setTimeout(function(){
		        			window.anchorUploadWidget.unblock();
		        		},10000);
		        	}
		        },
		        
		        error: function (request, status, error) {
		        	alert("ajax error:"+ error);
		        },
		        // Form data
		        data: formData,
		        //Options to tell JQuery not to process data or worry about content-type
		        cache: false,
		        contentType: false,
		        processData: false
		    });
		}
	    return false;
	});*/
});