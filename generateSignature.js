const crypto = require('crypto');

// STEP 1: Replace with your AUTOTRADER_WEBHOOK_SECRET
const secret = 'sk_test_8394b2e4c4e968af7f3b2b63fe5b8a71f84c9b3d'; // replace with yours

// STEP 2: Paste the raw body (must be minified — one line)
const rawBody = '{"id":"8a46978d8b8505e8018b91d9483a332a","time":"2023-12-05T10:59:13.32Z","type":"STOCK_UPDATE","clientId":"1234","data":{"advertiser":{"advertiserId":"123456"},"metadata":{"stockId":"8a46978d8b8505e8018b91d9483a332a","searchId":"202311028630122","versionNumber":17,"lifecycleState":"SALE_IN_PROGRESS","externalStockId":"PENYS73USL","lastUpdated":"2023-12-05T10:59:13.32Z","lastUpdatedByAdvertiser":"2023-12-05T10:59:13.32Z","dateOnForecourt":"2023-11-07"},"vehicle":{"vehicleType":"Van","bodyType":"Panel Van","fuelType":"Diesel","transmissionType":"Manual","doors":6,"badgeEngineSizeLitres":1.5,"engineCapacityCC":1499,"plate":"73","ownershipCondition":"Used","make":"Vauxhall","model":"Combo","registration":"YS73USL","vin":"W0VEFYHT2PJ831568","derivative":"1.5 Turbo D 2300 Prime Panel Van 6dr Diesel Manual L2 H1 Euro 6 (s/s) (100 ps)"},"stockEventSource":"PORTAL"}}';

// STEP 3: Generate timestamp (in seconds)
const timestamp = Math.floor(Date.now() / 1000).toString();

// STEP 4: Create HMAC signature
const value = `${timestamp}.${rawBody}`;
const signature = crypto.createHmac('sha256', secret).update(value).digest('hex');

// STEP 5: Output the header
console.log(`\nUse this header in Postman:\n`);
console.log(`autotrader-signature: t=${timestamp},v1=${signature}`);
