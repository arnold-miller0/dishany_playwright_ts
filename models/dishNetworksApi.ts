import { APIRequestContext, expect } from '@playwright/test';
import { DishNetworkObj, DishNetworkObjs} from '../models/dishNetworkObjs';


interface NetworkJson { 
    name: string;  // obj title
    slug: string;  // obj slug
    network_id: number; // obj net_id
    has_stream: boolean; // obj is_live
    is_locked: boolean; // obj is_locked
    is_latino_package_network: boolean; // obj is_latino
    is_bb: boolean; // obj is_movie
    logo: string;   // obj imgSrc
}


interface PromoteJson { 
        slug: string;
        url: string;
        image_url: string
}

export class DishNetworksAPI {

    private _request: APIRequestContext;

    private _ApiBaseURL; 

    private _allNetworkObjs: DishNetworkObjs = new DishNetworkObjs("All API Networks");
    private _liveNetObjs: DishNetworkObjs = new DishNetworkObjs("Live API Networks");
    private _unlockNetObjs: DishNetworkObjs = new DishNetworkObjs("Unlock API Networks");
    private _latinoNetObjs: DishNetworkObjs = new DishNetworkObjs("Latino API Networks");
    private _movieNetObjs: DishNetworkObjs = new DishNetworkObjs("Movie API Networks");

    constructor(
        request: APIRequestContext,
        baseURL: string
    ) {
        this._request = request;
        this._ApiBaseURL = baseURL;
        this._initNetListObjs();
    }
    
    getApiBaseURL(): string {
        return this._ApiBaseURL
    }

    getAllNetworkObjs(): DishNetworkObjs {
        return this._allNetworkObjs
    }
    
    getAllNetworkTitle(): string {
        return this.getAllNetworkObjs().getTitle();
    }


    private _initNetListObjs():void {
        this._allNetworkObjs.initObjList();
        this._liveNetObjs.initObjList();
        this._unlockNetObjs.initObjList();
        this._latinoNetObjs.initObjList();
        this._movieNetObjs.initObjList();
    }

    async setAllNetworkObjs(
        debug?:boolean
    ): Promise<void> {
        const url = "v20/dol/networks/home.json"
        const params = new URLSearchParams({
            // totalItems: '15'
        });
        const headers = {
            "Accept": "application/vnd.echostar.franchise+json;version=1"
        }
        const fullUrl = this._ApiBaseURL + url;
        // console.log(`${fullUrl}?${params}`);
        const response = await this._request.get(`${fullUrl}?${params}`, { headers });
        if (response.status() !== 200) {
            throw new Error(`GET Dish Home API Networks Failed with status ${response.status()}`);
        }

        const itemList:NetworkJson[] = await response.json()
        // check that index is integer; >= 0 and < data.length

        this._initNetListObjs();

        const itemCount = itemList.length;
        if (debug) console.log(`All count: ${itemCount};`);
        for (let j = 0; j < itemCount; j++) {
            const itemJson = itemList[j]
            const title = itemJson.name;
            const slug = itemJson.slug;
            const net_id = itemJson.network_id;
            const is_live = itemJson.has_stream;
            const is_locked = itemJson.is_locked;
            const is_latino = itemJson.is_latino_package_network;
            const is_movie = itemJson.is_bb;
            const imgSrc = itemJson.logo
            const objItem = new DishNetworkObj(title, slug, net_id, 
                is_live, is_locked, is_latino, is_movie, imgSrc)
            this._allNetworkObjs.addNetworkObj(objItem);
            if (debug) {
                console.log(`${title} item[${j}]: title=${title}; slug=${slug}; bet_id=${net_id};`)
                console.log(`\t live=${is_live}; lock=${is_locked}; latino=${is_latino}; movie=${is_movie};`)
                console.log(`\t imgsrc=${imgSrc};`)
            }
            if (is_live) { this._liveNetObjs.addNetworkObj(objItem)};
            if (!is_locked) { this._unlockNetObjs.addNetworkObj(objItem)};
            if (is_latino) { this._latinoNetObjs.addNetworkObj(objItem)};
            if (is_movie) { this._movieNetObjs.addNetworkObj(objItem)};
        }
    }

