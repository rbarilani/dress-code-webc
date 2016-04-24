Dress Code Web Components (wip)
===============================

A set of web components based on [Dress Code](https://zalando.github.io/dress-code) style library.

### Install

```bash
npm install dress-code-webc --save
```

### Usage

```html

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <script src="https://cdnjs.cloudflare.com/ajax/libs/webcomponentsjs/0.7.22/webcomponents.js"></script>

    <!-- load desired web component -->
    <link rel="import" href="./node_modules/dress-code-webc/dc-btn.html">

</head>
<body>
    <!-- use custom html element -->
    <dc-btn modifiers="primary large">My Button<dc-btn>
</body>
</html>
```
