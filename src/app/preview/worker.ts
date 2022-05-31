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
export const MaxDepth = 1;

export const generateSchema = (json, pathVar = '', depth = 0, that: PreviewComponent) => {
    let result = [];
    if (NonObjectTypes.includes(typeof json)) {
        result = getRow(pathVar, '', json, depth, that);
    } else if (ObjectType == typeof json) {
        let objectKeys = [];
        try {
            objectKeys = Object.keys(json).sort(customSort);
        } catch (error) {
            // handleError(error, 'Error generating object keys', json);
        }
        objectKeys.forEach(key => result.push(getRow(pathVar, key, json[key], depth, that)))
    }
    return result;
}

export const getRow = (pathVar: string, key: string, value, depth: number, that: PreviewComponent) => {
    let result: any = { key, value, type: typeof value, template: 'input' };
    result.depth = depth + 1;
    result.pathVar = pathVar ? pathVar + '.' + key : key;
    console.log({ pathVar, key, value, depth })
    // transformations
    if (isUndefined(value)) { // na
        result.template = 'na';
        result.value = 'na';
    } else if (result.type == 'string') { // strings
        const momentInstance = moment(result.value);
        if (isURL(result.value)) {
            result.stringType = 'url';
            result.url = result.value;
        } else if (isEmail(result.value)) {
            result.stringType = 'url';
            result.url = 'mailto:' + result.value;
        } else if (canCall(result.value)) {
            result.stringType = 'url';
            result.url = 'tel:' + result.value;
        } else if (momentInstance.isValid()) {
            result.stringType = 'datetime';
            var format = "DD MMM YYYY h:mm a";
            if (momentInstance.clone().startOf('day').valueOf() === momentInstance.valueOf()) {
                format = "DD MMM YYYY"
            }
            result.title = momentInstance.format(format);
        }
    } else if (ObjectType == result.type) { // JS objects
        if (Array.isArray(value)) { // lists
            result.template = 'list';
            result.type = typeof value[0];
            result.listSummary = '&nbsp;'
            if (depth <= MaxDepth) {
                result.valueMap = value.map((v, i) => generateSchema(v, `${result.pathVar}[${i}]`, result.depth, that));
            } else {
                result.valueMap = [];
            }
            if (ObjectType == result.type) { // list of objects
                result.value = value.map(v => sortObject(v))
                result.jsonString = result.valueMap.map(m => stringifyJSON(m, that));
                // if(result.jsonString[0]) {

                // }
                result.listSummary += '&#123;&nbsp;' + (result.jsonString[0] ? result.jsonString[0].slice(0, -2) : ''); // TODO
                let columns = [];
                let objectKeys = Object.keys(result.value[0]);
                let maxKeys = MaxKeys;
                if (objectKeys.length < maxKeys) maxKeys = objectKeys.length;
                // adding columns until maxKeys
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
                result.listSummary += summarizeList(result.valueMap.map((v, i) => htmlOutput(v, i)));
            }
            // TODO list of lists
        } else { // objects
            result.template = ObjectType;
            result.value = sortObject(result.value);
            result.valueMap = generateSchema(result.value, result.pathVar, result.depth, that);
            result.jsonString = stringifyJSON(result.valueMap, that);
        }
        result.listSummary += '&nbsp;]';
    }
    return result;
}

