import { NbMenuItem } from '@nebular/theme';
import * as jp from 'jsonpath';
import { generateSchema } from './worker';
import { PreviewComponent } from './preview.component';
import { JsonActions } from '../interfaces';

export const initialize = (inputString, that: PreviewComponent) => {
    if (inputString) {
        let jsonData = parseJSON(inputString, that);
        if (typeof jsonData == 'string') {
            jsonData = parseJSON(jsonData, that);
        }
        that.input = JSON.stringify(jsonData);
        let result = generateSchema({ data: removeEmpty(jsonData) }, '', 0, that);
        result[0].expanded = true;
        console.log(result[0]);
        that.zone.run(() => {
            that.output = result;
            that.toastrService.show('loaded json');
        })
    } else {
        that.output = undefined;
    }
}

export const handleAction = (params: JsonActions, that: PreviewComponent) => {
    const { action, target, type, index } = params;
    let targetStr = target;
    if (index) {
        targetStr += `[${index}]`;
    }
    let data, result;
    if (action == 'copy-path') {
        that.clipboard.copy(targetStr);
        that.toastrService.show('copied path to clipboard');
    } else if (action == 'copy-value') {
        data = parseJSON(that.input, that);
        result = jp.query({ data }, '$.' + targetStr);
        let toCopy = result.length > 1 ? result : result[0];
        if (typeof toCopy == 'object') {
            toCopy = JSON.stringify(toCopy);
        }
        that.clipboard.copy(toCopy.toString());
        that.toastrService.show('copied value to clipboard');
    } else if (action == 'table-view') {
        // data = parseJSON(that.output, that);
        // TODO table view
        console.log(target, index, that.output);
        that.cd.markForCheck();
        that.toastrService.show('under construction', 'view as table', { status: 'primary', icon: 'alert-triangle-outline' });
    } else if (action) {
        that.toastrService.show('under construction', action, { status: 'primary', icon: 'alert-triangle-outline' });
    }
    that.router.navigate(['/preview']);
}

export const TestJSON = {
    name: 'Rajdeep Modi',
    age: 27,
    born: '1994-09-01T15:09:56.704Z',
    color: 'A77179',
    pronoun: 'He/Him',
    // nationality: { name: 'Indian', color: '000080' },
    profiles: [
        {
            name: 'LinkedIn', url: 'https://www.linkedin.com/in/modirajdeep/',
            email: [
                { name: 'Personal', id: 'modi.rajdeep@gmail.com' },
                { name: 'Office', id: 'rajdeep.modi@wtsenergy.com' }
            ],
        },
        {
            name: 'GitHub', url: 'https://github.com/modirajdeep',
            email: [
                { name: 'Personal', id: 'modi.rajdeep@gmail.com' }
            ],
        },
        { name: 'Instagram', url: 'https://www.instagram.com/modirajdeep/' },
        { name: 'Facebook', url: 'https://www.facebook.com/modirajdeep/' }
    ],
    // email: [
    //     { name: 'Personal', id: 'modi.rajdeep@gmail.com' },
    //     { name: 'Office', id: 'rajdeep.modi@wtsenergy.com' }
    // ],
    // address: {
    //     city: 'The Hague',
    //     country: 'The Netherlands',
    //     color: 'FF9B00',
    // },
    // call: [
    //     { type: "office", number: "+31629173380" },
    //     { type: "personal", number: "+919015502234" }
    // ],
    // test: null,
    // luckyNumbers: [1, 12, 16, 9],
    // wishlist: ['apples', 'mangoes'],
    // isActive: true
}

export const contextMenuHandler = (event, that: PreviewComponent) => {
    that.isDisplayContextMenu = true;
    const { type, target, index, table } = event.target.dataset;
    let text = target;
    if (index) {
        text += `[${index}]`;
    }
    const params: JsonActions = { type, target, index };
    const link = '/';
    const status = 'info';
    let contextMenuItems: Array<NbMenuItem> = [
        {
            title: 'address', link, icon: 'copy-outline',
            badge: { text, status },
            queryParams: { action: 'copy-path', ...params }
        },
        {
            title: 'value', link, icon: 'copy-outline',
            queryParams: { action: 'copy-value', ...params }
        },
        {
            title: 'share', icon: 'share-outline', link,
            queryParams: { action: 'share', ...params }
        },
        {
            title: 'bookmark', icon: 'bookmark-outline', link,
            queryParams: { action: 'bookmark', ...params }
        },
        {
            title: 'history', icon: 'hard-drive-outline', link,
            queryParams: { action: 'history', ...params }
        }
    ];
    if (table) {
        contextMenuItems.push({
            title: 'view as table', icon: 'layout-outline', link,
            queryParams: { action: 'table-view', ...params }
        })
    }
    that.contextMenuItems = contextMenuItems;
    that.contextX = event.clientX;
    that.contextY = event.clientY;
}

export const removeEmpty = (obj) => Array.isArray(obj) ? obj : Object.entries(obj)
    .filter(([_, v]) => v != null)
    .reduce(
        (acc, [k, v]) => ({ ...acc, [k]: v === Object(v) ? removeEmpty(v) : v }),
        {}
    )

export const parseJSON = (input: string, that: PreviewComponent) => {
    try {
        const result = JSON.parse(input);
        return result;
    } catch (error) {
        handleError(that, error);
        that.output = undefined;
    }
}

export const handleError = (that: PreviewComponent, error, message?: string, debugData?) => {
    console.log(message, debugData);
    console.error(error);
}