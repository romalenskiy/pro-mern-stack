function template(body, initialState) {
  return (
    `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <title>Pro MERN Stack</title>
      <link rel="stylesheet" href="/bootstrap/css/bootstrap.min.css">
      <style>
        .panel-heading {
          cursor: pointer;
        }
      </style>
    </head>
    <body>
      <div id="contents">${body}</div>

      <script>window.__INITIAL_STATE__ = ${JSON.stringify(initialState)}</script>
      <script src="/app.bundle.js" ></script>
      <script src="/vendor.bundle.js"></script>
    </body>
    </html>
    `
  )
}

export default template
