import { Link, NavLink, useNavigate, useParams } from "react-router";
import { Fragment, useEffect, useRef, useState } from "react";
import _ from "underscore";

import { CircleMarker, MapContainer, Marker, Pane, Popup, TileLayer, Tooltip } from 'react-leaflet';

import "leaflet/dist/leaflet.css";
import config from '../config.js';
import PersonLink from "~/components/PersonLink";
import Panel from "~/components/Panel";

export function meta() {
	return [
		{ title: "Þingeyingaskrá Konráðs Vilhjálmssonar" },
		{ name: "description", content: "Í Þingeyingaskrá Konráðs Vilhjálmssonar er fimmtán þúsund Þingeyingum fylgt frá vöggu til grafar. Konráð Vilhjálmsson fræðimaður vann að skránni í meira enn áratug. Verkið er byggt að miklu leyti á manntölum prestanna. Verkinu skipti Konráð niður í 72 bækur." },
	];
}

export default function Places() {
	const [mapData, setMapData] = useState();
	const [relatedMapData, setRelatedMapData] = useState();
	const [selectedPlace, setSelectedPlace] = useState();
	const [personList, setPersonList] = useState();
	const [minMax, setMinMax] = useState();
	const [yearMinMax, setYearMinMax] = useState();
	const [relMinMax, setRelMinMax] = useState();
	const [groupedYears, setGroupedYears] = useState();

	const { placeId } = useParams();
	const navigate = useNavigate();

	const mapRef = useRef();

	useEffect(() => {
		setMapData([]);

		fetch(config.apiRoot+'/places/')
			.then(res => res.json())
			.then(json => {
				const minValue = _.min(_.pluck(json.results, 'records_count'));
				const maxValue = _.max(_.pluck(json.results, 'records_count'));

				setMinMax({
					min: minValue,
					max: maxValue
				});

				setMapData(json.results);

				let bounds = _.filter(json.results, i => i.lat && i.lng).map(i => [i.lat, i.lng]);

				if (mapRef.current) {
					mapRef.current.fitBounds(bounds, {
						maxZoom: 10,
						padding: [50, 50]
					});
				}

			});
	}, []);

	console.log(yearMinMax)

	const generatePeriodBuckets = (minYear, maxYear) => {
		const periods = [];

		const remainder = minYear % 5;
		let currentStart = minYear;

		if (remainder !== 0) {
			const firstEnd = minYear + (4 - remainder);
			const actualEnd = Math.min(firstEnd, maxYear);
			
			periods.push({
			start: currentStart,
			end: actualEnd,
			label: `${currentStart}-${actualEnd}`
			});
			
			currentStart = actualEnd + 1;
		}

		while (currentStart <= maxYear) {
			const currentEnd = Math.min(currentStart + 4, maxYear);
			periods.push({
			start: currentStart,
			end: currentEnd,
			label: `${currentStart}-${currentEnd}`
			});
			currentStart = currentEnd + 1;
		}

		return periods;
	}

	useEffect(() => {
		if (!placeId) {
			setPersonList(null);
			setSelectedPlace(null);
			setRelatedMapData(null);
		}

		if (placeId) {
			fetch(config.apiRoot+'/place/'+placeId)
				.then(res => res.json())
				.then(json => {
					setPersonList(json.results);
					setSelectedPlace(json.place);

					let minYear = _.min(_.pluck(json.results, 'year_from'));
					let maxYear = _.max(_.pluck(json.results, 'year_to'));

					setYearMinMax({
						minYear: minYear,
						maxYear: maxYear
					});

					let periods = generatePeriodBuckets(minYear, maxYear);

					let grouped = {};

					json.results.forEach(item => {
						periods.forEach(period => {
							const hasOverlap = item.year_from <= period.end && item.year_to >= period.start;

							if (hasOverlap) {
								if (!grouped[period.label]) {
									grouped[period.label] = [];
								};

								grouped[period.label].push(item);
							}
						});
					});

					setGroupedYears(grouped);
				});

			fetch(config.apiRoot+'/related_places/'+placeId)
				.then(res => res.json())
				.then(json => {
					const minValue = _.min(_.pluck(json.results, 'shared_people_count'));
					const maxValue = _.max(_.pluck(json.results, 'shared_people_count'));
					setRelMinMax({
						min: minValue,
						max: maxValue
					});
					setRelatedMapData(json.results);
				});
		}
	}, [placeId]);

	return <div>
		{
			selectedPlace && <div className="pb-6 px-6 md:px-0 border-b border-gray-300">
				<Link to={'/stadir/'} className="mb-4 block"><span className="text-xl mr-2">&lsaquo;</span> <span className="underline">Sjá alla staði</span></Link>
				<h1 className="text-3xl">{selectedPlace.name}</h1>
				<div>{selectedPlace.parent[0].name}</div>
			</div>
		}

		<div className="flex gap-6">
			{
				personList && personList.length > 0 && groupedYears && <Panel className="mt-4 w-1/3">
					{
						selectedPlace && personList && <div className="mb-4 bg-gray-100 border border-gray-200 p-3 rounded-md flex gap-2 divide-solid divide-gray-300">
							{_.uniq(personList, (p => p._id)).length} einstaklingar.
						</div>
					}
					{
						Object.keys(groupedYears).map(period => <div key={period} className="mb-4">
							<div className="text-lg text-center mb-4 text-[#267fad] font-bold">{period}</div>
							{
								groupedYears[period].map((item, index) => <PersonLink key={index} 
									item={item}
									headerText={item.year}
								/>)
							}
						</div>)
					}
				</Panel>
			}

			<div className={'mt-4'+(personList && personList.length > 0 ? ' w-2/3' : ' w-full')}>
				<MapContainer ref={mapRef} className="h-[600px] min-h-[95vh] sticky top-5 rounded-lg oveflow-hidden" center={[65.9, -17]} zoom={8} scrollWheelZoom={false}>
					<TileLayer
						attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
						url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
					/>
					{
						relatedMapData && _.filter(relatedMapData, item => item.location_obj.lat && item.location_obj.lng).map((item, key) => <CircleMarker key={key}
							center={[item.location_obj.lat, item.location_obj.lng]} 
							pathOptions={{
								radius: ((item.shared_people_count/relMinMax.max)*15)+4,
								weight: 1,
								fillOpacity: 0.4,
								color: '#3311ad'
							}}
							eventHandlers={{
								click: (e) => {
									navigate('/stadir/'+item.location_obj.id);
								},
							}}
						>
							<Tooltip>{item.location_obj.name}</Tooltip>
							{/*
							<Popup>
								<div className="text-lg pb-2">{item.location_obj.name}</div>
								<Link to={'/stadir/'+item.location_obj.id}>Nánar</Link>
							</Popup>
							*/}
						</CircleMarker>)
					}
					{
						mapData && _.filter(mapData, item => item.lat && item.lng).map((item, key) => <CircleMarker key={key}
							center={[item.lat, item.lng]} 
							pathOptions={{
								radius: selectedPlace ? 3 : ((item.records_count/minMax.max)*15)+4,
								weight: 1,
								color: '#ff0000'
							}}
							eventHandlers={{
								click: (e) => {
									navigate('/stadir/'+item.id);
								},
							}}
						>
							<Tooltip>{item.name}</Tooltip>
							{/*
							<Popup>
								<div className="text-lg pb-2">{item.name}</div>
								<Link to={'/stadir/'+item.id}>Nánar</Link>
							</Popup>
							*/}
						</CircleMarker>)
					}
					{
						selectedPlace && selectedPlace.lat && selectedPlace.lng && <Marker position={[selectedPlace.lat, selectedPlace.lng]} 
							title={selectedPlace.name}
						>
							<Popup>
								{selectedPlace.name}
							</Popup>
						</Marker>
					}
				</MapContainer>
			</div>
		</div>

	</div>
}
