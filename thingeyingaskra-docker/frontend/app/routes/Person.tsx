import { Link, NavLink, useParams } from "react-router";
import type { Route } from "./+types/home";
import { Fragment, useEffect, useState } from "react";
import _ from "underscore";

import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

import "leaflet/dist/leaflet.css";
import PersonLink from "../components/PersonLink";
import TabContainer from '../components/TabContainer';
import Panel from "../components/Panel";
import Label from '../components/Label';

import config from '../config.js';


export function meta({}: Route.MetaArgs) {
	return [
		{ title: "Þingeyingaskrá Konráðs Vilhjálmssonar" },
		{ name: "description", content: "Í Þingeyingaskrá Konráðs Vilhjálmssonar er fimmtán þúsund Þingeyingum fylgt frá vöggu til grafar. Konráð Vilhjálmsson fræðimaður vann að skránni í meira enn áratug. Verkið er byggt að miklu leyti á manntölum prestanna. Verkinu skipti Konráð niður í 72 bækur." },
	];
}

function ParentsList(props) {
	const [data, setData] = useState();

	useEffect(() => {
		fetch(config.apiRoot+'/parents/'+props.personId)
			.then(res => res.json())
			.then(json => {
				setData(json.results);

				if (props.onResults) {
					props.onResults(json)
				}
			});
	}, [props.personId]);

	return data && data.length > 0 && <div className={'grow pb-4'+(props.className ? ' '+props.className : '')}>
		<div className="flex flex-col gap-4">
			{
				data.map((item, index) => <PersonLink key={index} item={item} />)
			}
			{/* item.note */}
		</div>
		{
			_.filter(data, (item) => item._id != undefined).length > 0 && <div className="bg-gray-100 border border-gray-200 p-3 mt-4 rounded-md">
				<div className="text-gray-600 text-sm">Athugið að tenglar á foreldra er byggður á einstaklingum og mökum þeirra þar sem nafn passar við foreldra þessa einstaklings. Mögulega geta tenglarnir vísað á rangan einstakling ef fleiri pör í skránni bera sömu nöfn.</div>
			</div>
		}
	</div>
}

function SpouseList(props) {
	const [data, setData] = useState();

	useEffect(() => {
		fetch(config.apiRoot+'/spouse/'+props.personId)
			.then(res => res.json())
			.then(json => {
				setData(json.results);

				if (props.onResults) {
					props.onResults(json)
				}
			});
	}, [props.personId]);

	return data && data.length > 0 && <div className={'grow pb-4'+(props.className ? ' '+props.className : '')}>
		<div className="flex flex-col gap-4">
			{
				data.map((item, index) => <PersonLink key={index} item={item} />)
			}
			{/* item.note */}
		</div>
		{
			_.filter(data, (item) => item._id != undefined).length > 0 && <div className="bg-gray-100 border border-gray-200 p-3 mt-4 rounded-md">
				<div className="text-gray-600 text-sm">Athugið að tenglar á maka er byggður á einstaklingum þar sem nafn maka passa við þennan einstakling. Mögulega geta tenglarnir vísað á rangan einstakling ef fleiri einstaklingar í skránni bera sömu nöfn.</div>
			</div>
		}
	</div>
}

function ChildrenList(props) {
	const [data, setData] = useState();

	useEffect(() => {
		fetch(config.apiRoot+'/children/'+props.personId)
			.then(res => res.json())
			.then(json => {
				setData(json.results);

				if (props.onResults) {
					props.onResults(json)
				}
			});
	}, [props.personId]);

	return data && data.length > 0 && <div className={'grow '+(props.className ? ' '+props.className : '')}>
		<div className="">
			{
				data.map((item, index) => <PersonLink key={index} item={item} />)
			}
		</div>

		<div className="bg-gray-100 border border-gray-200 p-3 mt-4 rounded-md">
			<div className="text-gray-600 text-sm">Athugið að listi yfir börn er byggður á einstaklingum þar sem nöfn foreldra passa við þennan einstakling og nafn maka hans. Því geta önnur nöfn slæðst með ef fleiri einstaklingar eiga foreldra með sama nafni.</div>
		</div>
	</div>
}

