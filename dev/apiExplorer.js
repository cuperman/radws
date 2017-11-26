const { flatten, uniqBy } = require('lodash');

module.exports = routes => {
  const methods = uniqBy(routes, route => route.method)
    .map(route => {
      return { label: route.method, value: route.method };
    });

  const paths = uniqBy(routes, route => route.path)
    .map(route => {
      return { label: route.path, value: route.path };
    });

  const ids = uniqBy(flatten(routes.map(route => {
    const ids = route.path.match(/\{(\w)+\}/g);
    if (!ids) {
      return [];
    }
    return ids.map(id => {
      return { label: id, name: id };
    });
  })), (id => id.name));

  return (req, res) => {
    res.render('api_explorer', { methods, paths, ids });
  };
};
