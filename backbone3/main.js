var app = {};

app.TodoModel = Backbone.Model.extend({
  defaults: {
    title: '',
    completed: false
  },
  toggle: function() {
    this.save({completed: !this.get('completed')});
  }
})

app.TodoCollection = Backbone.Collection.extend({
  model: app.TodoModel,
  localStorage: new Store("backbone-todo"),
  completed: function() {
    return this.filter(function(model) {
      return model.get('completed');
    });
  },
  remaining: function() {
    return this.without.apply(this, this.completed());
  }
});

app.todoCollection = new app.TodoCollection();

// renders individual todo items list (li)
app.TodoView = Backbone.View.extend({
  tagName: 'li',
  template: Handlebars.compile($('#item-template').html()),
  render: function(){
    this.$el.html(this.template(this.model.toJSON()));
    this.input = this.$('.edit');
    return this; // enable chained calls
  },
  initialize: function() {
    this.model.on('change', this.render, this);
    this.model.on('remove', this.remove, this);
  },
  events: {
    'dblclick label' : 'edit',
    'keypress .edit' : 'updateOnEnter',
    'blur .edit' : 'close',
    'click .toggle': 'toggleCompleted',
    'click .destroy': 'destroy'
  },
  edit: function() {
    this.$el.addClass('editing');
    this.input.focus();
  },
  close: function() {
    var value = this.input.val().trim();
    if (value) {
      this.model.save({title: value});
    }
    this.$el.removeClass('editing');
  },
  updateOnEnter: function(e) {
    if (e.which == 13) {
      this.close();
    }
  },
  toggleCompleted: function(){
    this.model.toggle();
  },
  destroy: function(){
    this.model.destroy();
  }  
});

// renders the full list of todo items calling TodoView for each one.
app.AppView = Backbone.View.extend({
  el: '#todoapp',
  initialize: function () {
    this.input = this.$('#new-todo');
    this.list = this.$('#todo-list');
    // when new elements are added to the collection render then with addOne
    app.todoCollection.on('add', this.addOne, this);
    app.todoCollection.on('reset', this.addAll, this);
    app.todoCollection.fetch(); // Loads list from local storage
  },
  events: {
    'keypress #new-todo': 'createTodoOnEnter'
  },
  createTodoOnEnter: function(e){
    if ( e.which !== 13 || !this.input.val().trim() ) { // ENTER_KEY = 13
      return;
    }
    app.todoCollection.create(this.newAttributes());
    this.input.val(''); // clean input box
  },
  addOne: function(todo){
    var view = new app.TodoView({model: todo});
    this.list.append(view.render().el);
  },
  addAll: function(){
    this.list.html(''); // clean the todo list
    switch(window.filter){
      case 'remaining':
        _.each(app.todoCollection.remaining(), this.addOne, this);
        break;
      case 'completed':
        _.each(app.todoCollection.completed(), this.addOne, this);
        break;            
      default:
        app.todoCollection.each(this.addOne, this);
        break;
    }
  },
  newAttributes: function(){
    return {
      title: this.input.val().trim(),
      completed: false
    }
  }
});

app.Router = Backbone.Router.extend({
  routes: {
    '*filter': 'setFilter'
  },
  setFilter: function(params) {
    console.log('app.router.params = ' + params);
    window.filter = params.trim() || '';
    app.todoCollection.trigger('reset');
  }
})

app.router = new app.Router();
Backbone.history.start();
app.appView = new app.AppView();