export default function Person() {
	const { personId } = useParams();

	const [data, setData] = useState();
	const [indexData, setIndexData] = useState()
	const [mapData, setMapData] = useState();

	const [hideSpouse, setHideSpouse] = useState(true);
	const [hideChildren, setHideChildren] = useState(true);
	const [hideParents, setHideParents] = useState(true);

	useEffect(() => {
		fetch(config.apiRoot+'/person/'+personId)
			.then(res => res.json())
			.then(json => {
				setData(json);

				let _mapData = [];

				json.residence_history.forEach(home => {
					if (home.location_obj && home.location_obj.lat && home.location_obj.lng && _mapData.filter(item => item.id == home.location_obj.id).length == 0) {
						_mapData.push(home.location_obj);
					}
				});
				setMapData(_mapData);
			});

		fetch(config.apiRoot+'/persons/?startId='+personId)
			.then(res => res.json())
			.then(json => {
				setIndexData(json.results);
			});

		}, [personId]);
	
	const formatDate = (date, onlyYear) => {
		const isoDate = false;

		let ret = date || '';

		let safeParseInt = (i) => {
			return Number.isNaN(parseInt(i)) ? '' : parseInt(i);
		}

		let months = [
			'janúar',
			'febrúar',
			'mars',
			'apríl',
			'maí',
			'júní',
			'júlí',
			'ágúst',
			'september',
			'október',
			'nóvember',
			'desember'
		]

		try {
			if (isoDate && date != null) {
				let d = new Date(date);

				ret = onlyYear ?
					d.getFullYear() :
					d.getDate()+'. '+months[d.getMonth()]+' '+d.getFullYear()
				;
			}
			else {
				if (date.indexOf('?') > -1) {
					let dateFrags = date.split('-');

					let year = dateFrags[0].substr(2, 2) == '??' ? (safeParseInt(dateFrags[0].substr(0, 2))+1)+'. öld' : dateFrags[0];
					let month = '';
					let day = '';

					if (dateFrags[1]) {
						month = dateFrags[1].indexOf('?') > -1 ? (dateFrags[2] && dateFrags[2].indexOf('?') != -1 ? '' : '[óþekkt] ') : months[safeParseInt(dateFrags[1])-1]+' ';
					}

					if (dateFrags[2]) {
						day = dateFrags[2].indexOf('?') > -1 ? '' : safeParseInt(dateFrags[2])+'. ';
					}

					ret = day+month+year;
				}
				else if (date.split('-').length > 0) {
					let d = date.split('-');

					ret = onlyYear ? safeParseInt(d[0]) || '' : (d[2] && safeParseInt(d[2]) > 0 ? safeParseInt(d[2])+'. ' : '')+(d[1] && safeParseInt(d[1]) > 0 ? months[safeParseInt(d[1])-1]+' ' : '')+safeParseInt(d[0]);
				}
			}
		}
		catch (e) {}

		return ret;
	};

	return <div className="lg:flex gap-12">
		{
			data && <div className="lg:w-4/5">

				<div className="flex items-center pb-6 px-6 md:px-0 border-b border-gray-300">
					<div className="grow">
						<h1 className="text-3xl">{data.person.name}</h1>
						{
							data.person.status && data.person.status != '' && <div className="mt-2 text-lg italic text-gray-600">{data.person.status}</div>
						}
					</div>
					<a href={data.pageUrl} className="bg-[#267fad] text-white rounded-lg shadow-sm text-sm p-2 px-2 hover:bg-gray-300 hover:shadow-lg transition-all">Skoða skrá</a>
				</div>


				<div className="flex gap-4 py-6 p-6">
					{
						data.person.birth && (data.person.birth.date || data.person.birth.original_string != '') && <div className="w-1/2">
							<Label>Fæðingardagur</Label>
							<div>
								<div className="text-lg">
									{formatDate(data.person.birth.date)}
									{
										data.person.birth.location_obj && <Link className="underline ml-2" to={'/stadir/'+data.person.birth.location_obj.id}>{data.person.birth.location_obj.name}</Link>

									}

								</div>
								<div className="text-sm text-gray-500">{data.person.birth.original_string}</div>
							</div>
						</div>
					}
					{
						data.person.death && (data.person.death.date || data.person.death.original_string != '') && <div className="w-1/2">
							<Label>Dánardagur</Label>
							<div>
								<div className="text-lg">
									{formatDate(data.person.death.date)}
									{
										data.person.death.location_obj && <Link className="underline ml-2" to={'/stadir/'+data.person.death.location_obj.id}>{data.person.death.location_obj.name}</Link>

									}

								</div>
								<div className="text-sm text-gray-500">{data.person.death.original_string}</div>
							</div>
						</div>
					}
				</div>

				<Panel title="Maki" className={hideSpouse ? 'hidden' : ''}>
					<SpouseList personId={personId} onResults={(res) => setHideSpouse(res.results.length == 0)} />
					{
						data.spouse_original_string && <div className="bg-gray-100 border border-gray-200 p-3 rounded-md">
							<div className="pb-2 text-gray-600 text-xs font-bold uppercase">Í handriti:</div>
							{data.spouse_original_string}
						</div>
					}
				</Panel>

				<Panel title="Foreldrar" className={hideParents ? 'hidden' : ''}>
					<ParentsList personId={personId} onResults={(res) => setHideParents(res.results.length == 0)} />
					{
						data.parents_original_string && <div className="bg-gray-100 border border-gray-200 p-3 rounded-md">
							<div className="pb-2 text-gray-600 text-xs font-bold uppercase">Í handriti:</div>
							{data.parents_original_string}
						</div>
					}
				</Panel>


				<TabContainer personId={personId} tabs={[
					{
						title: 'Búsetusaga',
						element: <Fragment>
							{
								data.residence_history && data.residence_history.length > 0 && <div className="pb-4">
									{
										data.residence_history.map((item, index) => <div key={index} className="flex flex-wrap border-b border-gray-300 py-2">
											<div className="w-2/6"><strong>{item.year}</strong>{item.age ? ' ('+item.age+' ára)' : ''}</div>
											<div className="w-2/6">
												{
													item.location_obj && <Link className="underline" to={'/stadir/'+item.location_obj.id}>{item.location_obj.name}</Link>
												}
												{
													!item.location_obj && <span>{item.location}</span>
												}
												{
													item.note_ref && <span> <sup>{item.note_ref}</sup></span>
												}
											</div>
											<div className="w-2/6 text-sm italic">{item.original_string}</div>
										</div>)
									}

									<div className="mt-4">
										<MapContainer className="h-[600px]" center={[65.9, -17]} zoom={8} scrollWheelZoom={false}>
											<TileLayer
												attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
												url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
											/>
											{
												mapData && mapData.map((item, key) => <Marker position={[item.lat, item.lng]} title={item.name}>
													<Popup>
														<div className="text-lg pb-2">{item.name}</div>
														<Link to={'/stadir/'+item.id}>Nánar</Link>
													</Popup>
												</Marker>)
											}
										</MapContainer>
									</div>
								</div>
							}

							{
								data.notes && Object.keys(data.notes).length > 0 && <div className="bg-gray-100 border border-gray-200 p-3 rounded-md">
									<div className="pb-2 text-gray-600 text-xs font-bold uppercase">Neðanmálsgreinar:</div>
									{
										Object.keys(data.notes).map((note) => <div key={note}>{note}: {data.notes[note]}</div>)
									}
								</div>
							}

						</Fragment>
					},
					/*
					{
						title: 'Maki',
						hidden: hideSpouse,
						element: <Fragment>
							<SpouseList personId={personId} onResults={(res) => setHideSpouse(res.results.length == 0)} />
							{
								data.spouse_original_string && <div className="bg-white p-3 rounded-md">
									<div className="pb-2 text-gray-600 text-xs font-bold uppercase">Í handriti:</div>
									{data.spouse_original_string}
								</div>
							}
						</Fragment>
					},
					{
						title: 'Foreldrar',
						hidden: hideParents,
						element: <Fragment>
							<ParentsList personId={personId} onResults={(res) => setHideParents(res.results.length == 0)} />
							{
								data.parents_original_string && <div className="bg-white p-3 rounded-md">
									<div className="pb-2 text-gray-600 text-xs font-bold uppercase">Í handriti:</div>
									{data.parents_original_string}
								</div>
							}
						</Fragment>
					},
					*/
					{
						title: 'Börn',
						hidden: hideChildren,
						element: <Fragment>
							<ChildrenList personId={personId} onResults={(res) => setHideChildren(res.results.length == 0)} />
						</Fragment>
					}
				]} />


			</div>
		}
		{
			indexData && <div className="lg:w-1/5 grid grid-cols-2 sm:grid-cols-3 lg:block">
				{
					indexData.map((item, index) => <Link className={'group block text-sm py-2 px-4 rounded hover:bg-white/20 border border-transparent hover:border-gray-200 hover:shadow-md transition-all '+(item._id == personId ? ' bg-white !border-gray-300 shadow-md ' : '')} key={index} to={'/einstaklingar/'+item._id}>
						<div className="mb-2">
							<span className="font-bold">{item.person.name}</span><div className="text-xs italic">
							{item.person.birth && item.person.birth.date ? item.person.birth.date.split('-')[0] : ''}{' - '}
							{item.person.death && item.person.death.date ? item.person.death.date.split('-')[0] : ''}</div>
						</div>
						<div className={'group-hover:block '+(item._id == personId ? 'block' : 'hidden')}>
							{
								_.uniq(item.residence_history.map(item => item.location)).join(', ')
								
							}
						</div>
					</Link>)
				}
			</div>
		}
	</div>
}
