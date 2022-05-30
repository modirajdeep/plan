import { NbMenuItem } from '@nebular/theme';
import * as jp from 'jsonpath';
import { generateSchema } from './worker';
import { JsonComponent } from './json.component';

export interface JsonActions {
    action?: string;
    target: string;
    type: string;
    index: string;
}

export const initialize = (inputString, that: JsonComponent) => {
    if (inputString) {
        let jsonData = parseJSON(inputString, that);
        if (typeof jsonData == 'string') {
            jsonData = parseJSON(jsonData, that);
        }
        that.input = JSON.stringify(jsonData);
        let result = generateSchema({ data: removeEmpty(jsonData) }, '', that);
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

export const handleAction = (params: JsonActions, that: JsonComponent) => {
    const { action, target, type, index } = params;
    let targetStr = target;
    if (index) {
        targetStr += `[${index}]`;
    }
    let data, result;
    switch (action) {
        case 'copy-path':
            that.clipboard.copy(targetStr);
            that.toastrService.show('copied path to clipboard');
            break;
        case 'copy-value':
            data = parseJSON(that.input, that);
            result = jp.query({ data }, '$.' + targetStr);
            let toCopy = result.length > 1 ? result : result[0];
            if (typeof toCopy == 'object') {
                toCopy = JSON.stringify(toCopy);
            }
            that.clipboard.copy(toCopy.toString());
            that.toastrService.show('copied value to clipboard');
            break;
        case 'table-view':
            // data = parseJSON(that.output, that);
            // TODO table view
            console.log(target, index, that.output);
            that.cd.markForCheck();
            that.toastrService.show('under construction', 'view as table', { status: 'primary', icon: 'alert-triangle-outline' });
        // data.tableView = true;
    }
    that.router.navigate(['/']);
}

export const TestJSON = {
    name: 'Rajdeep Modi',
    age: 27,
    born: '1994-09-01T15:09:56.704Z',
    color: 'A77179',
    profiles: [{ name: 'LinkedIn', url: 'https://www.linkedin.com/in/modirajdeep/' }],
    address: {
        city: 'The Hague',
        country: 'The Netherlands',
        color: 'FF9B00',
    },
    call: [
        { type: "office", number: "+31629173380" },
        { type: "personal", number: "+919015502234" }
    ],
    test: null,
    luckyNumbers: [1, 12, 16, 9],
    wishlist: ['apples', 'mangoes'],
    isActive: true
}

export const contextMenuHandler = (event, that: JsonComponent) => {
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
            title: 'Copy', expanded: true, icon: 'copy-outline',
            children: [
                {
                    title: 'path', link,
                    badge: { text, status },
                    queryParams: {
                        action: 'copy-path',
                        ...params
                    }
                },
                {
                    title: 'value', link,
                    queryParams: {
                        action: 'copy-value',
                        ...params
                    }
                },
            ]
        }
    ];
    if (table) {
        contextMenuItems.push({
            title: 'view as table',
            link,
            icon: 'layout-outline',
            queryParams: {
                action: 'table-view',
                ...params
            }
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

export const parseJSON = (input: string, that: JsonComponent) => {
    try {
        const result = JSON.parse(input);
        return result;
    } catch (error) {
        handleError(that, error);
        that.output = undefined;
    }
}

export const handleError = (that: JsonComponent, error, message?: string, debugData?) => {
    console.log(message, debugData);
    console.error(error);
}