    filterNetList(
        filterTitle:string,
        live:boolean,
        unlocked:boolean,
        latino:boolean,
        movie:boolean,
        debug?:boolean
    ): DishNetworkObjs {

       
        
        // if (debug) { console.log("filters:", live, unlocked, latino, movie) }

        // Check Filter All Networks or only One Filter list from largest to smaillest
        // When have Filter All Networks or only One return that filtered list
        // Others set init-Obj Filter list to that filtered list for future matching
        //  Check 1st Filter All Networks 
        //  Check 2nd Filter Only Live 
        //  Check 3rd Filter Only Latino
        //  Check 4th Filter Only Movie
        //  Check 5th Filter Only Unlocked

        let filterNetObjs = new DishNetworkObjs(filterTitle);
        let initObjList = this._allNetworkObjs.getObjList();

        // All Networks
        if (!live && !unlocked && !latino && !movie) {
            const rtnNetObjs = this._allNetworkObjs.copyNetObjList(filterTitle, debug)         
            if (debug) { console.log(`filter Network list has ${rtnNetObjs.getListCount()} objs`) }
            return rtnNetObjs
        }

        if (live) { // Only Live Networks 
            if (!unlocked && !latino && !movie)  {
                const rtnNetObjs = this._liveNetObjs.copyNetObjList(filterTitle, debug)         
                if (debug) { console.log(`filter Network list has ${rtnNetObjs.getListCount()} objs`) }
                return rtnNetObjs
            }
            initObjList = this._liveNetObjs.getObjList();
        }

         if (latino) { // Only Latino Networks 
            if (!unlocked && !live && !movie)  {
                const rtnNetObjs = this._latinoNetObjs.copyNetObjList(filterTitle, debug)         
                if (debug) { console.log(`filter Network list has ${rtnNetObjs.getListCount()} objs`) }
                return rtnNetObjs
            }
            initObjList = this._latinoNetObjs.getObjList();
        }

        if (movie) { // Only Movie Networks
            if (!unlocked && !live && !latino)  {
                const rtnNetObjs = this._movieNetObjs.copyNetObjList(filterTitle, debug)         
                if (debug) { console.log(`filter Network list has ${rtnNetObjs.getListCount()} objs`) }
                return rtnNetObjs
            }
            initObjList = this._movieNetObjs.getObjList();
        }
  
        if (unlocked) { // Only Unlock Networks
            if (!movie && !live && !latino)  {
                const rtnNetObjs = this._unlockNetObjs.copyNetObjList(filterTitle, debug)         
                if (debug) { console.log(`filter Network list has ${rtnNetObjs.getListCount()} objs`) }
                return rtnNetObjs
            }
            initObjList = this._unlockNetObjs.getObjList();
        }

        // Now match init-Obj list with all filter booleans
        const itemCount = initObjList.length;
         for (let j = 0; j < itemCount; j++) {
            const itemJson:DishNetworkObj = initObjList[j]
            const title = itemJson.getTitle();
            const slug = itemJson.getSlug();
            const net_id = itemJson.getNetId();
            const is_live = itemJson.getIsLive();
            const is_locked = itemJson.getIslocked();
            const is_latino = itemJson.getIsLatino()
            const is_movie = itemJson.getIsMovie();
            const imgSrc = itemJson.getIsImgSrc();

            const live_match = live?is_live:true;
            const unlc_match = unlocked?!is_locked:true;
            const lati_match = latino?is_latino:true;
            const movi_match = movie?is_movie:true;

            if ( live_match && unlc_match && lati_match && movi_match) {
                const objItem = new DishNetworkObj(title, slug, net_id, 
                is_live, is_locked, is_latino, is_movie, imgSrc)
                filterNetObjs.addNetworkObj(objItem);
                if (debug) {
                    console.log(`matched: ${title} item[${j}]: ${title}; ${slug}; ${net_id} `)
                }
            }
         }
        return filterNetObjs
    }


}