import {
	INodeType,
	INodeTypeDescription,
	IExecuteFunctions,
	NodeConnectionType,
	IDataObject,
} from 'n8n-workflow';

import { createClient, ApiKeyStrategy } from '@wix/sdk';
import { draftPosts } from '@wix/blog';

// Manually define the TextAlignment enum
enum TextAlignment {
	AUTO = 'AUTO',
	LEFT = 'LEFT',
	RIGHT = 'RIGHT',
	CENTER = 'CENTER',
	JUSTIFY = 'JUSTIFY',
}

// Define the NodeType enum
enum NodeType {
	PARAGRAPH = 'PARAGRAPH',
	TEXT = 'TEXT',
}

export class WixBlog implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Wix Blog',
		name: 'wixBlog',
		group: ['transform'],
		version: 1,
		description: 'Publishes draft posts to Wix Blog using Wix REST API',
		defaults: {
			name: 'Wix Blog',
			color: '#32a852',
		},
		inputs: [{ type: NodeConnectionType.Main }],
		outputs: [{ type: NodeConnectionType.Main }],
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

	async execute(this: IExecuteFunctions): Promise<any> {
		const items = this.getInputData();
		const returnData: IDataObject[] = [];

		for (let i = 0; i < items.length; i++) {
			const apiKey = this.getNodeParameter('apiKey', i) as string;
			const siteId = this.getNodeParameter('siteId', i) as string;
			const articleTitle = this.getNodeParameter('articleTitle', i) as string;
			const articleContent = this.getNodeParameter('articleContent', i, '') as string;
			const memberId = this.getNodeParameter('memberId', i) as string;

			const wixClient = createClient({
				modules: { draftPosts },
				auth: ApiKeyStrategy({
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
				const response = await wixClient.draftPosts.createDraftPost(
					{
						title: articleTitle,
						richContent: richContent,
						memberId: memberId,
					},
					{}
				);

				returnData.push(response as unknown as IDataObject);
			} catch (error: unknown) {
				const err = error as { response?: { data?: { message?: string } }; message?: string };
				throw new Error(`Failed to create draft post: ${err.response?.data?.message || err.message || 'Unknown error'}`);
			}
		}

		return [this.helpers.returnJsonArray(returnData)];
	}
}
