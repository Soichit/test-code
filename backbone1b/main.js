

define('main', [
  // 'template1.tpl'
], function(
  // template1_tpl
) {
  'use strict';

  var AppView = Backbone.View.extend({
  // return Backbone.View.extend({
    el: '#container',
  
    template: Handlebars.compile('<h1>{{title}}</h1><p>{{text}}</p>'),
    // template: Handlebars.compile(template1_tpl),
  
    initialize: function() {
      this.render();
    },
  
    render: function() {
      var data = {
        title: "Title :D",
        text: "handlebars!"
      }
      this.$el.html(this.template(data));
    }
  });
  var appView = new AppView();
})