
export class DishNetworkObj {
    private _title:string;      // via name
    private _slug:string;       // via slug
    private _net_id:number; // via network_id
    private  is_live:boolean;   // via has_stream
    private _is_locked:boolean; // via is_locked
    private _is_latino:boolean; // via is_latino_package_network
    private _is_movie:boolean;  // via is_bb
    private _imgSrc:string;     // via logo

    constructor(title:string, 
        slug:string, 
        net_id:number,
        is_live:boolean,
        is_locked:boolean,
        is_latino:boolean,
        is_movie:boolean,
        imgSrc:string)
    {
        this._title = title;
        this._slug = slug;
        this._net_id = net_id;
        this.is_live = is_live;
        this._is_locked = is_locked;
        this._is_latino = is_latino;
        this._is_movie = is_movie;
        this._imgSrc = imgSrc;
    }

    toString():string {
    return `${this._title}; ${this._slug}; ${this.is_live}; ${this._is_locked}; ${this._is_latino}; ${this._is_movie}; ${this._imgSrc}`;
    }

    getTitle():string {
        return this._title;
    }

    getSlug():string {
        return this._slug;
    }
    
    getNetId():number {
        return this._net_id;
    }

    getIsLive():boolean {
        return this.is_live;
    }

    getIslocked():boolean {
        return this._is_locked;
    }

    getIsLatino():boolean {
        return this._is_latino;
    }

    getIsMovie():boolean {
        return this._is_movie;
    }
    
    getIsImgSrc():string {
        return this._imgSrc;
    }

    equal(other:DishNetworkObj)
    :boolean {
        // false when other is null or undefined
        if (other == null) return false;

        // when other is DishNetworkObj
        // then just compare title, slug and net_id
        return ( other instanceof DishNetworkObj
            && this._title === other._title 
            && this._slug === other._slug 
            && this._net_id === other._net_id
        );
    }
}

export class DishNetworkObjs {

    private _title:string = "";
    private _objList:DishNetworkObj[] = [];

    constructor(
        title:string)
    {
        this._title = title;
        this.initObjList();
    }

    getTitle():string {
        return this._title;
    }

    setTitle(title:string):void {
        this._title = title
     }

    initObjList():void {
        this._objList = [];
    }
    getObjList():DishNetworkObj[] {
        return this._objList;
    }

    getListCount():number {
        return this._objList.length;
    }

    setObjList(objList:DishNetworkObj[]):void {
        this._objList = objList;
        
    }
     
    addNetworkObj(objItem:DishNetworkObj):void {
        this._objList.push(objItem)
    }

    addObjViaItems(
        title:string, 
        slug:string, 
        net_id:number, 
        is_live:boolean,
        is_locked:boolean,
        is_latino:boolean,
        is_movie:boolean,
        imgSrc:string):void {
        const objItem = new DishNetworkObj(title, slug, net_id, 
            is_live, is_locked, is_latino, is_movie, imgSrc);
        this.addNetworkObj(objItem);
    }

    copyNetObjList(newTitle:string, debug?:boolean):DishNetworkObjs {
        let rtnNetObjs:DishNetworkObjs = new DishNetworkObjs(newTitle);
        const itemCount = this.getObjList().length;
        if (debug) {  console.log(`Copy ${itemCount} objects`) }
        for (let j = 0; j < itemCount; j++) {
            const itemObj:DishNetworkObj = this._objList[j];
            const title = itemObj.getTitle();
            const slug = itemObj.getSlug();
            const net_id = itemObj.getNetId();
            const is_live = itemObj.getIsLive();
            const is_locked = itemObj.getIslocked();
            const is_latino = itemObj.getIsLatino()
            const is_movie = itemObj.getIsMovie();
            const imgSrc = itemObj.getIsImgSrc();
            const objItem = new DishNetworkObj(title, slug, net_id, 
                        is_live, is_locked, is_latino, is_movie, imgSrc);
            rtnNetObjs.addNetworkObj(objItem);
        }
        return rtnNetObjs
    }
    
}
