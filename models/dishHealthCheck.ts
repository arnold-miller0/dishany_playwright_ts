import { APIRequestContext } from '@playwright/test';


interface CheckJson { 
    env: string; 
    git: {branch: string} 
}

export class DishHealthCheckAPI {
    private _request: APIRequestContext;

    private _env: String;
    private _branch: String;
    private _webVer: String;

    constructor(request: APIRequestContext) {
        this._request = request;

        this._env = "nothing"
        this._branch = "00-0-0"
        this._webVer = "00.0.0"
    }

    async evalHealth(dishBaseURL:String) {
        const response = await this._request.get(`${dishBaseURL}/health/config_check`);
        if (response.status() !== 200) {
            throw new Error(`GET Dish Health Check Failed with status ${response.status()}`);
        }
        const data:CheckJson = await response.json()
        this._env = data.env;
        this._branch = data.git.branch;
        this._webVer = this._branch.replace(/-/g,".");
    }

    getEnv(): String {
        return this._env;
    }
    
    getBranch(): String {
        return this._branch;
    }

    getWebVer(): String {
        return this._webVer;
    }

}
