$(document).ready(function($) {
    "use strict";
    
    $("#hexagon-01").hexagonProgress();
    
    $("#hexagon-02").hexagonProgress({
        value:0.77,
        animation:false
    });
    
    $("#hexagon-03").hexagonProgress({
        value:0.77,
        startAngle: Math.PI,
        animation:false
    });
    
    $("#hexagon-04").hexagonProgress({
        value:0.77,
        startAngle: Math.PI,
        animation:false,
        lineWidth: 3
    });
    
    $("#hexagon-05").hexagonProgress({
        value:0.66,
        startAngle: Math.PI,
        animation:false,
        lineWidth: 4,
        lineCap: "square"
    });
    
    $("#hexagon-06").hexagonProgress({
        value:0.55,
        startAngle: Math.PI,
        animation:false,
        lineWidth: 5,
        lineCap: "butt"
    });
    
    $("#hexagon-07").hexagonProgress({
        value:Math.random(),
        startAngle: Math.PI,
        animation:true,
        lineWidth: 5,
        lineCap: "butt"
    });
    
    $("#hexagon-08").hexagonProgress({
        value:Math.random(),
        startAngle: Math.PI,
        animation:true,
        lineWidth: 5,
        lineCap: "round"
    });
    
    $("#hexagon-09").hexagonProgress({
        value:Math.random(),
        startAngle: Math.PI,
        animation:true,
        lineWidth: 5,
        lineCap: "round",
        background: { color : "#fff000" }
    });
    
    $("#hexagon-10").hexagonProgress({
        value:Math.random(),
        startAngle: Math.PI,
        animation:true,
        lineWidth: 5,
        lineCap: "round",
        background: { color : "#00ff00" }
    });
    
    $("#hexagon-11").hexagonProgress({
        value:Math.random(),
        startAngle: Math.PI,
        animation:true,
        lineWidth: 5,
        lineCap: "round",
        background: { image : "assets/images/hexagon-bg-01.png" }
    });
    
    $("#hexagon-12").hexagonProgress({
        value:Math.random(),
        startAngle: Math.PI,
        animation:true,
        lineWidth: 5,
        lineCap: "round",
        background: { image : "assets/images/hexagon-bg-02.jpg" }
    });
    
    $("#hexagon-13").hexagonProgress({
        value:Math.random(),
        startAngle: Math.PI,
        animation:true,
        lineWidth: 5,
        lineCap: "round",
        background: { color : "#fff000" },
        clip: true
    });
    
    $("#hexagon-14").hexagonProgress({
        value:Math.random(),
        startAngle: Math.PI,
        animation:true,
        lineWidth: 5,
        lineCap: "round",
        background: { color : "#00ff00" },
        clip: true
    });
    
    $("#hexagon-15").hexagonProgress({
        value:Math.random(),
        startAngle: Math.PI,
        animation:true,
        lineWidth: 5,
        lineCap: "round",
        background: { image : "assets/images/hexagon-bg-01.png" },
        clip: true
    });
    
    $("#hexagon-16").hexagonProgress({
        value:Math.random(),
        startAngle: Math.PI,
        animation:true,
        lineWidth: 5,
        lineCap: "round",
        background: { image : "assets/images/hexagon-bg-02.jpg" },
        clip: true
    });
    
    $("#hexagon-17").hexagonProgress({
        value:0.44,
        startAngle: Math.PI,
        animation:true,
        lineWidth: 5,
        lineCap: "round",
        background: { image : "assets/images/hexagon-bg-02.jpg" },
        clip: true,
        lineBackFill: { color : "#fff000"}
    });
    
    $("#hexagon-18").hexagonProgress({
        value:0.55,
        startAngle: Math.PI,
        animation:true,
        lineWidth: 5,
        lineCap: "round",
        background: { image : "assets/images/hexagon-bg-02.jpg" },
        clip: true,
        lineBackFill: { color : "#00ff00"}
    });
    
    $("#hexagon-19").hexagonProgress({
        value:0.44,
        startAngle: Math.PI,
        animation:true,
        lineWidth: 5,
        lineCap: "round",
        background: { image : "assets/images/hexagon-bg-02.jpg" },
        clip: true,
        lineBackFill: { color : "#fff000"},
        lineFrontFill: { color : "#00ff00"}
    });
    
    $("#hexagon-20").hexagonProgress({
        value:0.55,
        startAngle: Math.PI,
        animation:true,
        lineWidth: 5,
        lineCap: "round",
        background: { image : "assets/images/hexagon-bg-02.jpg" },
        clip: true,
        lineBackFill: { color : "#fff"},
        lineFrontFill: { image : "assets/images/hexagon-line.png"}
    });
    
    
    
    
    
    
    
});