//Define navigaton route configurations

Router.configure({
  layoutTemplate: 'main'
});

Router.route('/tweets', {
    template: 'tweets'
});

Router.route('/', {
    template: 'home'
});

Router.route('/home', {
    template: 'home'
});

Router.route('/stats', {
    template: 'stats'
});

Router.route('/map', {
    template: 'map'
});