export const sth = (count) => {
    // let maxKeys = MaxKeys;
    // const objectKeyCount = map.length;
    // let response = ' ';
    // if (objectKeyCount < maxKeys) maxKeys = objectKeyCount;
    // for (let i = 0; i < maxKeys; i++) {
    //     let { value, key } = map[i];
    //     if (that.hideNa && isUndefined(value)) {
    //         if (maxKeys <= (MaxKeys * 1.8)) maxKeys++;
    //     } else {
    //         response += `${key} : ${htmlOutput(map[i], i)}`;
    //         if (i < (objectKeyCount - 1) && i < maxKeys - 1) {
    //             response += ', '
    //         }
    //     }
    // }
    // if (objectKeyCount > maxKeys) {
    //     let ellipsisString = response.charAt(response.length - 2) == ',' ? '... } ,' : ', ... } ,';
    //     response += ellipsisString;
    // } else {
    //     response += ' } ,'
    // }
    // call1 = sth(map.length);
    // let objectKeys = Object.keys(result.value[0]);
    // let maxKeys = MaxKeys;
    // if (objectKeys.length < maxKeys) maxKeys = objectKeys.length;
    // // adding columns until maxKeys
    // for (let i = 0; i < maxKeys; i++) {
    //     const key = objectKeys[i];
    //     let val = result.value[0][key];
    //     if (NonObjectTypes.includes(typeof val)) {
    //         columns.push(key)
    //     } else {
    //         if (maxKeys <= (MaxKeys * 1.8)) maxKeys++;
    //     }
    // }
    // call2 = sth()
    // // start sth
    // let maxKeys = MaxKeys;
}

export const stringifyJSON = (map, that: PreviewComponent) => {
    let maxKeys = MaxKeys;
    const objectKeyCount = map.length;
    let response = ' ';
    if (objectKeyCount < maxKeys) maxKeys = objectKeyCount;
    for (let i = 0; i < maxKeys; i++) {
        let { value, key } = map[i];
        if (that.hideNa && isUndefined(value)) {
            if (maxKeys <= (MaxKeys * 1.8)) maxKeys++;
        } else {
            response += `${key} : ${htmlOutput(map[i], i)}`;
            if (i < (objectKeyCount - 1) && i < maxKeys - 1) {
                response += ', '
            }
        }
    }
    if (objectKeyCount > maxKeys) {
        let ellipsisString = response.charAt(response.length - 2) == ',' ? '... } ,' : ', ... } ,';
        response += ellipsisString;
    } else {
        response += ' } ,'
    }
    return response;
}
// html generation
const wrapQuotes = (string) => `"${string}"`
const applyAttribute = (htmlAttribute, value) => `${htmlAttribute}="${Array.isArray(value) ? value.join(' ') : value}"`; // class="a b"
const summarizeList = (list) => list.join(', ').replace(/, ([^,]*)$/, ' and $1'); // 1, 2 and 3
const createElement = (element, attributes, content, data) => {
    let attributeString = Object.keys(attributes).map(key => applyAttribute(key, attributes[key])).join(' '); // TODO merge as 1 line
    attributeString += Object.keys(data).map(attribute => applyAttribute(`data-${attribute}`, data[attribute])).join(' '); // TODO merge as 1 line
    return `<${element} ${attributeString}>${content}</${element}>` // <a href="url">link</a>
}
export const htmlOutput = (row, index?) => {
    const { value, pathVar, type, title, url, template, stringType } = row;
    let content = value;
    let element = 'span';
    let attributes: any = {
        class: ['clr-black', 'fw-700'],
    }
    let data: any = {
        target: pathVar
    }
    if (index) {
        data.index = index;
    }
    const isString = type == 'string';
    if (template == 'list') {
        content = '[ .. ]';
    } else if (template == 'na') {
        content = 'na'
        attributes.class[0] = 'clr-na';
    } else if (ObjectType == template) {
        content = '{ .. }';
    } else if (type == 'boolean') {
        attributes.class[0] = 'clr-blue';
    }
    if (isString) {
        if (title) {
            attributes.title = title;
        }
        if (stringType == 'datetime') {
            attributes.class[0] = 'clr-date';
        } else if (stringType == 'url') {
            attributes.class = ['fw-700'];
            element = 'a';
            attributes.href = url;
            attributes.target = '_blank';
        }
    }
    let result = createElement(element, attributes, content, data);
    if (isString) {
        result = wrapQuotes(result);
    }
    result = createElement('span', {}, result, data);
    return result;
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
export const isEmail = (email) => {
    const pattern = /\S+@\S+\.\S+/;
    return !!pattern.test(email);
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
