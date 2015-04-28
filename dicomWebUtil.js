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

function getValue(instance, tag, index) {
    index = index || 0;
    var element = instance[tag];
    if(element === undefined) {
        throw "tag " + tag + ' not found';
    }
    if(element.Value.length <= index) {
        throw "tag " + tag + ' does not have value at index ' + index;
    }

    return element.Value[index];
}

function getValueOrDefault(instance, tag, defaultValue, index) {
    index = index || 0;
    var element = instance[tag];
    if(element === undefined) {
        return defaultValue;
    }
    // NOTE: This should't happen by DCM4CHEE is returning an empty element in some cases

    if(element.Value === undefined) {
        return defaultValue;
    }

    if(element.Value.length <= index) {
        return defaultValue;
    }

    return element.Value[index];
}

function getMultiValueOrDefault(instance, tag, defaultValue) {
    var element = instance[tag];
    if(element === undefined) {
        return defaultValue;
    }
    return element.Value.join('\\');
}

