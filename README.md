# Project Goals

## Database

**Main Goal:** To create an organized database that is both efficient and easy to read.

### Products Table

The following table must contain at least:

- Title
- Description
- Price
- Inventory (quantity)
- Category
- Photo
- Tags/filters
- Product ID

### Users Table

The following table must contain at least:

- A valid email address
- Username
- Password
- User ID

### Order Table

The following table must contain at least:

- User ID / Guest ID
- A list of items with:
  - Product’s price (Price must remain fixed at the time of purchase, regardless of current price)
  - Product ID
  - Quantity purchased
- Order ID

### Reviews Table

The following table must contain at least:

- Product ID
- User ID
- Message
- Review ID

## Frontend

**Main Goal:** To create a user-friendly frontend UI, with easy-to-follow navigation and organization.

Visitors should be able to:

### Tier One

- Browse products
- Purchase products
- View individual product details:
  - Description
  - Photos
  - Reviews
- Create an account

### Tier Two

- Filter products by category
- Enjoy an aesthetically pleasing website (Good user experience)
- Navigate the website successfully (screen-reader, keyboard navigation, colorblind options, etc.)
- Helpful Links:
  - [A11y Project Checklist](https://a11yproject.com/checklist)
  - [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- Have a persistent cart:
  - Keep cart when moving from guest to logged-in user
  - Receive errors or updates on the website status (loading spinners, “Item not found”, “Error 404”, etc)

### Tier Three

- Login/Signup through third-party authentication (ex. Google OAuth)
- Receive email confirmations when placing an order
- Receive notifications for specific interactions (ex. Cart updates)
- Filter products with a search field (can use Algolia)
- Enjoy pages of content rather than endless scrolling for better UX
- View featured products (best sellers, newest products, etc)
- Add products to a wishlist

### Tier Four

- Post products to social media accounts (integrating Facebook, Instagram, etc)
- Receive recommended products (based on search history, matching tags, etc)
- Logged-in customers should be able to do everything above, as well as:

### Tier One

- Have a persistent cart
- Have access to their cart across multiple devices
- Exclusively view and edit their cart
- Change desired product quantity
- Remove items from the cart
- Add products to their cart
- Purchase items in the cart

### Tier Two

- View order history (items and prices)
- View and edit user profile

## Administrators

Administrators should be able to do everything above, as well as:

### Tier One

- Have validated data
- Have permissions to:
  - Add products
  - Edit products
  - Delete products
  - View users' information

### Tier Two

- Allow customers to have a variety of payment options (Integrate Stripe)

### Tier Three

- Trigger password resets for a user
- Ensure accurate product inventory (and edit quantities)
- Offer customer discounts with promo codes

### Tier Four

- Visualize relevant KPIs in the admin dashboard (e.g., total sales over time)

## Engineers

Engineers should be able to do everything above, as well as:

### Tier One

- Have access to the database
- Create dummy data
- Secure user data

### Tier Three

- Use continuous integration and delivery (deployment) of the codebase
  - Resources:
    - [What is Continuous Integration?](https://www.atlassian.com/continuous-delivery/continuous-integration)
    - [CircleCI Documentation](https://circleci.com/docs/)
