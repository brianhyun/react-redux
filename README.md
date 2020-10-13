Backend

    ! Port Differences between Express Server and React Application

    The port number you select to run the Express server cannot be 3000.

    React defaults to running your React application on port 3000.
    If your server is already running on port 3000, React will not
    be able to run your application. It'll return an error message in
    the console saying that the port is already in use.

    ! Starting Application in a Different Directory

    npm start --prefix path/to/your/app

    ! Dealing with CORS

    The Express server and the React application are of different origins.
    The former is hosted on http://localhost:4000 and the latter on
    http://localhost:3000.

    Browsers enforce the same-origin policy, which means that browsers of
    different origins cannot share resources between each other--only those of
    the same origin can.

    In order to allow my React application to grab resources from my Express
    server, I can create a proxy server to which all my requests (from
    my React application) will first go. This proxy server will have the
    same origin as my Express server, essentially allowing me to share
    resources between my React application and the Express server.

    ! NPM Package - Concurrently

    Concurrently is an NPM package that allows you to run multiple commands
    on one line using its unique syntax.

    This package is useful for running my Express server and React application.
