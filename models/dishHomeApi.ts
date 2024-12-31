import { APIRequestContext, expect } from '@playwright/test';
import { DishCarouselObj, DishGroupObjs } from '../models/CarouselPromosObjs';


interface CarouselJson { 
    title: string; 
    list_name: string;
    item_type: string;
    items: [
        {
            kind: string;
            is_locked: boolean; 
            name: string;
            slug: string;
            images: { wide_poster_url: string}
        }
    ]
}


interface PromoteJson { 
        slug: string;
        url: string;
        image_url: string
}

export class DishHomeAPI {

    private _request: APIRequestContext;

    private _ApiBaseURL; 

    private _mostPopGrpObjs: DishGroupObjs;
    private _availNowGrpObjs: DishGroupObjs;
    private _promoteGrpObjs: DishGroupObjs;


    constructor(
        request: APIRequestContext,
        baseURL: string
    ) {
        this._request = request;
        this._ApiBaseURL = baseURL;
        this._mostPopGrpObjs = new DishGroupObjs("","","");
        this._availNowGrpObjs = new DishGroupObjs("","","");
        this._promoteGrpObjs = new DishGroupObjs("Promote","","");
    }
    
    getApiBaseURL(): string {
        return this._ApiBaseURL
    }

    getMostPopGrpObj(): DishGroupObjs {
        return this._mostPopGrpObjs
    }
    
    getMostPopGrpTitle(): string {
        return this.getMostPopGrpObj().getTitle();
    }

    getMostPopItems(): DishCarouselObj[] {
        return this.getMostPopGrpObj().getObjList();
    }

    getAvailNowGrpObj(): DishGroupObjs {
        return this._availNowGrpObjs
    }
    
    getAvailNowTitle(): string {
        return this.getAvailNowGrpObj().getTitle();
    }

    getAvailNowItems(): DishCarouselObj[] {
        return this.getAvailNowGrpObj().getObjList();
    }

    private async _setGroupObjs(
        index:number, debug?:boolean
    ): Promise<DishGroupObjs> {
        const url = "v20/dol/carousel_group/home.json"
        const params = new URLSearchParams({
            totalItems: '15'
        });
        const headers = {
            "Accept": "application/vnd.echostar.franchise+json;version=1"
        }
        const fullUrl = this._ApiBaseURL + url;
        // console.log(`${fullUrl}?${params}`);
        const response = await this._request.get(`${fullUrl}?${params}`, { headers });
        if (response.status() !== 200) {
            throw new Error(`GET Dish Home API Carousel Failed with status ${response.status()}`);
        }

        const data:CarouselJson[] = await response.json()
        // check that index is integer; >= 0 and < data.length
        expect(Number.isInteger(index)).toBe(true);
        expect(index).toBeGreaterThanOrEqual(0);
        expect(index).toBeLessThan(data.length);

        const carouselJson =  data[index];
        const dishGroupObjs = new DishGroupObjs(carouselJson.title, carouselJson.list_name, carouselJson.item_type)
        const title = dishGroupObjs.getTitle();
        const type = dishGroupObjs.getType();

        const itemList = carouselJson.items;
        const itemCount = itemList.length;
        if (debug) console.log(`${title} count: ${itemCount}; ${dishGroupObjs.getName()}; ${type}`);
        for (let j = 0; j < itemCount; j++) {
            const itemJson = itemList[j]
            const kind = itemJson.kind;
            const locked = itemJson.is_locked;
            const itemName = itemJson.name
            const itemSlug = itemJson.slug;
            const itemhref = `/${type}/${itemSlug}`
            const imgSrc = itemJson.images.wide_poster_url;
            const objItem = new DishCarouselObj(itemName, itemSlug, itemhref, imgSrc)
            dishGroupObjs.addCarouselObj(objItem);
            if (debug) {
                console.log(`${title} item[${j}]: ${itemName}; ${itemSlug}; ${itemhref} `)
                console.log(`${title} item[${j}]: ${imgSrc}; `)
            }
        }
        return dishGroupObjs;
    }

    async setMostPopGrpObjs(debug?:boolean) {
        // Most Popular is at json Data array index 0 
        this._mostPopGrpObjs = await this._setGroupObjs(0, debug);
    }

    async setAvailNowObjs(debug?:boolean) {
        // Available Now is at json Data array index 0 
        this._availNowGrpObjs = await this._setGroupObjs(1, debug);
    }

    getPromoteObjs(): DishGroupObjs {
        return this._promoteGrpObjs
    }

    getPromoteTitle(): string {
        return this.getPromoteObjs().getTitle();
    }

    getPromoteItems(): DishCarouselObj[] {
        return this.getPromoteObjs().getObjList();
    }

    async setPromoteObjs(
        debug?:boolean
    ): Promise<void> {
        const url = "v20/dol/home/promos.json"
        const params = new URLSearchParams({
        });
        const headers = {
            "Accept": "application/vnd.echostar.franchise+json;version=1"
        }
        const fullUrl = this._ApiBaseURL + url;
        // console.log(`${fullUrl}?${params}`);
        const response = await this._request.get(`${fullUrl}?${params}`, { headers });
        if (response.status() !== 200) {
            throw new Error(`GET Dish Home API Promote Failed with status ${response.status()}`);
        }

        const itemList:PromoteJson[] = await response.json()
      
        const title = this._promoteGrpObjs.getTitle();

        const itemCount = itemList.length;
        for (let j = 0; j < itemCount; j++) {
            const itemJson = itemList[j]
            const name = ""
            const urlFull = itemJson.url;
            const urlSplit = urlFull.split('/');
            const urlCount = urlSplit.length
            const slug = urlSplit[urlCount-1]
            const imgSrc = itemJson.image_url;
            const objItem = new DishCarouselObj(name, slug, urlFull, imgSrc)
            this._promoteGrpObjs.addCarouselObj(objItem);
            if (debug) {
                console.log(`${title} item[${j}]: ${name}; ${slug}; ${urlFull} `)
                console.log(`${title} item[${j}]: ${imgSrc}; `)
            }
        }
    }

}