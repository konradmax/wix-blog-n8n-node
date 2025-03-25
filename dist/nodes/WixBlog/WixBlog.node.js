"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WixBlog = void 0;
const sdk_1 = require("@wix/sdk");
const blog_1 = require("@wix/blog");
class WixBlog {
    constructor() {
        this.description = {
            displayName: 'Wix Blog',
            name: 'wixBlog',
            group: ['transform'],
            version: 1,
            description: 'Publishes draft posts to Wix Blog using Wix REST API',
            defaults: {
                name: 'Wix Blog',
                color: '#32a852'
            },
            inputs: [{ type: "main" /* NodeConnectionType.Main */ }],
            outputs: [{ type: "main" /* NodeConnectionType.Main */ }],
            properties: [
                {
                    displayName: 'API Key',
                    name: 'apiKey',
                    type: 'string',
                    default: '',
                    required: true,
                    description: 'Your Wix API Key.'
                },
                {
                    displayName: 'Site ID',
                    name: 'siteId',
                    type: 'string',
                    default: '',
                    required: true,
                    description: 'Your Wix Site ID.'
                },
                {
                    displayName: 'Article Title',
                    name: 'articleTitle',
                    type: 'string',
                    default: '',
                    required: true,
                    description: 'Title of the article to publish.'
                },
                {
                    displayName: 'Member ID',
                    name: 'memberId',
                    type: 'string',
                    default: '',
                    required: true,
                    description: 'ID of the member creating the article.'
                }
            ]
        };
    }
    async execute() {
        const items = this.getInputData();
        const apiKey = this.getNodeParameter('apiKey', 0);
        const siteId = this.getNodeParameter('siteId', 0);
        const articleTitle = this.getNodeParameter('articleTitle', 0);
        const memberId = this.getNodeParameter('memberId', 0);
        const wixClient = (0, sdk_1.createClient)({
            modules: { draftPosts: blog_1.draftPosts },
            auth: (0, sdk_1.ApiKeyStrategy)({
                siteId,
                apiKey
            })
        });
        try {
            const response = await wixClient.draftPosts.createDraftPost({
                title: articleTitle,
                memberId
            }, {});
            return [this.helpers.returnJsonArray(response)];
        }
        catch (error) {
            const err = error;
            throw new Error(`Failed to create draft post: ${err.response?.data?.message || err.message || 'Unknown error'}`);
        }
    }
}
exports.WixBlog = WixBlog;
//# sourceMappingURL=WixBlog.node.js.map