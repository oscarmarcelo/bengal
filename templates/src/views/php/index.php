<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title><%= project %></title>
  <%_ if (styles) { -%>
  <link href="/assets/styles/main.css" rel="stylesheet">
  <%_ } -%>
</head>
<body>
  <h1>Welcome to <%= project %>!</h1>
  <%_ if (scripts) { -%>

  <script src="/assets/scripts/main.js"></script>
  <%_ } -%>
</body>
</html>
