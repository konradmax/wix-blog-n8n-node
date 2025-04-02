"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WixBlog = void 0;
const sdk_1 = require("@wix/sdk");
const blog_1 = require("@wix/blog");
// Manually define the TextAlignment enum
var TextAlignment;
(function (TextAlignment) {
    TextAlignment["AUTO"] = "AUTO";
    TextAlignment["LEFT"] = "LEFT";
    TextAlignment["RIGHT"] = "RIGHT";
    TextAlignment["CENTER"] = "CENTER";
    TextAlignment["JUSTIFY"] = "JUSTIFY";
})(TextAlignment || (TextAlignment = {}));
// Define the NodeType enum
var NodeType;
(function (NodeType) {
    NodeType["PARAGRAPH"] = "PARAGRAPH";
    NodeType["TEXT"] = "TEXT";
})(NodeType || (NodeType = {}));
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
                color: '#32a852',
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
                    description: 'Your Wix API Key.',
                },
                {
                    displayName: 'Site ID',
                    name: 'siteId',
                    type: 'string',
                    default: '',
                    required: true,
                    description: 'Your Wix Site ID.',
                },
                {
                    displayName: 'Article Title',
                    name: 'articleTitle',
                    type: 'string',
                    default: '',
                    required: true,
                    description: 'Title of the article to publish.',
                },
                {
                    displayName: 'Article Content (Text)',
                    name: 'articleContent',
                    type: 'string',
                    default: '',
                    required: false,
                    description: 'Plain text content of the article.',
                },
                {
                    displayName: 'Member ID',
                    name: 'memberId',
                    type: 'string',
                    default: '',
                    required: true,
                    description: 'ID of the member creating the article.',
                },
            ],
        };
    }
    async execute() {
        const items = this.getInputData();
        const returnData = [];
        for (let i = 0; i < items.length; i++) {
            const apiKey = this.getNodeParameter('apiKey', i);
            const siteId = this.getNodeParameter('siteId', i);
            const articleTitle = this.getNodeParameter('articleTitle', i);
            const articleContent = this.getNodeParameter('articleContent', i, '');
            const memberId = this.getNodeParameter('memberId', i);
            const wixClient = (0, sdk_1.createClient)({
                modules: { draftPosts: blog_1.draftPosts },
                auth: (0, sdk_1.ApiKeyStrategy)({
                    siteId,
                    apiKey,
                }),
            });
            const richContent = {
                nodes: [
                    {
                        type: NodeType.PARAGRAPH,
                        nodes: [
                            {
                                type: NodeType.TEXT,
                                nodes: [],
                                textData: {
                                    text: articleContent,
                                    decorations: [],
                                },
                            },
                        ],
                        paragraphData: {
                            textStyle: {
                                textAlignment: TextAlignment.AUTO,
                            },
                            indentation: 0,
                        },
                    },
                ],
                metadata: {},
            };
            try {
                const response = await wixClient.draftPosts.createDraftPost({
                    title: articleTitle,
                    richContent: richContent,
                    memberId: memberId,
                }, {});
                returnData.push(response);
            }
            catch (error) {
                const err = error;
                throw new Error(`Failed to create draft post: ${err.response?.data?.message || err.message || 'Unknown error'}`);
            }
        }
        return [this.helpers.returnJsonArray(returnData)];
    }
}
exports.WixBlog = WixBlog;
//# sourceMappingURL=WixBlog.node.js.map