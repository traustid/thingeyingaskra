import { useEffect, useState } from "react";
import PersonLink from "~/components/PersonLink";

import _ from 'underscore';

import config from '../config.js';
import { useParams, useSearchParams } from "react-router";
import Label from "~/components/Label.js";

function Persons(props) {
	const [data, setData] = useState();
	const [yearData, setYearData] = useState();
	const [yearMax, setYearMax] = useState();
	
	const [searchParams, setSearchParams] = useSearchParams();

	const minYear = 1700;

	useEffect(() => {
		if (!data) {
			fetch(config.apiRoot+'/persons')
				.then(res => res.json())
				.then(json => setData(json.results));
		}

		if (!yearData) {
			fetch(config.apiRoot+'/years')
				.then(res => res.json())
				.then(json => {
					setYearMax(_.max(Object.keys(json).map(key => json[key])));
					setYearData(json);
				});
		}
	}, []);

	useEffect(() => {
		let params = [];

		if (searchParams.get('rodun')) {
			params.push('order='+searchParams.get('rodun'));
		}
		if (searchParams.get('faedingarar')) {
			params.push('birthyear='+searchParams.get('faedingarar'));
		}
		fetch(config.apiRoot+'/persons?'+params.join('&')
		)
			.then(res => res.json())
			.then(json => setData(json.results));
	}, [searchParams]);

	const orderOptions = [
		['Nafn', ''],
		['Fæðingarár &darr;', 'birth'],
		['Fæðingarár &uarr;', '-birth']
	]

	const colorMap = (n, max) => {
		return 'hsl(20, 100%, '+((n == 0 ? 95 : 80)-(n/max*60))+'%)';
		//return 'hsl('+(n/max*255)+', 100%, 50%)';
	}

	return <div>
		<div className="flex mb-4 pb-4 border-b border-gray-300 items-center justify-end gap-2">
			<div className="font-bold text-[#267fad] text-sm px-5">Röðun:</div>
			{
				orderOptions.map((tab, index) => <div key={index} onClick={() => {
					searchParams.set('rodun', tab[1]);

					if (index == 0) {
						searchParams.delete('faedingarar');
					}
					setSearchParams(searchParams);
				}} className={'bg-gray-100 border-1 text-sm rounded border-gray-300 shadow-sm py-1 px-2 hover:bg-gray-300 hover:shadow-lg transition-all cursor-pointer'+(searchParams.get('rodun') == tab[1] || (!searchParams.get('rodun') && index == 0) ? ' bg-gray-200 font-bold text-gray-600 border-gray-400' : '')} dangerouslySetInnerHTML={{__html: tab[0]}} />)
			}
		</div>

		{/*
			searchParams.get('rodun') && searchParams.get('rodun')?.indexOf('birth') > -1 && <div className="flex mb-4 pb-4 border-b border-gray-300 items-center justify-end gap-2 flex-wrap">
				{
					Array.from(Array(1901-minYear).keys()).map((year, index) => <div onClick={() => {
						searchParams.set('faedingarar', year+minYear);
						setSearchParams(searchParams);
					}} className={'bg-gray-100 border-1 text-sm rounded border-gray-300 shadow-sm py-1 px-2 hover:bg-gray-300 hover:shadow-lg transition-all cursor-pointer'+(searchParams.get('faedingarar') == year+minYear || (!searchParams.get('faedingarar') && index == 0) ? ' bg-gray-200 font-bold text-gray-600 border-gray-400' : '')}>{year+minYear}</div>)
				}
			</div>

		*/}

		{
			yearData && <div>
				<div className="flex mb-4 pb-4 border-b border-gray-300 justify-around items-end cursor-pointer">
					{
						Object.keys(yearData).map(year => <div key={year} className={'group grow relative'} style={{
							backgroundColor: colorMap(yearData[year], yearMax),
							height: ((yearData[year]/yearMax)*40)+10
						}} onClick={() => {
							searchParams.set('faedingarar', year);
							setSearchParams(searchParams);
						}}>
							<div className="absolute opacity-0 group-hover:opacity-100 -bottom-12 p-2 bg-white rounded shadow border border-gray-200 -ml-8 pointer-events-none" dangerouslySetInnerHTML={{__html: year+'&nbsp('+yearData[year]+')'}} />
						</div>)
					}
				</div>
				{
					data && searchParams.get('faedingarar') && <div className="mb-4 bg-gray-100 border border-gray-200 p-3 rounded-md flex gap-2 divide-solid divide-gray-300">
						<span className="pr-4 mr-2 border-r border-gray-400">Fæðingarár: <span className="font-bold">{searchParams.get('faedingarar')}</span></span>
						<span className="pr-4 mr-2 border-r border-gray-400 underline cursor-pointer" onClick={() => {
							searchParams.delete('faedingarar');
							setSearchParams(searchParams);
						}}>Sýna allt</span>
						{data.length} niðurstöður.
					</div>
				}
			</div>
		}

		{
			data && data.map((item, index) => <PersonLink key={index} item={item} />)
		}
	</div>
}

export default Persons;