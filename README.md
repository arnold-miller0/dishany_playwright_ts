## Dish Anywhere web sample tests
- Playwright - Typescirpt
- While not signed in

### Base (Home) Page tests
- Copyright and version via API call
- Menu has Home, Guide, DVR, Sports, OnDemand, SignIn
- Note: When small screen size; Menu also has Network 

### Home Page tests
- Copyright and version via API call
- Sample Search 
- Available Now carousel via API call
- Most Popular carousel via API call
- Promotional carousel via API call 

### Guide, DVR, Sports, OnDemand tests
- Note: Since not signed in these pages display the same information
- Copyright and version via API call
- Menu has Home, Guide, DVR, Sports, OnDemand, SignIn
- Displays "Login to view specific page information" text
- Has "SignIn" Button

### SignIn Page test
- Has all display text (like: Username, password, Sign In)
- Copyright and version not displayed
- Attempt SignIn with  no username and pasword
- Attempt SignIn with username and no password
- Attempt SignIn with bas username and password combination

## DONE