"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.publishArticle = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
async function publishArticle(apiKey, title, content) {
    const url = 'https://www.wixapis.com/v2/blog/posts';
    const headers = {
        Authorization: apiKey,
        'Content-Type': 'application/json'
    };
    const body = JSON.stringify({
        title: title,
        content: content,
        status: 'PUBLISHED'
    });
    try {
        const response = await (0, node_fetch_1.default)(url, {
            method: 'POST',
            headers: headers,
            body: body
        });
        if (!response.ok) {
            throw new Error(`Wix API error: ${response.statusText}`);
        }
        const result = await response.json();
        return result;
    }
    catch (error) {
        const err = error;
        throw new Error(`Failed to publish article: ${err.message}`);
    }
}
exports.publishArticle = publishArticle;
//# sourceMappingURL=GenericFunctions.js.map