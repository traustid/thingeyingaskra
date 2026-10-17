import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
	index("routes/home.jsx"),
	route('/leit/stadur/:placeQuery', 'routes/Search.jsx', { id: 'search-place' }),
	route('/leit/nafn/:nameQuery', 'routes/Search.jsx', { id: 'search-name' }),
	route('/leit/:query', 'routes/Search.jsx', { id: 'search-general' }),
	route('/einstaklingar/', 'routes/Persons.jsx'),
	route('/einstaklingar/:personId', 'routes/Person.jsx'),
	route('/stadir/:placeId?', 'routes/Places.jsx'),
	route('/um', 'routes/About.jsx')
] satisfies RouteConfig;
