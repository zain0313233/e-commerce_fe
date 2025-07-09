const CACHE_DURATION= 5 * 60 * 1000;
class FrontendCache{
    constructor(){
        this.cache=new Map()
    }
    set(key,data,ttl = CACHE_DURATION){
        const expireat =Date.now + ttl;
        this.cache.set(key,{data,expireat});
    }
    get(key){
        const item=this.cache.get(key)
        if(!item) return null;
        if(Date.now() > item.expiresAt){
            this.cache.delete(key);
            return null
        }
    }
    clear() {
    this.cache.clear();
  }

  delete(key) {
    this.cache.delete(key);
  }
}
export const productCache = new FrontendCache();