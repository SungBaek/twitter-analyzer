The application is written for Checkr take home test

Reputation Score:
	Reputation score is calculated using the following equation:
		(#positive words - #negative words) * 3 + number of followers * (1)
	We assume followers's score is 1 for following reasons
		1) To compute the followers reputation score, the page rank algorithm can be used,
			which requires analzying the entire twitter user base
		2) Some twitter accounts such as Google have more than 1 million followers,
			api limits 200 users per request, and 15 requests per 15 minutes.
			Which means, just to analyze the followers of Google, 1,000,000 / 200 = 5,000 requests have to be made
			5,000 requests require 5,000 minutes to process, far from ideal.
	The difference between the number of positive words and negative words is multiplied by 3 as a weight.
	Without the weight of 3, the number of followers dominates the reputation score. 