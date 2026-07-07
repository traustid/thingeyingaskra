import { NavLink, useParams } from "react-router";
import type { Route } from "./+types/home";
import { useEffect, useState } from "react";
import PersonLink from "../components/PersonLink";

import config from '../config.js';

export function meta({}: Route.MetaArgs) {
	return [
		{ title: "New React Router App" },
		{ name: "description", content: "Welcome to React Router!" },
	];
}

export default function Search() {
	const { query, nameQuery, placeQuery } = useParams();

	const [data, setData] = useState();

	useEffect(() => {
		let searchParams = [];

		if (query) {
			searchParams.push('search='+query);
		}

		if (nameQuery) {
			searchParams.push('name='+nameQuery);
		}

		if (placeQuery) {
			searchParams.push('location='+placeQuery);
		}

		fetch(config.apiRoot+'/search/?'+searchParams.join('&'))
			.then(res => res.json())
			.then(json => setData(json.results));

		}, [query, nameQuery]);

	return <div>
		{
			data && <div>

				<div className="mb-4 bg-gray-100 border border-gray-200 p-3 rounded-md flex gap-2 divide-solid divide-gray-300">
					{query && <span className="pr-4 mr-2 border-r border-gray-400">Leitarorð: <span className="font-bold">{query}</span></span>}
					{nameQuery && <span className="pr-4 mr-2 border-r border-gray-400">Nafn: <span className="font-bold">{nameQuery}</span></span>}
					{placeQuery && <span className="pr-4 mr-2 border-r border-gray-400">Staður: <span className="font-bold">{placeQuery}</span></span>}
					{data.length} niðurstöður.
				</div>
				
				{
					data.map((item, index) => <PersonLink item={item} key={index} />)
				}
			</div>
		}
	</div>
}
