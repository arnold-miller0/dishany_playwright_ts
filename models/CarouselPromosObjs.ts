
export class DishCarouselObj {
    private _title:string;
    private _slug:string;
    private _href:string;
    private _imgSrc:string;

    constructor(title:string, 
        slug:string, 
        href:string, 
        imgSrc:string)
    {
        this._title = title;
        this._slug = slug;
        this._href = href;
        this._imgSrc = imgSrc;
    }

    toString():string {
    return `${this._title}; ${this._slug}; ${this._href}; ${this._imgSrc}`;
    }

    getTitle():string {
        return this._title;
    }

    getSlug():string {
        return this._slug;
    }

    equal(other:DishCarouselObj)
    :boolean {
        // false when other is null or undefined
        if (other == null) return false;

        // when other is DishCarouselObj
        // then just compare title, id and href
        return ( other instanceof DishCarouselObj
            && this._title === other._title 
            && this._slug === other._slug 
            && this._href === other._href 
        );
    }
}

export class DishGroupObjs {

    private _title:string;
    private _name:string;
    private _type:string;
    private _objList:DishCarouselObj[];

    constructor(
        title:string, 
        name?:string, 
        type?:string)
    {
        this._title = title;
        this._name = (name != null ? name : "");
        this._type = (type != null ? type : "");
        this._objList = []
    }

    getTitle():string {
        return this._title;
    }

    setTitle(title:string):void {
        this._title = title
     }

    getName():string {
        return this._name;  
    }

    setName(name:string):void {
        this._name = name
     }

    getType():string {
        return this._type;
    }

    setType(type:string):void {
        this._type = type
     }

    getObjList():DishCarouselObj[] {
        return this._objList;
        
    }

    setObjList(objList:DishCarouselObj[]):void {
        this._objList = objList;
        
    }
     
    addCarouselObj(objItem:DishCarouselObj):void {
        this._objList.push(objItem)
    }

    addObjViaItems(
        title:string, 
        id:string, 
        href:string, 
        imgSrc:string):void {
        const objItem = new DishCarouselObj(title, id, href, imgSrc);
        this.addCarouselObj(objItem);
    }
    
}
