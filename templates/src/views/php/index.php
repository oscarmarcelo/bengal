<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title><%= project %></title>
  <link href="/assets/styles/main.css" rel="stylesheet">
</head>
<body>
  <h1>Welcome to <%= project %>!</h1>
  <%_ if (scripts) { -%>
  <script src="/assets/scripts/main.js"></script>
  <%_ } -%>
</body>
</html>
