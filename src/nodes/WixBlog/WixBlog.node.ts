import {
	INodeType,
	INodeTypeDescription,
	IExecuteFunctions,
	NodeConnectionType
} from 'n8n-workflow';
import { createClient, ApiKeyStrategy } from '@wix/sdk';
import { draftPosts } from '@wix/blog';

export class WixBlog implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Wix Blog',
		name: 'wixBlog',
		group: ['transform'],
		version: 1,
		description: 'Publishes draft posts to Wix Blog using Wix REST API',
		defaults: {
			name: 'Wix Blog',
			color: '#32a852'
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

	async execute(this: IExecuteFunctions): Promise<any> {
		const items = this.getInputData();
		const apiKey = this.getNodeParameter('apiKey', 0) as string;
		const siteId = this.getNodeParameter('siteId', 0) as string;
		const articleTitle = this.getNodeParameter('articleTitle', 0) as string;
		const memberId = this.getNodeParameter('memberId', 0) as string;

		const wixClient = createClient({
			modules: { draftPosts },
			auth: ApiKeyStrategy({
				siteId,
				apiKey
			})
		});

		try {
			const response = await wixClient.draftPosts.createDraftPost(
				{
					title: articleTitle,
					memberId
				},
				{}
			);

			return [this.helpers.returnJsonArray(response as any)];
		} catch (error: unknown) {
			const err = error as { response?: { data?: { message?: string } }; message?: string };
			throw new Error(`Failed to create draft post: ${err.response?.data?.message || err.message || 'Unknown error'}`);
		}
	}
}
