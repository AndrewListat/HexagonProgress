# Hexagon Progress jQuery Plugin

==========

* [About](#about)
* [Use](#how-to-use)
* [Demo](#demo)
* [License](#license)

### ABOUT

jQuery Plugin to draw animated hexagon progress bars.

### HOW TO USE

jquery.hexagonprogress.js was built with quick and simple customization in mind. You can easily customize the entire experience by initializing with arguments. 

Example:
```html
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>
<script src="jquery.hexagonprogress.js"></script>

<div id="hexagon"></div>

<script>
    $('#hexagon').hexagonProgress({
        value: 0.55,
        size: 80
    });
</script>
```

Example:
```html
<script type="text/javascript">
    $("#hexagon").hexagonProgress({
        value:0.44,
        startAngle: Math.PI,
        animation:true,
        lineWidth: 5,
        lineCap: "round",
        background: { color : "#0000ff" },
        clip: true,
        lineBackFill: { color : "#fff000" },
        lineFrontFill: { color : "#00ff00" }
    });
</script>
```

### DEMO

Download repository and view the demo folder with an example.


### LICENSE

Released under the [MIT License](http://www.opensource.org/licenses/mit-license.php)

* * *

Copyright :copyright: 2015 Max Lawrence