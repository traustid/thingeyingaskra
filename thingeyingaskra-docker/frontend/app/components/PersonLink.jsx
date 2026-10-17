import { NavLink } from "react-router";
import _ from 'underscore';
import Label from "./Label";
import ResidenceHistoryItem from "./ResidenceHistoryItem";
import { useState } from "react";

function PersonLink(props) {
	const [historyExpanded, setHistoryExpanded] = useState(false);

	if (props.item && !props.item.person) {
		return <div className="flex flex-wrap border-b border-gray-300 py-2">
			<div className="font-bold w-1/2">{props.item.name}</div>
		</div>
	}
	if (props.item && props.item.person) {
		return <div className={'py-2 px-4 rounded hover:bg-gray-100/40 border-b border-gray-200 border-t border-t-transparent hover:border-t-gray-200 hover:border hover:shadow-md transition-all '+props.className}>
			<NavLink className={'group md:flex flex-wrap'} to={'/einstaklingar/'+props.item._id}>
				<div className="md:w-1/2">
					{
						props.headerText && <Label>
							{props.headerText}
						</Label>
					}
					<div className="font-bold group-hover:underline">
						{props.item.person.name}
					</div>
					{
						<div className="text-sm">
							{props.item.person.birth ? props.item.person.birth.original_string : ''}{' - '}
							{props.item.person.death ? props.item.person.death.original_string : ''}
						</div>
					}
					{
						!props.hideInfo && props.item.person.status && <div className="text-sm italic text-gray-600">{props.item.person.status}</div>
					}
				</div>

				{
					!props.hideInfo && <div className="md:w-1/2">
						{
							props.item.spouse && props.item.spouse.length > 0 &&
							<div className="text-sm mt-1"><span className="font-bold text-gray-500">Maki:</span> {props.item.spouse.map(p => p.name).join(', ')}</div>
						}
						{
							props.item.parents && props.item.parents.length > 0 &&
							<div className="text-sm mt-1"><span className="font-bold text-gray-500">Foreldrar:</span> {props.item.parents.map(p => p.name).join(', ')}</div>
						}
					</div>
				}
			</NavLink>

			{
				props.item.residence_history && !props.hideInfo && <div className="w-full mt-2">
				<div className={'text-sm'+(props.expandableHistory ? ' cursor-pointer link group hover:underline' : '')}
					onClick={() => {
						if (props.expandableHistory) {
							setHistoryExpanded(!historyExpanded);
						}
					}}
				>
					{
						_.uniq(_.compact(props.item.residence_history.map(item => item.location_obj ? item.location_obj.name : item.location || null))).join(', ')
					}
					{
						props.expandableHistory && <span className="inline-block ml-2 font-bold text-gray-400 group-hover:text-gray-500">{historyExpanded ? '-' : '+'}</span>
					}
				</div>
				{
					props.expandableHistory && historyExpanded && <div className="">
						{
							props.item.residence_history.map((item, index) => <ResidenceHistoryItem key={index} personId={props.item.id} item={item} notes={props.item.notes} />)
						}
					</div>
				}
			</div>
			}


		</div>
	}
}

export default PersonLink;