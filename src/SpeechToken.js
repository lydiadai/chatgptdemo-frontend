import axios from 'axios';
import Cookie from 'universal-cookie';

export async function getTokenOrRefresh() {
	const cookie = new Cookie();
	const speechToken = cookie.get('speech-token');

	if (speechToken === undefined) {
		try{
			const speechKey = 'b65b5af87ef84f6e8a02aaf27873992e'
			const speechRegion = 'eastus'
			const headers = {
				headers: {
					'Ocp-Apim-Subscription-Key': speechKey,
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			};
			const tokenResponse = await axios.post(`https://${speechRegion}.api.cognitive.microsoft.com/sts/v1.0/issueToken`, null, headers);
			const token = tokenResponse.data;
			cookie.set('speech-token', speechRegion + ':' + token, {maxAge: 540, path: '/'});

			console.log('Token fetched from back-end: ' + token);
			return { authToken: token, region: speechRegion };
		} catch (err) {
			console.log(err.response.data);
			return { authToken: null, error: err.response.data };
		}
	} else {
		console.log('Token fetched from cookie: ' + speechToken);
		const idx = speechToken.indexOf(':');
		return { authToken: speechToken.slice(idx + 1), region: speechToken.slice(0, idx) };
	}
}
