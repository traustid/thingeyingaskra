import { NavLink, useParams } from "react-router";
import type { Route } from "./+types/home";
import { useEffect, useState } from "react";
import PersonLink from "../components/PersonLink";

import config from '../config.js';

export function meta({}: Route.MetaArgs) {
	return [
		{ title: "Þingeyingaskrá Konráðs Vilhjálmssonar" },
		{ name: "description", content: "Í Þingeyingaskrá Konráðs Vilhjálmssonar er fimmtán þúsund Þingeyingum fylgt frá vöggu til grafar. Konráð Vilhjálmsson fræðimaður vann að skránni í meira enn áratug. Verkið er byggt að miklu leyti á manntölum prestanna. Verkinu skipti Konráð niður í 72 bækur." },
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
