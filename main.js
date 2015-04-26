function DAToDateTime(da) {
    if(da.length !== 8) {
        return undefined;
    }
    var yy = da.substring(0, 4);
    var mm = da.substring(4, 6);
    var dd = da.substring(6, 8);
    var dateTime = yy + '-' + mm + '-' + dd;
    return dateTime;
}

function getStudyUrl() {
    var rootUrl = $('#rootUrl').val();
    if (rootUrl.substring(rootUrl.length-1) !== "/") {
        rootUrl += '/';
    }
    var studyUrl =  rootUrl + $('#studyUid').val();
    return studyUrl;
}

function onStudyLoaded(data) {
    if(data === undefined || data.length === undefined || data.length <= 0) {
        // TODO: Handle error
        return;
    }
    //console.log(data);
    var imagingStudy = {};
    var firstInstance = data[0];
    imagingStudy.dateTime = DAToDateTime(firstInstance["00080020"].Value[0]);
    imagingStudy.uid = "urn:oid:" + firstInstance["0020000D"].Value[0];
    imagingStudy.accessionNo = {
        "use" : "usual",
        "system" : $("#system").val(),
        "value" : firstInstance["00080050"].Value[0]
    };
    imagingStudy.url = getStudyUrl();
    imagingStudy.series = [];

    var seriesMap = [];

    data.forEach(function(instance) {
        var seriesUid = instance["0020000E"].Value[0];
        var series = seriesMap[seriesUid];
        if(series === undefined) {
            series = {
                number: instance['00200011'].Value[0],
                modality: instance['00080060'].Value[0],
                uid : "urn:oid:" + seriesUid,
                description: instance['0008103E'].Value[0],
                numberOfInstances: 0,
                instance: []
            };
            seriesMap[seriesUid] = series;
            imagingStudy.series.push(series);
        }
        series.numberOfInstances++;
        var instance = {
            number: instance['00200013'].Value[0],
            uid : "urn:oid:" + instance['00080018'].Value[0],
            sopclass: instance['00080016'].Value[0]
        }
        series.instance.push(instance);
    });
    $('#imagingStudy').val(JSON.stringify(imagingStudy, null, 2));
    //console.log(imagingStudy);
}


$(document).ready(function() {
    $('form').submit(function(e) {

        // make a re
        var studyUrl = getStudyUrl() + '/metadata';
        $.ajax({
            url: studyUrl,
            headers: {
                Accept : "application/json"
            },

            success: onStudyLoaded
        });
        e.preventDefault();
    });

});