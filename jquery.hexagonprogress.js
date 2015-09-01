/*!
  Hexagon Progress jQuery Plugin
  @name jquery.hexagonprogress.js
  @description Draw animated hexagon progress bars
  @author Max Lawrence 
  @version 1.2.0
  @category jQuery plugin
  @copyright (c) 2015 Max Lawrence (http://www.avirtum.com)
  @license Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
*/
(function($) {
    "use strict";
    
    function HexagonProgress(config) {
        this.init(config);
    }
    
    HexagonProgress.prototype = {
        //=============================================
        // Public Section
        //=============================================
        
        /**
         * Size of the hexagon / canvas in pixels. 
         * Number or string ('parent' - minimum width or height of the parent element)
         * @public
         * @type {number|string}
         */
        size: "parent",
        
        /**
         * Range. It should be [0.0; 1.0]
         * @public
         * @type {number}
         */
        value: 0.0,
        
        /**
         * Initial angle for 0.0 value in radians
         * @public
         * @type {number}
         */
        startAngle: Math.PI / 2,
        
        /**
         * Width of the line. By default it's auto-calculated as 1/14 of size
         * @public
         * @type {number}
         */
        lineWidth: null,
        
        /**
         * Line cap ("butt" "round" or "square")
         * Read more: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D.lineCap
         * @public
         * @type {string}
         */
        lineCap: "round",
        
        /**
         * On/off clipping mask. It works if background is not null.
         * @public
         * @type {boolean}
         */
        clip: false,
        
        /**
         * Background. You may set it to:
         *   - solid color:
         *     - { color: "#fb141d" }
         *     - { color: "rgba(255, 255, 255, .5)" }
         *   - image:
         *     - { image: "http://i.imgur.com/HmMu67L.jpg" }
         *     - { image: imageObject }
         * @public
         */
        background: null,
        
        /**
         * Color of the back border. You may set it to:
         *   - solid color:
         *     - { color: "#fb141d" }
         *     - { color: "rgba(255, 255, 255, .5)" }
         * @public
         */
        lineBackFill: {
            color: "rgba(0, 0, 0, .1)"
        },
        
        /**
         * Fill of the border. You may set it to:
         *   - solid color:
         *     - { color: "#fb141d" }
         *     - { color: "rgba(255, 255, 255, .5)" }
         *   - linear gradient (left to right):
         *     - { gradient: ["#fb141d", "#fb0c58"], gradientAngle: Math.PI / 4 }
         *     - { gradient: ["red", "green", "blue"], gradientDirection: [x0, y0, x1, y1] }
         *   - image:
         *     - { image: "http://i.imgur.com/HmMu67L.jpg" }
         *     - { image: imageObject }
         *     - { color: "lime", image: "http://i.imgur.com/HmMu67L.jpg" } - color displayed until the image is loaded
         * @public
         */
        lineFrontFill: {
            gradient: ["#fb141d", "#fb0c58"]
        },
        
        /**
         * Animation config (see jQuery animations: http://api.jquery.com/animate/)
         * @public
         */
        animation: {
            duration: 1800,
            easing: "hexagonEasing"
        },
        
        /**
         * Default animation starts at 0.0 and ends at specified `value`. Let's call this direct animation.
         * @type {number}
         */
        animationStartValue: 0.0,
        
        
        //=============================================
        // Protected Section
        //=============================================
        /**
         * @protected
         */
        constructor: HexagonProgress,
        
        /**
         * Container element. Should be passed into constructor config
         * @protected
         * @type {jQuery}
         */
        el: null,
        
        /**
         * Canvas element. Automatically generated and prepended to the {@link HexagonProgress el}
         * @protected
         * @type {HTMLCanvasElement}
         */
        canvas: null,
        
        /**
         * 2D-context of the {@link HexagonProgress el canvas}
         * @protected
         * @type {CanvasRenderingContext2D}
         */
        ctx: null,
        
        /**
         * Radius of the outer circle. Automatically calculated as {@link HexagonProgress.size / 2}
         * @protected
         * @type {number}
         */
        outerRadius: 0.0,
        
        /**
         * Fill of the line. Automatically calculated, depending on {@link HexagonProgress.lineFrontFill} option
         * @protected
         * @type {string|CanvasGradient|CanvasPattern}
         */
        lineFill: null,
        
        /**
         * Last rendered value
         * @protected
         * @type {number}
         */
        lastValue: 0.0,
        
        /**
         * Coordinates of the hexagon (back)
         * @protected
         * @type {array}
         */
        coordBack: [],
        
        /**
         * Coordinates of the hexagon (front)
         * @protected
         * @type {array}
         */
        coordFront: [],
        
        /**
         * Edges of the hexagon
         * @protected
         * @type {array}
         */
        edges: [],
        
        /**
         * Init/reinit the widget
         * @param {object}
         */
        init: function(config) {
            $.extend(this, config);
            this.initWidget();
            this.initFill();
            this.draw();
        },
        
        /**
         * @protected
         */
        initWidget: function() {
            var canvas = this.canvas = this.canvas || $("<canvas>").prependTo(this.el)[0];
            
            if(this.size == "parent") {
                var h = $(canvas).parent().outerHeight(),
                    w = $(canvas).parent().outerWidth();
                this.size = (h > w ? w : h);
            }
            
            canvas.width = this.size;
            canvas.height = this.size;
            this.ctx = canvas.getContext("2d");
            this.outerRadius = this.size / 2;
        },
        
        /**
         * This method sets {@link HexagonProgress.coordBack}
         * @protected
         */
        initCoordBack: function() {
            var r = this.outerRadius,
            w = this.getLineWidth(),
            r = r - w / 2,
            a = (r * Math.sqrt(3)) / 2,
            b = r / 2,
            x_offset = w / 2,
            y_offset = r - (r * Math.sqrt(3)) / 2 + w / 2,
            x0 = b + x_offset, y0 = 0 + y_offset,
            x1 = x0 + r, y1 = y0 + 0,
            x2 = x1 + b, y2 = y1 + a,
            x3 = x2 - b, y3 = y2 + a,
            x4 = x3 - r, y4 = y3 - 0,
            x5 = x4 - b, y5 = y4 - a,
            coord = [
                {x:x0 ,y:y0},
                {x:x1 ,y:y1},
                {x:x2 ,y:y2},
                {x:x3 ,y:y3},
                {x:x4 ,y:y4},
                {x:x5 ,y:y5},
                {x:x0 ,y:y0}],
            edges = [
                {x:coord[1].x - coord[0].x ,y: coord[1].y - coord[0].y },
                {x:coord[2].x - coord[1].x ,y: coord[2].y - coord[1].y },
                {x:coord[3].x - coord[2].x ,y: coord[3].y - coord[2].y },
                {x:coord[4].x - coord[3].x ,y: coord[4].y - coord[3].y },
                {x:coord[5].x - coord[4].x ,y: coord[5].y - coord[4].y },
                {x:coord[0].x - coord[5].x ,y: coord[0].y - coord[5].y }];
                
            this.coordBack = coord;
            this.edges = edges;
        },
        
        /**
         * This method sets {@link HexagonProgress.coordFront}
         * @protected
         */
        initCoordFront: function(value) {
            var r = this.outerRadius,
            w = this.getLineWidth(),
            a = this.startAngle,
            aBegin = (a * 180 / Math.PI) - 60,
            aBegin = (Math.abs(aBegin) > 360 ? aBegin - Math.floor(aBegin / 360) * 360 : aBegin),
            aBegin = (aBegin < 0 ? 360 + aBegin : aBegin),
            aEnd = aBegin + 360 * value,    // value = [0.0,1.0]
            aEnd = (Math.abs(aEnd) > 360 ? aEnd - Math.floor(aEnd / 360) * 360 : aEnd),
            sectorBegin = Math.floor(aBegin / 60) + 1,
            sectorEnd = Math.floor(aEnd / 60) + 1,
            coefBegin = Math.abs((sectorBegin -1) * 60 - aBegin) / 60,
            coefEnd = Math.abs((sectorEnd -1) * 60 - aEnd) / 60,
            sectorCnt = Math.floor(value / (1/6) + coefBegin) + 1,
            coord = [];
            
            var sector = sectorBegin,
            x = this.edges[sector-1].x * coefBegin + this.coordBack[sector-1].x,
            y = this.edges[sector-1].y * coefBegin + this.coordBack[sector-1].y;
            coord.push({x:x,y:y});
            
            if(sectorCnt > 1) {
                for(var i = 1; i <= 6; i++) {
                    if(sector == sectorEnd && sectorBegin != sectorEnd) {
                        x = this.edges[sector-1].x * coefEnd + this.coordBack[sector-1].x;
                        y = this.edges[sector-1].y * coefEnd + this.coordBack[sector-1].y;
                        coord.push({x:x,y:y});
                        break;
                    } else {
                        x = this.coordBack[sector].x;
                        y = this.coordBack[sector].y;
                        coord.push({x:x,y:y});
                    }
                    
                    sector++;
                    if(sector > 6) {
                        sector = 1;
                    }
                }
            }

            if(sector == sectorEnd && sectorBegin == sectorEnd) {
                x = this.edges[sector-1].x * coefEnd + this.coordBack[sector-1].x;
                y = this.edges[sector-1].y * coefEnd + this.coordBack[sector-1].y;
                coord.push({x:x,y:y});
            }
            
            this.coordFront = coord;
        },
        
        /**
         * This method sets {@link HexagonProgress.lineFill}
         * It could do this async (on image load)
         * @protected
         */
        initFill: function() {
            var self = this,
            ctx = this.ctx;
            
            function setImageLineFill() {
                var bg = $("<canvas>")[0];
                bg.width = self.size;
                bg.height = self.size;
                bg.getContext("2d").drawImage(img, 0, 0, self.size, self.size);
                self.lineFill = self.ctx.createPattern(bg, "no-repeat");
                self.drawFrame(self.lastValue);
            }
            
            if (!this.lineFrontFill) {
                throw Error("The lineFrontFill is not specified!");
            }

            if (this.lineFrontFill.color) {
                this.lineFill = this.lineFrontFill.color;
            }

            if (this.lineFrontFill.gradient) {
                var gr = this.lineFrontFill.gradient;

                if (gr.length == 1) {
                    this.lineFill = gr[0];
                } else if (gr.length > 1) {
                    var ga = this.lineFrontFill.gradientAngle || 0, // gradient direction angle; 0 by default
                    gd = this.lineFrontFill.gradientDirection || [
                        self.size / 2 * (1 - Math.cos(ga)), // x0
                        self.size / 2 * (1 + Math.sin(ga)), // y0
                        self.size / 2 * (1 + Math.cos(ga)), // x1
                        self.size / 2 * (1 - Math.sin(ga))  // y1
                    ];

                    var lg = ctx.createLinearGradient.apply(ctx, gd);

                    for (var i = 0; i < gr.length; i++) {
                        var color = gr[i],
                        pos = i / (gr.length - 1);

                        if ($.isArray(color)) {
                            pos = color[1];
                            color = color[0];
                        }

                        lg.addColorStop(pos, color);
                    }

                    this.lineFill = lg;
                }
            }

            if (this.lineFrontFill.image) {
                var img;

                if (this.lineFrontFill.image instanceof Image) {
                    img = this.lineFrontFill.image;
                } else {
                    img = new Image();
                    img.src = this.lineFrontFill.image;
                }

                if (img.complete) {
                    setImageLineFill();
                } else {
                    img.onload = setImageLineFill;
                }
            }
        },
        
        /**
         * @protected
         */
        draw: function() {
            if (this.animation) {
                this.drawAnimated(this.value);
            } else {
                this.drawFrame(this.value);
            }
        },
        
        /**
         * @protected
         * @param {number}
         */
        drawAnimated: function(value) {
            var self = this,
            el = this.el,
            canvas = $(this.canvas);

            // stop previous animation before new "start" event is triggered
            canvas.stop(true, false);
            el.trigger("hexagon-animation-start");
            
            canvas
                .css({ animationProgress: 0 })
                .animate({ animationProgress: 1 }, $.extend({}, this.animation, {
                    step: function (animationProgress) {
                        var stepValue = self.animationStartValue * (1 - animationProgress) + value * animationProgress;
                        self.drawFrame(stepValue);
                        el.trigger("hexagon-animation-progress", [animationProgress, stepValue]);
                    }
                }))
                .promise()
                .always(function() {
                    // trigger on both successful & failure animation end
                    el.trigger("hexagon-animation-end");
                });
        },
        
        /**
         * @protected
         * @param {number}
         */
        drawFrame: function(value) {
            this.lastValue = value;
            this.ctx.clearRect(0, 0, this.size, this.size);
            this.initCoordBack();
            this.initCoordFront(value);
            
            if(this.background) {
                this.drawWithBackground();
            } else {
                this.drawBack();
                this.drawFront();
            }
        },
        
        /** 
         * @protected
         */
         checkSupportCompositeMode: function (ctx, mode) {
             var oldMode = ctx.globalCompositeOperation,
             result = false;
            
            ctx.globalCompositeOperation = mode;
            if(ctx.globalCompositeOperation == mode) {
                result = true;
            }
            ctx.globalCompositeOperation = oldMode;
            return result;
        },

        /** You should save canvas context before call this function
         * @protected
         */
        makeClipMask: function() {
            var ctx = this.ctx,
            w = this.getLineWidth(),
            outerRadius = this.outerRadius,
            offset = w/2;
                 
            this.outerRadius -= offset;
            this.initCoordBack();
            
            ctx.beginPath();
            ctx.moveTo(this.coordBack[0].x + offset, this.coordBack[0].y + offset);
            for(var i = 0; i < this.coordBack.length; i++) {
                ctx.lineTo(this.coordBack[i].x + offset, this.coordBack[i].y + offset);
            }
            ctx.closePath();

            if(this.checkSupportCompositeMode(ctx, "destination-in")) {
                ctx.globalCompositeOperation = "destination-in";
                ctx.fillStyle = "#fff"; //color doesn't matter, but we want full opacity
                ctx.fill();
            } else {
                ctx.clip();
            }
            
            this.outerRadius = outerRadius;
            this.initCoordBack();
        },
        
        /**
         * @protected
         */
        drawWithBackground: function() {
            var self = this,
             ctx = this.ctx,
             w = this.getLineWidth();
             
            function setImageBackground() {
                var imgWidth = img.width,
                     imgHeight = img.height,
                     percentWidth = self.size / imgWidth,
                     percentHeight = self.size / imgHeight,
                     percent = percentHeight > percentWidth ? percentHeight : percentWidth,
                     newWidth = imgWidth * percent,
                     newHeight = imgHeight * percent,
                     offsetWidth = (self.size - newWidth) / 2,
                     offsetHeight = (self.size - newHeight) / 2;
                
                ctx.save();
                if(self.clip) {
                    if(self.checkSupportCompositeMode(ctx, "destination-in")) {
                        ctx.drawImage(img, 0, 0, img.width, img.height, offsetWidth, offsetHeight, newWidth, newHeight);
                        self.makeClipMask.call(self);
                    } else {
                        self.makeClipMask.call(self);
                        ctx.drawImage(img, 0, 0, img.width, img.height, offsetWidth, offsetHeight, newWidth, newHeight);
                    }
                } else {
                    ctx.drawImage(img, 0, 0, img.width, img.height, offsetWidth, offsetHeight, newWidth, newHeight);
                }
                ctx.restore();
                
                self.drawBack.call(self);
                self.drawFront.call(self);
            };
            
            function setBackgroundColor() {
                ctx.beginPath();
                ctx.rect(0, 0, self.size, self.size);
                ctx.fillStyle = self.background.color;
                ctx.fill();
            }
            
            if (this.background.color) {
                ctx.save();
                if(self.clip) {
                    if(self.checkSupportCompositeMode(ctx, "destination-in")) {
                        setBackgroundColor();
                        self.makeClipMask.call(self);
                    } else {
                        self.makeClipMask.call(self);
                        setBackgroundColor();
                    }
                } else {
                    setBackgroundColor();
                }
                ctx.restore();
                
                self.drawBack.call(self);
                self.drawFront.call(self);
            }
            
            if (this.background.image) {
                var img;

                if (this.background.image instanceof Image) {
                    img = this.background.image;
                } else {
                    img = new Image();
                    img.src = this.background.image;
                }
                
                if (img.complete) {
                    setImageBackground();
                } else {
                    img.onload = setImageBackground;
                }
            }
        },
        
        /**
         * @protected
         */
        drawBack: function() {
            var ctx = this.ctx,
            w = this.getLineWidth();
                
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(this.coordBack[0].x, this.coordBack[0].y);
            for(var i = 0; i < this.coordBack.length; i++) {
                ctx.lineTo(this.coordBack[i].x, this.coordBack[i].y);
            }
            ctx.lineWidth = w;
            ctx.strokeStyle = this.lineBackFill.color;
            ctx.closePath();
            
            ctx.stroke();
            ctx.restore();
        },
        
        /**
         * @protected
         */
        drawFront: function() {
            if(this.value == 0) {
                return;
            }
            
            var ctx = this.ctx,
            w = this.getLineWidth();
                 
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(this.coordFront[0].x, this.coordFront[0].y);
            for(var i = 0; i < this.coordFront.length; i++) {
                ctx.lineTo(this.coordFront[i].x, this.coordFront[i].y);
            }
            ctx.lineWidth = w;
            ctx.strokeStyle = this.lineFill;
            ctx.lineCap = this.lineCap;
            ctx.stroke();
            ctx.restore();
        },
        
        /**
         * @protected
         * @returns {number}
         */
        getLineWidth: function() {
            return $.isNumeric(this.lineWidth) ? this.lineWidth : this.size / 14;
        },

        getValue: function() {
            return this.value;
        },

        setValue: function(newValue) {
            if (this.animation)
                this.animationStartValue = this.lastFrameValue;
            this.value = newValue;
            this.draw();
        }
    };
    
    //=============================================
    // Init jQuery Plugin
    //=============================================
    $.hexagonProgress = {
        // Default options (you may override them)
        defaults: HexagonProgress.prototype
    };
    
    // ease-in-out-cubic
    $.easing.hexagonEasing = function(x, t, b, c, d) {
        if ((t /= d / 2) < 1)
            return c / 2 * t * t * t + b;
        return c / 2 * ((t -= 2) * t * t + 2) + b;
    };
    
    /**
     * Draw animated hexagon progress bar.
     *
     * Appends <canvas> to the element or updates already appended one.
     *
     * If animated, throws 3 events:
     *   - hexagon-animation-start(jqEvent)
     *   - hexagon-animation-progress(jqEvent, animationProgress, stepValue) - multiple event; (animationProgress: from 0.0 to 1.0; stepValue: from 0.0 to value)
     *   - hexagon-animation-end(jqEvent)
     *
     * @param CfgOrCmd - config object or command name
     *     Example: { value: 0.75, size: 50, animation: false };
     *     you may set any public property (see above);
     *     `animation` may be set to false;
     *     you may use .hexagonProgress("canvas") to get the canvas
     *     you may use .hexagonProgress("value", newValue) to dynamically update the value
     *
     * @param CmdArgs - some commands (like "value") may require an argument
     */
    $.fn.hexagonProgress = function(CfgOrCmd, CmdArgs) {
        var dataName = "hexagon-progress",
        instance = this.data(dataName);
        
        if (CfgOrCmd == "canvas") {
            if (!instance) {
                throw Error("Calling 'canvas' method on not initialized instance is forbidden");
            }
            return instance.canvas;
        }

        if (CfgOrCmd == "value") {
            if (!instance) {
                throw Error("Calling 'value' method on not initialized instance is forbidden");
            }
            
            if (typeof CmdArgs == "undefined") {
                return instance.getValue();
            } else {
                var newValue = arguments[1];
                return this.each(function() {
                    $(this).data(dataName).setValue(newValue);
                });
            }
        }
        
        return this.each(function() {
            var el = $(this),
            instance = el.data(dataName),
            config = $.isPlainObject(CfgOrCmd) ? CfgOrCmd : {};

            if (instance) {
                instance.init(config);
            } else {
                var initialConfig = $.extend({}, el.data());
                
                if (typeof initialConfig.lineBackFill == "string") {
                    initialConfig.lineBackFill = JSON.parse(initialConfig.lineBackFill);
                }
                
                if (typeof initialConfig.lineFrontFill == "string") {
                    initialConfig.lineFrontFill = JSON.parse(initialConfig.lineFrontFill);
                }
                
                if (typeof initialConfig.background == "string") {
                    initialConfig.background = JSON.parse(initialConfig.background);
                }
                
                if (typeof initialConfig.animation == "string") {
                    initialConfig.animation = JSON.parse(initialConfig.animation);
                }
                
                config = $.extend(initialConfig, config);
                config.el = el;
                instance = new HexagonProgress(config);
                el.data(dataName, instance);
            }
        });
    }
})(window.jQuery);