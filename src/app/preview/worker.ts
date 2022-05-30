import * as moment from 'moment-timezone';
import { PreviewComponent } from './preview.component';
export const NonObjectTypes = ['string', 'number', 'boolean'];
export const ObjectType = 'object';
export const Types = {
    templates: ['input', 'list', 'object', 'na'],
    types: ['object', 'array', 'string', 'number'],
    stringTypes: ['url', 'date']
};
export const MaxKeys = 8;
export const KeySortOrder = ['id', 'title', 'label', 'username', 'name', 'value', 'type'];

export const generateSchema = (json, pathVar = '', that: PreviewComponent) => {
    let result = [];
    if (NonObjectTypes.includes(typeof json)) {
        result = getRow(pathVar, '', json, that);
    } else if (ObjectType == typeof json) {
        let objectKeys = [];
        try {
            objectKeys = Object.keys(json).sort(customSort);
        } catch (error) {
            // handleError(error, 'Error generating object keys', json);
        }
        objectKeys.forEach(key => result.push(getRow(pathVar, key, json[key], that)))
    }
    return result;
}

export const getRow = (pathVar: string, key: string, value, that: PreviewComponent) => {
    let result: any = { key, value, type: typeof value, template: 'input' };
    result.pathVar = pathVar ? pathVar + '.' + key : key;
    // transformations
    if (isUndefined(value)) { // na
        result.template = 'na';
        result.value = 'na';
    } else if (result.type == 'string') { // strings
        const momentInstance = moment(result.value);
        if (isURL(result.value)) {
            result.stringType = 'url';
            result.url = result.value;
        } else if (canCall(result.value)) {
            result.stringType = 'url';
            result.url = 'tel:' + result.value;
        } else if (momentInstance.isValid()) {
            result.stringType = 'datetime';
            var format = "DD MMM YYYY h:mm a";
            if (momentInstance.clone().startOf('day').valueOf() === momentInstance.valueOf()) {
                format = "DD MMM YYYY"
            }
            result.dateTimeStr = momentInstance.format(format)
        }
    } else if (ObjectType == result.type) { // JS objects
        if (Array.isArray(value)) { // lists
            result.template = 'list';
            result.type = typeof value[0];
            result.listSummary = '&nbsp;'
            result.valueMap = value.map((v, i) => generateSchema(v, `${result.pathVar}[${i}]`, that));
            if (ObjectType == result.type) { // list of objects
                result.value = value.map(v => sortObject(v))
                result.jsonString = value.map(v => stringifyJSON(v, that));
                result.listSummary += '&#123;&nbsp;' + result.jsonString[0].slice(0, -2);
                let columns = [];
                let objectKeys = Object.keys(result.value[0]);
                let maxKeys = MaxKeys;
                if (objectKeys.length < maxKeys) maxKeys = objectKeys.length;
                for (let i = 0; i < maxKeys; i++) {
                    const key = objectKeys[i];
                    let val = result.value[0][key];
                    if (NonObjectTypes.includes(typeof val)) {
                        columns.push(key)
                    } else {
                        if (maxKeys <= (MaxKeys * 1.8)) maxKeys++;
                    }
                }
                result.columns = columns;
            } else if (NonObjectTypes.includes(result.type)) { // list of non objects
                result.listSummary += value.map(v => htmlOutput(v)).toString();
            }
            // TODO list of lists
        } else { // objects
            result.template = ObjectType;
            result.value = sortObject(result.value);
            result.valueMap = generateSchema(result.value, result.pathVar, that);
            result.jsonString = stringifyJSON(result.value, that);
        }
        result.listSummary += '&nbsp;]';
    }
    return result;
}

export const stringifyJSON = (obj, that: PreviewComponent) => {
    let maxKeys = MaxKeys;
    const objectKeys = Object.keys(obj).sort(customSort);
    let response = ' ';
    // if (obj.title == 'Open Shifts') {
    //   console.log({ objectKeys })
    // }
    if (objectKeys.length < maxKeys) maxKeys = objectKeys.length;
    for (let i = 0; i < maxKeys; i++) {
        const key = objectKeys[i];
        let value = obj[key];
        if (that.hideNa && isUndefined(value)) {
            if (maxKeys <= (MaxKeys * 1.8)) maxKeys++;
        } else {
            response += `${key} : ${htmlOutput(value)}`;
            if (i < (objectKeys.length - 1) && i < maxKeys - 1) {
                response += ', '
            }
        }
    }
    if (objectKeys.length > maxKeys) {
        let ellipsisString = response.charAt(response.length - 2) == ',' ? '... } ,' : ', ... } ,';
        response += ellipsisString;
    } else {
        response += ' } ,'
    }
    return response;
}


export const htmlOutput = (value) => {
    let styleClass = 'clr-black';
    const isString = typeof value == 'string';
    if (Array.isArray(value)) {
        value = '[ .. ]';
    } else if (isUndefined(value)) {
        value = 'na'
        styleClass = 'clr-na';
    } else if (ObjectType == typeof value) {
        value = '{ .. }';
    } else if (typeof value == 'boolean') {
        styleClass = 'clr-blue';
    }
    return `${isString ? '"' : ''}<span class="fw-700 ${styleClass}">${value}</span>${isString ? '"' : ''}`
}

// validations

export const isURL = (str) => {
    const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!pattern.test(str);
}

export const canCall = str => {
    const pattern = new RegExp(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im);
    return !!pattern.test(str);
}

export const isUndefined = (v) => [undefined, null].includes(v);

// sorting
export const customSort = (a, b) => {
    if (KeySortOrder.includes(a) && KeySortOrder.includes(b)) {
        return KeySortOrder.indexOf(a) - KeySortOrder.indexOf(b)
    } else if (!KeySortOrder.includes(a) && KeySortOrder.includes(b)) {
        return 1;
    } else if (KeySortOrder.includes(a) && !KeySortOrder.includes(b)) {
        return -1;
    } else {
        return a.normalize().localeCompare(b.normalize())
    }
}

export const sortObject = o => Object.keys(o).sort(customSort).reduce((r, k) => (r[k] = o[k], r), {})
