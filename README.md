# bAmazon
I created an Amazon-like storefront using MySQL. The app will take in orders from customers and deplete stock from the store's inventory.

The app prompts users with two messages:

The first message asks them the ID of the product they would like to buy.
The second message ask how many units of the product they would like to buy.
Once the customer has placed the order, the app checks if the store has enough of the product to meet the customer's request.

If not, the app logs a phrase like "Insufficient quantity!", and then prevents the order from going through.
However, if the store does have enough of the product, the customer's order is fulfilled.

The SQL database is updated to reflect the remaining quantity.
Once the update goes through, the total cost of their purchase is displayed.

If a manager selects View Products for Sale, the app lists every available item: the item IDs, names, prices, and quantities.

If a manager selects View Low Inventory, then it lists all items with an inventory count lower than five.

If a manager selects Add to Inventory, the app displays a prompt that will let the manager "add more" of any item currently in the store.

If a manager selects Add New Product, it allows the manager to add a completely new product to the store.


How to run the app:

In the directory of your choosing(after you git clone the repository bAmazon), type:
npm install

then type:
node bamazon

I've included some input validation.

You can also run separately:

node bamazonCustomer.js

node bamazonManager.js
