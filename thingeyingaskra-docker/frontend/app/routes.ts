import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
	index("routes/home.tsx"),
	route('/leit/stadur/:placeQuery', 'routes/Search.tsx', { id: 'search-place' }),
	route('/leit/nafn/:nameQuery', 'routes/Search.tsx', { id: 'search-name' }),
	route('/leit/:query', 'routes/Search.tsx', { id: 'search-general' }),
	route('/einstaklingar/', 'routes/Persons.tsx'),
	route('/einstaklingar/:personId', 'routes/Person.tsx'),
	route('/stadir/:placeId?', 'routes/Places.tsx')
] satisfies RouteConfig;
