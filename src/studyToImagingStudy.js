function getTitle(instance) {
    // 0070,0080 | 0040,A043 > 0008,0104 | 0042,0010 | 0008,0008
    var title = getValueOrDefault(instance, '00700080');
    if(title) {
        return title;
    }
    /* Commented out because this needs more investigation/testing
     title = getValueOrDefault(instance, '0040A043');
     if(title) {
     return title;
     }
     */
    /* Commented out because this needs more investigation/testing
     title = getValueOrDefault(instance, '00080104');
     if(title) {
     return title;
     }
     */

    title = getValueOrDefault(instance, '00420010');
    if(title) {
        return title;
    }
    title = getMultiValueOrDefault(instance, '00080008');
    return title;
}

function getInstanceUrl(instance) {
    //0008,1199 > 0008,1190
    var url = getValueOrDefault(instance, '00081199');
    if(url) {
        return url;
    }
    url = getValueOrDefault(instance, '00081190');
    return url;
}


function getSeriesUrl(instance) {
    //0008,1115 > 0008,1190

    var url = getValueOrDefault(instance, '00081115');
    if(url) {
        return url;
    }
    url = getValueOrDefault(instance, '00081190');
    return url;
}

function studyToImagingStudy(data, options) {

    var imagingStudy = {};
    var firstInstance = data[0];
    //imagingStudy.id = getValue(firstInstance, "0020000D");
    imagingStudy.resourceType = "ImagingStudy";
    imagingStudy.text = {
        "status": "generated",
        "div": getValueOrDefault(firstInstance, "00081030", "TODOHumanReadableDescriptionHereTODO")
    };
    imagingStudy.dateTime = DAToDateTime(getValue(firstInstance, "00080020"));
    imagingStudy.subject = {
        reference : "Patient/TODOReplaceWithActualIdTODO"
    };
    imagingStudy.uid = "urn:oid:" + getValue(firstInstance, "0020000D");
    imagingStudy.accessionNo = {
        "use" : "usual",
        "system" : $("#system").val(),
        "value" : getValue(firstInstance, "00080050")
    };
    imagingStudy.url = getStudyUrl();
    //imagingStudy.numberOfSeries = getValueOrDefault(firstInstance, "00201206");
    //imagingStudy.numberOfInstances = getValueOrDefault(firstInstance, "00201208");
    imagingStudy.numberOfSeries = 0;
    imagingStudy.numberOfInstances = 0;
    imagingStudy.series = [];
    imagingStudy.clinicalInformation = getValueOrDefault(firstInstance, "00401002");
    imagingStudy.description = getValueOrDefault(firstInstance, "00081030");

    var seriesMap = [];

    data.forEach(function(instance) {
        var seriesUid = getValue(instance, "0020000E");
        var series = seriesMap[seriesUid];
        if(series === undefined) {
            series = {
                number: getValueOrDefault(instance, '00200011'),
                modality: getValue(instance, '00080060'),
                uid : "urn:oid:" + seriesUid,
                description: getValueOrDefault(instance,'0008103E'),
                numberOfInstances: 0,
                //numberOfInstances: getValueOrDefault(instance,'00201209'),
                //availability: getValueOrDefault(instance, '00080056'),
                //url: getSeriesUrl(instance),
                dateTime: DAToDateTime(getValue(firstInstance, "00080021")),
                instance: []
            };
            seriesMap[seriesUid] = series;
            imagingStudy.series.push(series);
        }
        var instance = {
            number: getValueOrDefault(instance,'00200013'),
            uid : "urn:oid:" + getValue(instance,'00080018'),
            sopclass: getValue(instance, '00080016'),
            //type: getValueOrDefault(instance,'00041430'),
            //title: getTitle(instance),
            //url: getInstanceUrl(instance)
        }
        series.instance.push(instance);
    });

    function compare(a,b) {
        if (a.number < b.number)
            return -1;
        if (a.number > b.number)
            return 1;
        return 0;
    }


    var numInstances = 0;
    imagingStudy.series.forEach(function(series) {
        if(!series.numberOfInstances) {
            series.numberOfInstances = series.instance.length;
            numInstances += series.instance.length;
        } else {
            numInstances += series.numberOfInstances;
        }
        series.instance.sort(compare);
    });
    imagingStudy.series.sort(compare);

    if(!imagingStudy.numberOfInstances) {
        imagingStudy.numberOfInstances = numInstances;
    }
    if(!imagingStudy.numberOfSeries) {
        imagingStudy.numberOfSeries = imagingStudy.series.length;
    }
    return imagingStudy;

}