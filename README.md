This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). It shows the integration of LaterPay Connector Classic with a Single Page App.

## Relevant Code
The relevant code for this showcase is located in `src/App.js` and in `src/create-config-token.js`.


## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:8081](http://localhost:8081) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.


#### LaterPay Config Token
If you want to enable the config token, run `REACT_APP_LP_SECRET=my_api_secret npm start`. Replace "my_api_secret" with the API key of your merchant account.


### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
