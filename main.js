function getStudyUrl() {
    var rootUrl = $('#rootUrl').val();
    if (rootUrl.substring(rootUrl.length-1) !== "/") {
        rootUrl += '/';
    }
    var studyUrl =  rootUrl + $('#studyUid').val();
    return studyUrl;
}

function onSuccess(data, status, jqXHR) {
    if(data === undefined || data.length === undefined || data.length <= 0) {
        $('#imagingStudy').val("ERROR - DICOMweb server returned invalid response");
        return;
    }
    //console.log(data);

    try {
        var imagingStudy = studyToImagingStudy(data);
        $('#imagingStudy').val(JSON.stringify(imagingStudy, null, 2));
    }
    catch(e) {
        $('#imagingStudy').val("ERROR - " + e);
    }
}

function onError(jqXHR,error, errorThrown) {
    if(jqXHR.status&&jqXHR.status==400){
        $('#imagingStudy').val("ERROR - Request to DICOMweb server failed - " + jqXHR.responseText);
    }else{
        $('#imagingStudy').val("ERROR - Request to DICOMweb server failed");
    }
}

$(document).ready(function() {
    $('form').submit(function(e) {
        $('#imagingStudy').val("Please wait while study metadata is retrieved....");

        // Make a request for the study metadata
        var studyUrl = getStudyUrl() + '/metadata';
        $.ajax({
            url: studyUrl,
            headers: {
                "Accept" : "application/json"
            },
            success: onSuccess,
            error: onError
        });
        e.preventDefault();
    });
});