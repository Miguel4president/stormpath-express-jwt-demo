# Express-Stormpath Example Project

A simple Express.js web application to demonstrate core Stormpath functionality.  In this application you can see:

* The default registration and login pages that `express-stormpath` can provide to your application.
* How you can require authentication for custom API routes.
* Updating the custom data of the Stormpath user object, with a custom profile form.
* Cross-domain authentication, when CORS is required.

### Get Started!

1. Clone this repo to your computer, and cd into the project directory:

  ```bash
  git clone https://github.com/stormpath/express-stormpath-sample-project.git
  cd express-stormpath-sample-project
  ```

2. Install the dependencies from package.json:

  ```bash
  npm install
  ```

3. Export your Stormpath API Key ID / Secret and Application HREF Environment Variables:

  ```bash
  export STORMPATH_CLIENT_APIKEY_ID=xxx
  export STORMPATH_CLIENT_APIKEY_SECRET=xxx
  export STORMPATH_APPLICATION_HREF=xxx
  ```

4. Start the server:

  ```bash
  node server.js
  ```

5. Visit [http://localhost:3000/](http://localhost:3000/) in your browser

6. Checkout [http://localhost:3000/routes](http://localhost:3000/routes) to see what is available.

7. After login, grab a token at [http://localhost:3000/newToken](http://localhost:3000/newToken).

8. Start the dummy microservice
  ```bash
  npm run service
  ```

9. Hit [http://localhost:3001/data](http://localhost:3000/data) to verify if your token works (aka your stormpath user has the viewData permission)

## Learn More
Visit [http://docs.stormpath.com/nodejs/express/latest/](http://docs.stormpath.com/nodejs/express/latest/)

## Contact Stormpath Support
[support@stormpath.com](mailto:support@stormpath.com)
