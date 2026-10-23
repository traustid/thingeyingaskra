import { useEffect, useState } from "react";
import Label from "./Label";
import { Link } from "react-router";

import config from "../config";
import PersonLink from "./PersonLink";

function ResidenceHistoryItem(props) {
	const item = props.item;

	const [sameYearInfo, setSameYearInfo] = useState();

	useEffect(() => {
		setSameYearInfo(null);
	}, [props.personId])

	return <div className="flex flex-wrap border-b border-gray-300 py-2">
		<div className={'w-2/6'+(item.location_obj ? ' underline decoration-dotted cursor-pointer' : '')} onClick={() => {
			if (!sameYearInfo && item.location_obj) {
				fetch(config.apiRoot+'/place/'+item.location_obj.id+'?year_from='+item.year_from_value+'&year_to='+item.year_to_value)
					.then(res => res.json())
					.then(json => setSameYearInfo(json.results.filter(item => item._id != props.personId)))
			}
		}}><strong>{item.year_from_value+(item.year_from_value != item.year_to_value ? '-'+item.year_to_value : '')}</strong>{item.age ? ' ('+item.age+' ára)' : ''}</div>
		<div className="w-2/6">
			{
				item.location_obj && <Link className="underline" to={'/stadir/'+item.location_obj.id}>{item.location_obj.name}</Link>
			}
			{
				!item.location_obj && <span>{item.location}</span>
			}
			{
				item.note_ref && props.notes && props.notes[item.note_ref] && <span> <sup title={props.notes && props.notes[item.note_ref] ? props.notes[item.note_ref] : null}>{item.note_ref}</sup></span>
			}
		</div>
		<div className="w-2/6 text-sm italic">{item.original_string}</div>
		{
			sameYearInfo && <div className="w-full grow bg-gray-100 border border-gray-300 p-4 mt-2 rounded">
				<Label>Samtíða á þessu tímabili</Label>
				<div className="flex flex-wrap">
					{
						sameYearInfo.map((item, index) => <PersonLink key={index} item={item} hideInfo={true} className="w-1/2" /> )
					}
				</div>
			</div>
		}
	</div>
}

export default ResidenceHistoryItem;