import jwt from 'jsonwebtoken';

const createConfigToken = (pageId, secret) => {
	const payload = JSON.stringify({
	    purchase_options: [
	        {
	            article_id: `reactPage${pageId + 1}`,
	            price: {
	                amount: Math.round(Math.random() * 10000),
	                currency: 'EUR',
	                payment_model: 'pay_now',
	            },
	            sales_model: 'subscription',
	            title: `Page ${pageId + 1} Subscription`,
	            description: 'Using LP config token to display this option',
	            expiry: { unit: 'w', value: pageId + 2 },
	        }
	    ],
	    // template: 'a7df50fd-11f4-4a83-bad2-1f8519a47e08', // BUG: Templates don't work via JWT. Use LP merchant dashboard or the fallback CSS selector.
	});
	const token = jwt.sign(payload, secret, { algorithm: 'HS256', header: { typ: 'JWT' } });
	// console.log({ payload, token });
	return token;
}

export default createConfigToken;