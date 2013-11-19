var Notification = Backbone.View.extend({
    tagName: "div",
    className: "notification",

    initialize: function (options) {
        _.extend(this, options);
    },

    render: function () {
        this.$el
            .html(this.options.text)
            .addClass(this.type)
            .delay(this.wait)
            .slideUp("fast");
        return this;
    }
});

var Loader = Notification.extend({
    className: "notification loader",
    render: function () {
        this.$el
            .html(this.options.text)
            .append($("<em>"));
            // we have to create an inline element, because
            // css3 animations doesn't work with pseudo
            // elements on webkit based browsers.
        return this;
    },
    finish: function () {
        this.$el.fadeOut("fast", function () {
            this.$el.remove();
        }.bind(this));
    }
});

var ProgressBar = Loader.extend({
    className: "notification progress",
    update: function (percent) {
        this.$el.find("em").width(percent + "%");
        return this;
    }
});

var Notifier = Backbone.View.extend({
    className: "notifications",

    wait: 1000,

    initialize: function (options) {
        _.extend(this, options);
        this.model.on("flash", this.notify.bind(this, "flash"));
        this.model.on("error", this.notify.bind(this, "error"));
        this.model.on("success", this.notify.bind(this, "success"));
        this.model.on("start:loader", this.startLoader, this);
        this.model.on("finish:loader", this.finishLoader, this);
        this.model.on("start:progress", this.startProgressBar, this);
        this.model.on("finish:progress", this.finishProgressBar, this);
        this.model.on("update:progress", this.updateProgressBar, this);
    },

    notify: function (type, text, wait) {
        var notification = new Notification({
            text: text,
            type: type,
            wait: wait || this.wait
        }).render();
        this.$el.append(notification.$el);
        return notification;
    },

    startLoader: function (text) {
        if (this.loader) { return; }
        this.loader = new Loader({
            text: text
        }).render();
        this.$el.append(this.loader.el);
    },

    finishLoader: function () {
        this.loader.finish();
        this.loader = null;
    },

    startProgressBar: function (text) {
        if (this.progressBar) { return; }
        this.progressBar = new ProgressBar({
            text: text
        }).render();
        this.$el.append(this.progressBar.el);
    },

    updateProgressBar: function (percent) {
        if (!this.progressBar) { return; }
        this.progressBar.update(percent);
    },

    finishProgressBar: function () {
        if (!this.progressBar) { return; }
        this.progressBar.update(100);
        _.delay(this.progressBar.finish.bind(this.progressBar), this.wait);
        this.progressBar = null;
    }

});