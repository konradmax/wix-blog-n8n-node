import fetch from 'node-fetch';

export async function publishArticle(apiKey: string, title: string, content: string): Promise<any> {
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
		const response = await fetch(url, {
			method: 'POST',
			headers: headers,
			body: body
		});

		if (!response.ok) {
			throw new Error(`Wix API error: ${response.statusText}`);
		}

		const result = await response.json();
		return result;
	} catch (error: unknown) {
		const err = error as { message?: string };
		throw new Error(`Failed to publish article: ${err.message}`);
	}
}
